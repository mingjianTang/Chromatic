import { createLocalVue } from '@vue/test-utils';
// require('jsdom-global')();
import ElementUI from 'element-ui';

const localVue = createLocalVue()
localVue.config.productionTip = false;

// 使用elementUi组件
localVue.use(ElementUI)
// npm run unit 时要下面引入样式那句注释掉-不知为什么导入会报错。可能因为测试时，不需要css样式
// import 'element-ui/lib/theme-chalk/index.css';

// 注册全局组件
// import localModules from '@/modules'
// Object.keys(localModules).map(key => {
//   localVue.component(key, localModules[key])
// });
