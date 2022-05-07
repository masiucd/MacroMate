module.exports = {
  stories: ["../stories/**/*.stories.@(ts|tsx|js|jsx|mdx)"],
  features: {
    previewCsfV3: true,
    interactionsDebugger: true,
  },
  addons: [
    {
      name: "@storybook/addon-docs",
      options: {configureJSX: true},
    },
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  // https://storybook.js.org/docs/react/configure/typescript#mainjs-configuration
  typescript: {
    check: true, // type-check stories during Storybook build
  },
}
