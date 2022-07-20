<template>
  <div id="app">
    <img src="@/assets/logo.png">
    <easy-search :easy-option="searchOption" @easyChange="searchChange"></easy-search>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      searchOption: {
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
    }
  },
  methods:{
    searchChange (params) {
            const initParam = {
                Skip: 0,
                Take: 10,
                orderByDesc: 'createdOn',
                LoginAfterStatus: 'AcceptChats',
            };
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
            initParam.url = paramsUrl;

            // const searchParams = Object.keys(params).length !== 0 ? params : {};
            // this.initParam = Object.assign(initParam, searchParams);
            // this.getList(this.initParam);
            console.log(initParam)
        },
  }
}
</script>

<style lang="css">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
