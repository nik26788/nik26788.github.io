// import { defineConfig } from "vitepress";
import { withMermaid } from "vitepress-plugin-mermaid";

// https://vitepress.dev/reference/site-config
export default withMermaid({
  title: "全栈开发之路",
  // description: "...正在开发中",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "Front-End", link: "/frontend/browser-cache" },
      { text: "English", link: "/english/sujie-spoken-900" },
    ],

    sidebar: [
      {
        text: "Front-End",
        items: [
          { text: "浏览器缓存机制", link: "/frontend/browser-cache" },
          {
            text: "从0到1搭建一个vue3前端项目",
            link: "/frontend/create-vue3-project-0-to-1",
          },
        ],
      },
      {
        text: "English",
        items: [{ text: "苏姐英语900句", link: "/english/sujie-spoken-900" }],
      },
      {
        text: "Examples",
        items: [
          { text: "Markdown Examples", link: "/markdown-examples" },
          { text: "Runtime API Examples", link: "/api-examples" },
          { text: "Markdown Icons", link: "/markdown-icons" },
        ],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/vuejs/vitepress" },
    ],
  },
});
