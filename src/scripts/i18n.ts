type Lang = "en" | "zh";

const LANG_KEY = "site-lang";
const DEFAULT_LANG: Lang = "en";

const dictionary: Record<Lang, Record<string, string>> = {
  en: {
    "ui.skipToContent": "Skip to content",
    "nav.blog": "Blog",
    "nav.tags": "Tags",
    "nav.projects": "Projects",
    "nav.about": "About",
    "nav.archives": "Archives",
    "nav.search": "Search",
    "nav.openMenu": "Open Menu",
    "nav.closeMenu": "Close Menu",
    "nav.themeToggle": "Toggles light and dark",
    "footer.rights": "All rights reserved.",
    // Social labels
    "social.github": "GitHub",

    "home.heroTitle": "Essays, Projects, and Field Notes",
    "home.heroDesc": "A focused publishing space for long-form engineering writing, build logs, and curated project updates.",
    "home.social": "Social Links:",
    "home.featured": "Featured",
    "home.featuredDesc": "Read the launch post for this production setup.",
    "home.allArticles": "All Articles",
    "home.firstTimeGuide": "First-Time Guide",

    "blog.title": "Blog",
    "blog.desc": "Curated engineering notes, platform updates, and workflow writeups.",
    "blog.latest": "Latest Article",
    "blog.read": "Read article",

    "search.title": "Search",
    "search.desc": "Search posts by title, summary, and tags. Results are generated from the static build index.",
    "search.loading": "Loading search index...",
    "search.empty": "No results found. Try a broader term or a tag keyword.",
    "search.ready": "Search ready.",
    "search.unavailable": "Search index is unavailable in this environment. Run a production build to enable Pagefind.",

    "admin.loginTitle": "Admin Access",
    "admin.loginDesc": "Enter the owner access key to open the operations console.",
    "admin.accessKey": "Access key",
    "admin.openConsole": "Open Admin Console",
    "admin.consoleTitle": "Admin Operations Console",
    "admin.consoleDesc": "Owner-only controls for publish, rollback, pause, and workflow visibility.",
    "admin.latestWorkflow": "Latest Workflow",
    "admin.latestDeploy": "Latest Deploy",
    "admin.draftQueue": "Draft Queue",
    "admin.emergencyPause": "Emergency Pause",
    "admin.triggerPublish": "Trigger Publish",
    "admin.rollback": "Rollback",
    "admin.pause": "Pause",
    "admin.resume": "Resume",
    "admin.logout": "Logout",
    "admin.auditFeed": "Audit Feed",
    "admin.status.success": "success",
    "admin.status.running": "Running",
    "helloCompat.title": "Hello World",
    "helloCompat.intro": "Welcome to the production blog runtime. This route is statically rendered to keep Cloudflare Worker runtime stable while preserving the reading experience.",
    "helloCompat.contents": "Contents",
    "helloCompat.section.included": "What is included",
    "helloCompat.section.code": "Sample code",
    "helloCompat.section.next": "Next steps",
    "helloCompat.next": "Continue publishing posts from the authoring flow and validate smoke checks against the production domain after each deployment.",
    "helloCompat.related": "Related Posts",
    "helloCompat.related.premium": "Hello Premium World",
    "helloCompat.related.all": "View all blog posts",
    "helloCompat.comments": "Comments",
    "helloCompat.commentsFallback": "Comments are temporarily unavailable. Please check again later.",
    "newsletter.heading": "Newsletter",
    "newsletter.subtitle": "Get new posts and project notes in your inbox. No spam.",
    "newsletter.label": "Email address",
    "newsletter.placeholder": "you@example.com",
    "newsletter.submit": "Subscribe",
    "newsletter.submitting": "Subscribing...",
    "newsletter.error.invalidEmail": "Please enter a valid email address.",
    "newsletter.duplicate": "You are already subscribed. Thanks for staying with us.",
    "newsletter.success": "Subscribed successfully. Please check your inbox.",
    "newsletter.unavailable": "Subscription service is temporarily unavailable. Please retry shortly.",
    "newsletter.retry": "Unable to subscribe right now. Please retry.",
  },
  zh: {
    "ui.skipToContent": "跳到正文",
    "nav.blog": "博客",
    "nav.tags": "标签",
    "nav.projects": "项目",
    "nav.about": "关于",
    "nav.archives": "归档",
    "nav.search": "搜索",
    "nav.openMenu": "打开菜单",
    "nav.closeMenu": "关闭菜单",
    "nav.themeToggle": "切换明暗主题",
    "footer.rights": "保留所有权利。",
    // Social labels
    "social.github": "GitHub",

    "home.heroTitle": "文章、项目与实践笔记",
    "home.heroDesc": "一个专注于工程长文、构建记录与项目更新的发布空间。",
    "home.social": "社交链接：",
    "home.featured": "精选内容",
    "home.featuredDesc": "阅读这套生产博客的启动文章。",
    "home.allArticles": "查看全部文章",
    "home.firstTimeGuide": "新手上手指南",

    "blog.title": "博客",
    "blog.desc": "整理过的工程笔记、平台更新与工作流实践。",
    "blog.latest": "最新文章",
    "blog.read": "阅读全文",

    "search.title": "搜索",
    "search.desc": "按标题、摘要和标签搜索文章。结果来自构建时生成的静态索引。",
    "search.loading": "正在加载搜索索引...",
    "search.empty": "未找到结果。请尝试更宽泛的关键词或标签。",
    "search.ready": "搜索已就绪。",
    "search.unavailable": "当前环境不可用搜索索引。请运行生产构建以启用 Pagefind。",

    "admin.loginTitle": "管理入口",
    "admin.loginDesc": "输入站长访问密钥以进入运维控制台。",
    "admin.accessKey": "访问密钥",
    "admin.openConsole": "打开管理控制台",
    "admin.consoleTitle": "管理运维控制台",
    "admin.consoleDesc": "站长专用控制面板：发布、回滚、暂停和工作流可见性。",
    "admin.latestWorkflow": "最新工作流",
    "admin.latestDeploy": "最新部署",
    "admin.draftQueue": "草稿队列",
    "admin.emergencyPause": "紧急暂停",
    "admin.triggerPublish": "触发发布",
    "admin.rollback": "回滚",
    "admin.pause": "暂停",
    "admin.resume": "恢复",
    "admin.logout": "退出登录",
    "admin.auditFeed": "审计日志",
    "admin.status.success": "成功",
    "admin.status.running": "运行中",
    "helloCompat.title": "你好，世界",
    "helloCompat.intro": "欢迎来到生产博客运行时。本路由采用静态渲染，以保持 Cloudflare Worker 运行稳定并保留良好的阅读体验。",
    "helloCompat.contents": "目录",
    "helloCompat.section.included": "包含内容",
    "helloCompat.section.code": "示例代码",
    "helloCompat.section.next": "下一步",
    "helloCompat.next": "继续通过作者发布流程发布文章，并在每次部署后对生产域名执行烟雾检查。",
    "helloCompat.related": "相关文章",
    "helloCompat.related.premium": "高级版本示例",
    "helloCompat.related.all": "查看全部博客文章",
    "helloCompat.comments": "评论",
    "helloCompat.commentsFallback": "评论暂时不可用，请稍后重试。",
    // Newsletter translations
    "newsletter.heading": "通讯订阅",
    "newsletter.subtitle": "将新文章和项目笔记发送至您的邮箱。绝不垃圾邮件。",
    "newsletter.label": "邮箱地址",
    "newsletter.placeholder": "请输入邮箱地址",
    "newsletter.submit": "订阅",
    "newsletter.submitting": "正在订阅…",
    "newsletter.error.invalidEmail": "请输入有效的邮箱地址。",
    "newsletter.duplicate": "您已订阅。感谢关注。",
    "newsletter.success": "订阅成功。请检查您的邮箱。",
    "newsletter.unavailable": "订阅服务暂不可用，请稍后再试。",
    "newsletter.retry": "当前无法订阅，请重试。",
  },
};

const normalizeLang = (value: string | null | undefined): Lang => {
  if (!value) return DEFAULT_LANG;
  if (value.toLowerCase().startsWith("zh")) return "zh";
  return "en";
};

const getPreferredLang = (): Lang => {
  const url = new URL(window.location.href);
  const fromQuery = normalizeLang(url.searchParams.get("lang"));
  if (url.searchParams.has("lang")) {
    localStorage.setItem(LANG_KEY, fromQuery);
    return fromQuery;
  }
  return normalizeLang(localStorage.getItem(LANG_KEY));
};

const t = (lang: Lang, key: string): string => dictionary[lang][key] ?? dictionary.en[key] ?? key;

const applyTranslations = (lang: Lang): void => {
  document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";

  document.querySelectorAll<HTMLElement>("[data-i18n]").forEach(node => {
    const key = node.dataset.i18n;
    if (!key) return;
    node.textContent = t(lang, key);
  });

  document.querySelectorAll<HTMLElement>("[data-i18n-attr]").forEach(node => {
    const spec = node.dataset.i18nAttr;
    if (!spec) return;
    const entries = spec.split(",").map(part => part.trim()).filter(Boolean);
    for (const entry of entries) {
      const [attr, key] = entry.split(":").map(part => part.trim());
      if (!attr || !key) continue;
      node.setAttribute(attr, t(lang, key));
    }
  });

  document.querySelectorAll<HTMLButtonElement>("[data-lang-switch]").forEach(btn => {
    const target = normalizeLang(btn.dataset.langSwitch);
    btn.setAttribute("aria-pressed", target === lang ? "true" : "false");
  });
};

const setLang = (lang: Lang): void => {
  localStorage.setItem(LANG_KEY, lang);
  const url = new URL(window.location.href);
  url.searchParams.set("lang", lang);
  window.history.replaceState({}, "", url.toString());
  applyTranslations(lang);
};

const bindSwitcher = (): void => {
  document.querySelectorAll<HTMLButtonElement>("[data-lang-switch]").forEach(btn => {
    btn.addEventListener("click", () => {
      const target = normalizeLang(btn.dataset.langSwitch);
      setLang(target);
    });
  });
};

const initI18n = (): void => {
  const lang = getPreferredLang();
  applyTranslations(lang);
  bindSwitcher();
};

// Run when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initI18n);
} else {
  initI18n();
}

// Also run after Astro page transitions
document.addEventListener("astro:after-swap", initI18n);
