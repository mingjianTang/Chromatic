let { merge } = require('webpack-merge')
let base = require('./webpack.base.config')
let path = require('path')
let UglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin')
let OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
 
module.exports = merge(base, {
  mode: 'production',
  devtool: 'cheap-module-source-map',
  entry: './src/lib/index.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/dist/',
    filename: 'easySearch.js',
    library: 'easySearch', // library指定的就是你使用require时的模块名，这里便是require("easySearch")
    libraryTarget: 'umd', //libraryTarget会生成不同umd的代码,可以只是commonjs标准的，也可以是指amd标准的，也可以只是通过script标签引入的。
    umdNamedDefine: true // 会对 UMD 的构建过程中的 AMD 模块进行命名。否则就使用匿名的 define。
  },
  optimization: {
    minimizer: [
      new UglifyjsWebpackPlugin({   // 生产环境压缩JS
        cache: true,    //是否否启用缓存
        parallel: true,   //多通道并行处理
        sourceMap: false, //生产环境关闭源码映射
        uglifyOptions: {
          warnings: false,    //清除警告
          compress:{
            drop_debugger: true,	// 清除degugger
            drop_console: true   //清除所有的console信息
          }
        }
      }),
      new OptimizeCssAssetsPlugin()   // 生产环境压缩css
    ],
    // 作为一个单独的js插件引入，就不需要splitChunks，只需要打包为一个js文件
    // splitChunks: {   //用于拆分代码，找到 chunk 中共同依赖的模块进行“提取”和“分离”到单独的文件中，减少打包后体积，可以避免内存溢出的问题。
    //   chunks: 'all'
    // }
  },
  performance: {                       //  webpack 的性能提示
    hints: 'warning',                 // 显示警告信息
    maxEntrypointSize: 5 * 1024 * 1024,    // 设置入口文件的最大体积为5M  （以字节为单位）
    maxAssetSize: 20* 1024 * 1024,        // 设置输出文件的最大体积为20M  （以字节为单位）
    assetFilter (assetFilename) {        // 提供资源文件名的断言函数
      return assetFilename.endsWith('.js') || assetFilename.endsWith('.css')
    }
  }
})
