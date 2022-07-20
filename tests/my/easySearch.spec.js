import { shallowMount } from '@vue/test-utils';
import EasySearch from '@/lib/search.vue';
import Vue from 'vue';

// const localVue = createLocalVue();

const searchChange = (params) => {
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
  return paramsUrl
}

describe('EasySearch.vue', () => {
  let wrapper
  const props = {
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
    }
  }
  // 每个it开始之前执行
  beforeEach(() => {
    wrapper = shallowMount(EasySearch, { propsData: props })
  })
  // 每个it结束时执行
  afterEach(() => {
    wrapper.destroy()
  })

  // 测试内容：props
  // 自定义props传递给组件，判断组件有获取到props
  it('props test', () => {
    expect(wrapper.props().easyOption.email.name).toBe('邮箱')
  });

  // 测试内容：filter-dropdown-item
  // 组件获取到的下拉选项是否渲染正常
  it('filter-dropdown-item rendered correctly', () => {
    const items = wrapper.findAll('#filterFirstMenu .filter-dropdown-item button span')
    const names = []
    Object.keys(props.easyOption).forEach((key) => {
      names.push(props.easyOption[key].name)
    })
    const name = items.at(1).text();
    expect(names.includes(name)).toBe(true)
  })

  // 测试内容：searchDataFn方法
  // 选择好搜索条件后，测试返回的数据是不是我们想要的
  it('searchDataFn enter test', () => {
    const filteredObj = [{
      calcSign: "=",
      calcType: "",
      isCalcSign: true,
      name: "姓名",
      oKey: "name",
      value: {
        name: "娜娜",
        val: "娜娜"
      },
      valueType: 2
    },{
      calcSign: "=",
      calcType: "",
      isCalcSign: undefined,
      name: "邮箱",
      oKey: "email",
      value: {
        name: "123456@qq.com",
        val: "123456@qq.com"
      },
      valueType: 2
    },{
      isCalcSign: undefined,
      name: "状态",
      oKey: "status",
      value: {
        name: "Inviting,Normal",
        val: "Inviting,Normal"
      },
      valueType: 1
    }]

    wrapper.vm.filteredObj = filteredObj;
    wrapper.vm.visiable = {
      keypressWitch: -2,
      secondKeypressWitch: -1,
      filterInputValue: ''
    }
    const paramsObj = wrapper.vm.searchDataFn()
    // console.log(paramsObj);
    const paramsUrl = searchChange(paramsObj)
    // console.log(paramsUrl);
    expect(paramsUrl).toBe('nameContains=娜娜&emailContains=123456@qq.com&statusIn=Inviting,Normal')

  })

  // 测试内容：选择{ 姓名: 李华, 邮箱: 123456@qq.com, 状态: Inviting,Normal }，执行搜索，返回的数据是否与预期一致，再修改邮箱，删除状态选项，执行搜索，返回的数据是否与预期一致
  // 一：1、点击搜索框 2、选择姓名 3、选择= 4、输入搜索内容 5、失焦 6、执行搜索
  // 二：1、点击搜索框 2、选择邮箱 3、输入搜索内容 4、失焦 5、执行搜索
  // 三：1、点击搜索框 2、选择状态 3、选择Normal 4、再选择Inviting 5、失焦 6、执行搜索
  // 四：1、点击邮箱 2、修改输入框的邮箱 3、删除状态 4、失焦 5、执行搜索
  it('multiple select', async () => {
    const filteredinputEle = wrapper.vm.$el.querySelector('#filteredToggle')
    let nameItemsEle = wrapper.vm.$el.querySelectorAll('#filterFirstMenu .filter-dropdown-item button')

    filteredinputEle.click()
    nameItemsEle[1].click()
    await Vue.nextTick()

    let signItemsEle = wrapper.vm.$el.querySelectorAll('#filtered-scroll-width .filter-dropdown li')
    signItemsEle[0].click()
    await Vue.nextTick()

    wrapper.vm.visiable.filterInputValue = '李华'
    wrapper.vm.contentClick()
    let paramsObj = wrapper.vm.searchDataFn()
    let paramsUrl = searchChange(paramsObj)
    console.log(paramsUrl);
    expect(paramsUrl).toBe('nameContains=李华')

    filteredinputEle.click()
    // 因为姓名已经选过了，重新获取下拉列表，下拉列表中邮箱的索引变为1
    nameItemsEle = wrapper.vm.$el.querySelectorAll('#filterFirstMenu .filter-dropdown-item button')
    nameItemsEle[1].click()
    await Vue.nextTick()
    wrapper.vm.visiable.filterInputValue = '123456@qq.com'
    wrapper.vm.contentClick()
    paramsObj = wrapper.vm.searchDataFn()
    paramsUrl = searchChange(paramsObj)
    console.log(paramsUrl);
    expect(paramsUrl).toBe('nameContains=李华&emailContains=123456@qq.com')

    filteredinputEle.click()
    // 因为邮箱、姓名已经选过了，重新获取下拉列表，下拉列表中状态的索引变为1
    nameItemsEle = wrapper.vm.$el.querySelectorAll('#filterFirstMenu .filter-dropdown-item button')
    nameItemsEle[1].click()
    await Vue.nextTick()

    let statusItemsEle = wrapper.vm.$el.querySelectorAll('#filterSecondMenu .filter-dropdown-item button')
    statusItemsEle[1].click()
    await Vue.nextTick()
    statusItemsEle[0].click()
    wrapper.vm.contentClick()
    paramsObj = wrapper.vm.searchDataFn()
    paramsUrl = searchChange(paramsObj)
    console.log(paramsUrl);
    expect(paramsUrl).toBe('nameContains=李华&emailContains=123456@qq.com&statusIn=Inviting,Normal')

    let valueItemsEle = wrapper.vm.$el.querySelectorAll('#filtered-scroll-width .filtered-search-token')
    let emailValueEle = valueItemsEle[1].querySelector('.value-container')
    emailValueEle.click()
    wrapper.vm.visiable.filterInputValue = '9527@qq.com'
    wrapper.vm.contentClick()
    paramsObj = wrapper.vm.searchDataFn()
    paramsUrl = searchChange(paramsObj)
    console.log(paramsUrl);
    expect(paramsUrl).toBe('nameContains=李华&emailContains=9527@qq.com&statusIn=Inviting,Normal')

    wrapper.vm.searchDataFn({keyCode: 8})
    paramsObj = wrapper.vm.searchDataFn()
    paramsUrl = searchChange(paramsObj)
    console.log(paramsUrl);
    expect(paramsUrl).toBe('nameContains=李华&emailContains=9527@qq.com')
    
  })

});
