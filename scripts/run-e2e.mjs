import { createServer } from "node:net";
import { spawn, spawnSync } from "node:child_process";

const findFreePort = () =>
  new Promise((resolve, reject) => {
    const server = createServer();
    server.unref();
    server.on("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      if (!address || typeof address === "string") {
        server.close(() => reject(new Error("Failed to allocate a free E2E port.")));
        return;
      }

      const { port } = address;
      server.close(error => {
        if (error) {
          reject(error);
          return;
        }
        resolve(port);
      });
    });
  });

const run = async () => {
  const port = String(await findFreePort());
  const extraArgs = process.argv.slice(2);
  const prepEnv = {
    ...process.env,
    NO_PROXY: "127.0.0.1,localhost",
    no_proxy: "127.0.0.1,localhost",
    HTTP_PROXY: "",
    HTTPS_PROXY: "",
    ALL_PROXY: "",
    http_proxy: "",
    https_proxy: "",
    all_proxy: "",
  };

  const build = spawnSync("pnpm build", {
    stdio: "inherit",
    shell: true,
    env: prepEnv,
  });

  if (build.status !== 0) {
    process.exit(build.status ?? 1);
  }

  const quotedArgs = extraArgs
    .map(arg => (arg.includes(" ") ? `\"${arg.replaceAll("\"", "\\\"")}\"` : arg))
    .join(" ");
  const command = `pnpm exec playwright test --config playwright.config.ts${quotedArgs ? ` ${quotedArgs}` : ""}`;

  const child = spawn(command, {
    stdio: "inherit",
    shell: true,
    env: {
      ...prepEnv,
      E2E_PORT: port,
    },
  });

  child.on("exit", code => {
    process.exit(code ?? 1);
  });
  child.on("error", error => {
    console.error(error);
    process.exit(1);
  });
};

run().catch(error => {
  console.error(error);
  process.exit(1);
});
