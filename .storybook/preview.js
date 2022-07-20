// import Vue from 'vue';
// import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';
// import '../assets/styles/storybook.scss';

// Vue.use(ElementUI);
import Vue from 'vue'
import VueI18n from 'vue-i18n';
Vue.use(VueI18n);

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  // 全局a11y配置
  // a11y: {
  //   // Optional selector to inspect
  //   element: '#root',
  //   config: {
  //     rules: [
  //       {
  //         // The autocomplete rule will not run based on the CSS selector provided
  //         id: 'autocomplete-valid',
  //         selector: '*:not([autocomplete="nope"])',
  //       },
  //       {
  //         // Setting the enabled option to false will disable checks for this particular rule on all stories.
  //         id: 'image-alt',
  //         enabled: false,
  //       },
  //     ],
  //   },
  //   // Axe's options parameter
  //   options: {},
  //   // Optional flag to prevent the automatic check
  //   manual: true,
  // }
}