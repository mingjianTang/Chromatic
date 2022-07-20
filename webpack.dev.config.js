let webpack = require('webpack') 
let path = require('path') 
let { merge } = require('webpack-merge')     
let base = require('./webpack.base.config')
 
module.exports = merge(base, {
  mode: 'development',     // 定义环境变量
  devtool: 'cheap-module-eval-source-map',
  entry: [ path.resolve(__dirname, './src/main.js') ],
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'build.js'
  },
  devServer: {
    port: 8080,     //设置端口
    hot: true,     // 启用热更新
    open: true,    // 自动打开浏览器
    historyApiFallback: true,
    static: path.resolve(__dirname, './dist'),
    proxy: {
      '/api': {        //url中匹配到'/api', 就会把'/api'之前的东西全部替换成target
        target: 'http://demo.fantasysz.com:8888',      // 目标服务器host
        changeOrigin: true,   //  表示要改变原始host
        secure: false,   // 默认请求的服务是https的, 并且证书是未认证的，所以需要关闭安全检测。
        clentLogLevel: 'none',  //当使用内联模式(inline mode)时，会在开发工具(DevTools)的控制台(console)显示消息，例如：在重新加载之前，在一个错误之前，或者 模块热替换(Hot Module Replacement) 启用时。默认值是 info。
        pathRewrite: {
          '^/api': ''   // 重写请求，源访问地址中包含'/api'的将会替换为空
        }
      }
    }
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),   //热更新插件
    new webpack.NamedChunksPlugin()    // 使用此插件热更新时控制台会显示模块的相对路径
  ]
})
