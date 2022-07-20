# easy-search-npm

1. **项目运行**

   * `npm install`  ,安装依赖

   * `npm run build` ,运行项目，具体命令参考package.json中scripts内容

   * `npm run dev` ,开发

2. **项目技术背景**

   基于 **vue2.5.11、vue-cli**技术

   代码线上路径：https://www.npmjs.com/package/easy-search-npm/v/1.0.1

3. **安装**

    * 安装方法1：
        npm install自动安装，在 package.json 中配置

        "dependencies": {
            "easy-search-npm": "^1.1.1"
        }

    * 安装方法2：
    
        npm手动安装
        npm i easy-search-npm@1.1.1

4. **快速使用**

    * dom

        <easy-search :easy-option="searchOption" @easyChange="searchChange" />

    * 注入

        import Vue from 'vue';

        import easySearch from 'easy-search-npm';

        Vue.use(easySearch);

    * 参数-示例

        searchOption: {
            name: {
                name: '姓名', valueType: 2, isMoreTime: false,isCalcSign:true
            },
            email: {
                name: '邮箱', valueType: 2, isMoreTime: false
            },
            status: {
                name: '状态', valueType: 1, isMoreTime: false,isMutil: true,
                dropItem: [{ name: 'Inviting', val: 'Inviting' }, { name: 'Normal', val: 'Normal' }]
            }
        }

    * 回调方法

        methods: {
            searchChange(params) {
                XXX
            }
        }
   