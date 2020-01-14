const path = require('path')

function resolve (dir) {
  return path.join(__dirname, dir)
}

const name = '浪潮易云' // page title
module.exports = {
  // 选项...
  publicPath: '',
  outputDir: '../../public',
  assetsDir: 'login_static',
  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    name: name,
    resolve: {
      alias: {
        '@': resolve('src')
      }
    }
  }
}
