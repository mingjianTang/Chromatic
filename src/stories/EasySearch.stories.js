import EasySearch from '@/lib/search.vue';

// More on default export: https://storybook.js.org/docs/vue/writing-stories/introduction#default-export
export default {
  title: 'MyComponents/EasySearch',
  component: EasySearch,
  // More on argTypes: https://storybook.js.org/docs/vue/api/argtypes
  argTypes: {
    
  }
};

// More on component templates: https://storybook.js.org/docs/vue/writing-stories/introduction#using-args
const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { EasySearch },
  template: '<easy-search @easyChange="searchChange" v-bind="$props" />',
});

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/vue/writing-stories/args
Primary.args = {
  easyOption: {
    name: {
      name: '姓名', valueType: 2, isMoreTime: false, isCalcSign: true
    },
    email: {
      name: '邮箱', valueType: 2, isMoreTime: false
    },
    status: {
      name: '状态', valueType: 1, isMoreTime: false, isMutil: true,
      dropItem: [{ name: 'Inviting', val: 'Inviting' }, { name: 'Normal', val: 'Normal' }]
    }
  },
  searchChange(params) {
    console.log(params);
    var paramsUrl = ''
    for (var key in params) {
        var type = params[key].type ? params[key].type : '';
        var val = params[key].val;
        if ((key == 'name' || key == 'email') && type == '') {
            paramsUrl += key + 'Contains' + '=' + val + '&';
        } else if (key == 'status' && type == '') {
            paramsUrl += key + 'In' + '=' + val + '&';
        } else {
            paramsUrl += key + type + '=' + val + '&';
        }
    }
    paramsUrl = paramsUrl.substring(0, paramsUrl.length - 1);
    console.log(paramsUrl);
  }
};
