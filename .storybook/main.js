const path = require('path');

module.exports = {
  "stories": [
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    '@storybook/addon-a11y'
  ],
  "framework": "@storybook/vue",
  webpackFinal: async (config, { configType: env }) => {
    // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
    // You can change the configuration based on that.
    // 'PRODUCTION' is used when building the static version of storybook.

    // Use Sass loader for vuetify components
    // config.module.rules.push({
    //   test: /\.s(a|c)ss$/,
    //   use: ['style-loader', 'css-loader', 'sass-loader'],
    //   include: [
    //     path.resolve(__dirname, '../assets/styles/storybook.scss')
    //   ]
    // });
    config.module.rules.push({
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '../src'),
          'vue': "vue/dist/vue.esm.js"
        },
      }
    });

    return config;
  }
}