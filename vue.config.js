const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

const name = '金花收银系统' // page title

const port = 3000

module.exports = {
  publicPath: '/GFAdmin_cashier/',
  outputDir: 'GFAdmin_cashier',
  assetsDir: 'static',
  lintOnSave: 'default',
  pluginOptions: {
    electronBuilder: {
      externals: ['serialport'],
      nodeModulesPath: ['./node_modules', '../../node_modules'],
      builderOptions: {
        win: {
          icon: './public/icon256.ico'
          // target: [
          //     {
          //         target: "nsis",//利用nsis制作安装程序
          //         arch: [
          //             "x64" // 64位
          //         ]
          //     }
          // ]
        },
        productName: name
      }
    }
  },
  productionSourceMap: false,
  devServer: {
    port,
    open: false,
    overlay: {
      warnings: true,
      errors: true
    },
    proxy: {
      '/cash': {
        target: `http://192.168.0.105:14010`,
        // target: `http://47.99.116.133:14010`,
        secure: false,
        changeOrigin: true
      },
      '/pay': {
        // target: `http://192.168.0.135:14390`,
        target: `http://192.168.0.105:14390`,
        secure: false,
        changeOrigin: true
      }
    }
  },
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import "@styles/index.scss";`
      }
    }
  },
  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    name,
    resolve: {
      alias: {
        '@': resolve('src'),
        '@components': resolve('src/components'),
        '@styles': resolve('src/styles'),
        '@utils': resolve('src/utils'),
        '@views': resolve('src/views')
      }
    }
  },
  chainWebpack(config) {
    config.plugins.delete('preload')
    config.plugins.delete('prefetch')

    // set svg-sprite-loader
    config.module.rule('svg').exclude.add(resolve('src/icons')).end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    // set preserveWhitespace
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap((options) => {
        options.compilerOptions.preserveWhitespace = true
        return options
      })
      .end()

    config
      // https://webpack.js.org/configuration/devtool/#development
      .when(process.env.NODE_ENV === 'development', (config) => config.devtool('cheap-source-map'))

    config.when(process.env.NODE_ENV !== 'development', (config) => {
      config
        .plugin('ScriptExtHtmlWebpackPlugin')
        .after('html')
        .use('script-ext-html-webpack-plugin', [
          {
            // `runtime` must same as runtimeChunk name. default is `runtime`
            inline: /runtime\..*\.js$/
          }
        ])
        .end()
      config.optimization.splitChunks({
        chunks: 'all',
        cacheGroups: {
          libs: {
            name: 'chunk-libs',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: 'initial' // only package third parties that are initially dependent
          },
          elementUI: {
            name: 'chunk-elementUI', // split elementUI into a single package
            priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
            test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
          },
          commons: {
            name: 'chunk-commons',
            test: resolve('src/components'), // can customize your rules
            minChunks: 3, //  minimum common number
            priority: 5,
            reuseExistingChunk: true
          }
        }
      })
      config.optimization.runtimeChunk('single')
    })
  }
}
