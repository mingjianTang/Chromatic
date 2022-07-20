let path = require('path')
let { VueLoaderPlugin } = require('vue-loader')     //vue-loader  15.x版本以后需要引入
let HtmlWebpackPlugin = require('html-webpack-plugin')    //自动生成html
let CopyWebpackPlugin = require('copy-webpack-plugin')
let { CleanWebpackPlugin } = require('clean-webpack-plugin')  //打包前清除dist
let webpack = require('webpack')
 
module.exports = {
  stats: {     // 本地起服务或者打包时候，清除过多的日志信息，精简控制台信息。
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false
  },
  module: {   //转换规则
    rules: [
      {
        test: /\.vue$/,
        exclude: /node_modules/,
        use: ['vue-loader']
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.(css|scss|sass)$/,   
        use: [
          'vue-style-loader',
          'css-loader',
          'postcss-loader'
        ]
      },
      {
        test: /\.(png|jpe?g|svg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 5 * 1024,   // 不设置这个的话，打包后的图片默认是超过8k时，会以base64编码
              name: '[name].[hash:8].[ext]'
            }
          }
        ]
      },
      {
        test:/\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'fonts/[name].[hash:8].[ext]'
            }
          }
        ]
      },
    ]
  },
  resolve: {
    extensions: ['.vue', '.js', '.scss',  '.json'],// 能够使用户在引入模块时不带扩展名字, 自动解析
    alias: {    //别名，方便快速查找模块
      '@': path.resolve(__dirname, './src')
    }
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, './index.html'),
      title: 'EasysSearch',
      hash: true,
      minify: {
        removeAttributeQuotes: true,    //删除属性的引号
        collapseWhitespace: true    //删除空白符与折叠行
      }
    }),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin([
      { from: path.resolve(__dirname, "./src/assets"), to: path.resolve(__dirname, "./dist/assets") }
    ]),
    new webpack.ProgressPlugin()      //显示打包进度的插件
  ]
}
