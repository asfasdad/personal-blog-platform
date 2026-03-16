#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const parseArgs = (argv) => {
  const output = {};
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (!arg.startsWith("--")) continue;
    const key = arg.slice(2);
    const value = argv[i + 1];
    if (!value || value.startsWith("--")) {
      output[key] = "true";
      continue;
    }
    output[key] = value;
    i += 1;
  }
  return output;
};

const ensureHttpUrl = (value) => {
  if (!value) {
    throw new Error("Missing --base-url argument.");
  }
  const url = new URL(value);
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("--base-url must be http/https.");
  }
  return value.replace(/\/$/, "");
};

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const requestWithRetry = async (url, options = {}, attempts = 5) => {
  let lastResponse;
  for (let i = 0; i < attempts; i += 1) {
    try {
      const response = await fetch(url, options);
      lastResponse = response;
      if (response.status < 500 && response.status !== 404) {
        return response;
      }
    } catch {
      // retry
    }
    await wait(1000);
  }
  return lastResponse;
};

const expectOk = async (baseUrl, route) => {
  const response = await requestWithRetry(`${baseUrl}${route}`);
  if (!response?.ok) {
    const status = response?.status ?? "no-response";
    throw new Error(`Smoke check failed for ${route}: HTTP ${status}`);
  }
  return {
    route,
    status: response.status,
    ok: true,
  };
};

const expectOptional = async (baseUrl, route) => {
  const response = await requestWithRetry(`${baseUrl}${route}`);
  const status = response?.status ?? "no-response";
  if (!response?.ok) {
    return {
      route,
      status,
      ok: false,
      optional: true,
    };
  }
  return {
    route,
    status: response.status,
    ok: true,
    optional: true,
  };
};

const expectAdminProtected = async (baseUrl, route) => {
  const response = await requestWithRetry(`${baseUrl}${route}`, { redirect: "manual" });
  if (!response) {
    throw new Error(`/admin access control check failed: no response`);
  }
  const location = response.headers.get("location") ?? "";
  const hasLoginRedirect = location.includes("/admin/login");
  const protectedStatuses = new Set([301, 302, 303, 307, 308, 401, 403]);
  const protectedByStatus = protectedStatuses.has(response.status);
  const isProtected = hasLoginRedirect || protectedByStatus;

  if (!isProtected) {
    throw new Error(
      `/admin access control check failed: expected redirect/unauthorized, got HTTP ${response.status}`
    );
  }

  return {
    route,
    status: response.status,
    ok: true,
    location,
    protectedByStatus,
    hasLoginRedirect,
  };
};

const writeEvidence = (reportPath, payload) => {
  if (!reportPath) return;
  const abs = path.resolve(process.cwd(), reportPath);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, JSON.stringify(payload, null, 2), "utf8");
};

const main = async () => {
  const args = parseArgs(process.argv.slice(2));
  const baseUrl = ensureHttpUrl(args["base-url"]);
  const reportPath = args["report-path"];

  const checks = [];
  checks.push(await expectOk(baseUrl, "/"));
  checks.push(await expectOk(baseUrl, "/blog/hello-world/"));
  checks.push(await expectOk(baseUrl, "/search/"));
  // Additional production verification endpoints for smoke validation
  checks.push(await expectOk(baseUrl, "/rss.xml"));
  checks.push(await expectOk(baseUrl, "/favicon.svg"));
  checks.push(await expectOptional(baseUrl, "/pagefind/pagefind-ui.js"));
  checks.push(await expectOptional(baseUrl, "/pagefind/pagefind-ui.css"));
  checks.push(await expectAdminProtected(baseUrl, "/admin"));

  const payload = {
    generatedAt: new Date().toISOString(),
    baseUrl,
    checks,
  };

  writeEvidence(reportPath, payload);
  console.log(`Smoke checks passed for ${baseUrl}`);
  if (reportPath) {
    console.log(`Wrote smoke report: ${path.resolve(process.cwd(), reportPath)}`);
  }
};

main().catch((error) => {
  console.error("smoke checks failed:", error);
  process.exit(1);
});
