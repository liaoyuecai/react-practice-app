'use strict';

const autoprefixer = require('autoprefixer'); // 为浏览器加前缀,满足浏览器的兼容
const path = require('path'); // 提供了一些工具函数，用于处理文件与目录的路径
const webpack = require('webpack');
// 自动生成一个 html 文件，并且引用相关的 assets 文件(如 css, js)
const HtmlWebpackPlugin = require('html-webpack-plugin');
// 强制所有必需的模块的整个路径与磁盘上实际路径的精确情况相匹配
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin');
const eslintFormatter = require('react-dev-utils/eslintFormatter'); // eslint代码检查
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
const getClientEnvironment = require('./env');
const paths = require('./paths');

// Webpack使用“公共路径”来确定应用程序的位置。在开发中，我们总是从根源上服务。这使得配置更加容易。
const publicPath = '/';
// “publicUrl”就像“公共路径”一样，但我们会将它提供给我们的应用
// 作为“索引”中的%公url%。html”和“process.env。在JavaScript PUBLIC_URL”。
// 省略后面的斜杠作为%publicpath%/xyz看起来比%publicpath%xyz更好。
const publicUrl = '';
// 将环境变量注入到我们的应用程序中
const env = getClientEnvironment(publicUrl);
// 这是开发配置。
// 它专注于开发者体验和快速重建。
// 生产配置不同，并且存在于一个单独的文件中。
module.exports = {

  // 如果您希望看到DevTools中已编译的输出，您可能想要“eval”。
  // 在https://github.com/facebookincubator/create-react-app/issues/343看到的讨论
  // 选择一个开发工具进行调试
  devtool: 'cheap-module-source-map',
  // 这些是我们应用程序的“入口点”。
  // 这意味着它们将是JS捆绑包中包含的“根”导入。
  // 前两个入口点为JS提供“hot”CSS和自动刷新。
  entry: [
    // 默认情况下，我们会发送一些poly填充物:
    require.resolve('./polyfills'),
    // 包含一个用于WebpackDevServer的替代客户端。客户的工作是
    // 通过一个套接字连接到WebpackDevServer，并得到关于更改的通知。
    // 当你保存一个文件时，客户端要么应用热点更新（以防万一
    // CSS更改），或刷新页面（以防JS更改）。当你
    // 造成一个语法错误，这个客户端将显示一个语法错误叠加。
    // 注意：我们使用的是定制的，而不是默认的WebpackDevServer客户端。
    // 为用户提供更好的体验。你可以换
    // 如果你喜欢股票客户端，下面的这两行代码如下：
    // require.resolve(webpack-dev-server /客户端)+”? / ',
    // require.resolve(“webpack /热/ dev-server”),
    require.resolve('react-dev-utils/webpackHotDevClient'),
    // 最后，这是应用程序的代码:
    paths.appIndexJs,
    // 我们将应用程序代码保存在最后，以便在运行时出现错误时
    // 初始化，它不会破坏WebpackDevServer客户端，
    // 改变JS代码仍然会触发刷新。
  ],
  output: {
    // 在输出中添加/* filename */注释到生成的require（）
    pathinfo: true,
    // 这不会产生一个真正的文件。它只是虚拟路径
    // 在开发中由WebpackDevServer服务。这是JS包
    // 包含所有入口点和Webpack运行时的代码。
    filename: 'static/js/bundle.js',
    // 如果你使用代码分割，也会有额外的JS块文件.
    chunkFilename: 'static/js/[name].chunk.js',
    // 这是应用程序的URL。我们在开发中使用“/”
    publicPath: publicPath,
    // Point sourcemap entries to original disk location (format as URL on Windows)
    // 点sourcemap条目到原始磁盘位置（在Windows上的URL格式）
    devtoolModuleFilenameTemplate: info =>
      path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
  },
  // 设置模块如何被解析
  resolve: {
    // 这允许你为Webpack寻找模块的地方设置一个后备。
    // 我们把这些路径放在第二位，因为我们想让“节点模块”获得“胜利”
    // 如果有冲突的话。这与节点解析机制相匹配。
    // https://github.com/facebookincubator/create-react-app/issues/253
    modules: ['node_modules', paths.appNodeModules].concat(
      // 它肯定会存在，因为我们在'env'js中调整了它
      process.env.NODE_PATH.split(path.delimiter).filter(Boolean)
    ),
    // 这些是节点生态系统支持的合理默认值。
    // 我们还将JSX作为一个通用组件文件名扩展来支持
    // 一些工具，尽管我们不推荐使用它，但请注意：
    // https://github.com/facebookincubator/create-react-app/issues/290
    // 'web'扩展前缀已经添加，以获得更好的支持。
    // 用于响应本地Web。
    extensions: ['.web.js', '.mjs', '.js', '.json', '.web.jsx', '.jsx'],
    alias: {
      // 支持React Native Web
      // https://www.smashingmagazine.com/2016/08/a-glimpse-into-the-future-with-react-native-for-web/
      'react-native': 'react-native-web',
    },
    plugins: [
      // 防止用户从src/（或nodemodules/）外部导入文件。
      // 这常常会导致混淆，因为我们只处理src/巴别塔中的文件。
      // 为了解决这个问题，我们阻止您从src/中导入文件，如果您愿意，
      // 请将这些文件链接到你的节点模块/并让模块解析生效。
      // 确保你的源文件被编译，因为它们不会以任何方式被处理。
      new ModuleScopePlugin(paths.appSrc, [paths.appPackageJson]),
    ],
  },
  module: {
    strictExportPresence: true,
    rules: [
      // TODO:禁用要求。确保它不是标准的语言特性。
      // 我们正在等待https://github.com/facebookincubator/create-react-app/issues/2176。
      // { parser: { requireEnsure: false } },

      // 首先，运行连接器。
      // 在babel处理JS之前做这个很重要。
      {
        test: /\.(js|jsx|mjs)$/,
        enforce: 'pre',
        use: [
          {
            options: {
              formatter: eslintFormatter,
              eslintPath: require.resolve('eslint'),
              
            },
            loader: require.resolve('eslint-loader'),
          },
        ],
        include: paths.appSrc,
      },
      {
        // “oneOf”将遍历所有的加载器，直到一个
        // 匹配的要求。当没有加载器匹配时，它就会掉下来
        // 回到加载器列表末尾的“file”loader。
        oneOf: [
          // “url”加载器的工作方式类似于“file”加载器，只不过它嵌入了资产
          // 小于指定的字节数作为数据url以避免请求。
          // 缺失的“测试”相当于一场比赛。
          {
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
            loader: require.resolve('url-loader'),
            options: {
              limit: 10000,
              name: 'static/media/[name].[hash:8].[ext]',
            },
          },
          // 处理 JS with Babel.
          {
            test: /\.(js|jsx|mjs)$/,
            include: paths.appSrc,
            loader: require.resolve('babel-loader'),
            options: {

              // 这是webpack（不是babel本身）的“babel-loader”的一个特性。
              // 它支持在./node_modules/.cache/babel-loader/
              // 目录以更快的重新构建。
              cacheDirectory: true,
            },
          },

          // “postcss”加载器将自动修复程序应用到我们的CSS中。
          // “CSS”装入器在CSS中解析路径，并将资产作为附件添加。
          // “style”加载器将CSS转换为JS模块，注入了标签。
          // 在生产中，我们使用一个插件将CSS提取到一个文件中，但是
          // 在开发“style”加载器中，可以对CSS进行热编辑。
          {
            test: /\.(css||less)$/,
            use: [
              require.resolve('style-loader'),
              {
                loader: require.resolve('css-loader'),
                options: {
                  importLoaders: 1,
                },
              },
              {
                loader: require.resolve('postcss-loader'),
                options: {
                  // 需要外部CSS导入工作
                  // https://github.com/facebookincubator/create-react-app/issues/2677
                  ident: 'postcss',
                  plugins: () => [
                    require('postcss-flexbugs-fixes'),
                    autoprefixer({
                      browsers: [
                        '>1%',
                        'last 4 versions',
                        'Firefox ESR',
                        'not ie < 9', // React doesn't support IE8 anyway
                      ],
                      flexbox: 'no-2009',
                    }),
                  ],
                },
              },
              {
                loader: require.resolve('less-loader')
              }
            ],
          },

          // “file”loader确保这些资产由WebpackDevServer服务。
          // 当你导入一个资产时，你会得到它的（虚拟）文件名。
          // 在生产过程中，他们会被复制到“构建”文件夹中。
          // 这个装入器不使用“测试”，因此它将捕获所有模块
          // 那是从其他的装载机中掉下来的。
          {

            // 排除js文件以保持“css”加载器在注入时工作
            // 它的运行时，否则将通过“file”加载器进行处理。
            // 也排除了'html'和'json'扩展，这样它们就可以被处理了
            // 通过webpack内部加载器。
            exclude: [/\.(js|jsx|mjs)$/, /\.html$/, /\.json$/, /\.(css||less)$/],
            loader: require.resolve('file-loader'),
            options: {
              name: 'static/media/[name].[hash:8].[ext]',
            },
          },
        ],
      },
      // ** STOP ** Are you adding a new loader?
      // Make sure to add the new loader(s) before the "file" loader.
    ],
  },
  plugins: [
    // 在index.html中提供一些环境变量。
    // 公共URL可以作为%publicurl%在索引中使用。html,例如:
    // 。。。。/我/你的/我/你/我/你/我……
    // 在开发中，这将是一个空字符串。
    new InterpolateHtmlPlugin(env.raw),
    // 生成一个索引。注入的“html”文件。
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.appHtml,
    }),
    // Add module names to factory functions so they appear in browser profiler.
    // 将模块名称添加到工厂函数中，以便它们出现在浏览器剖析器中。
    new webpack.NamedModulesPlugin(),
    // 为JS代码提供一些环境变量，例如：
    // 如果(process.env。nodeenv=='development'){...}见“./env.js”。
    new webpack.DefinePlugin(env.stringified),
    // 这是发布热更新的必要条件（目前仅CSS）:
    new webpack.HotModuleReplacementPlugin(),
    // 观察者如果你在一条路径上键入了错误的框，就不能正常工作了
    // 一个插件，当你试图这样做时，打印错误。
    // 参见https://github.com/facebookincubator/create-react-app/issues/240
    new CaseSensitivePathsPlugin(),
    // 如果你需要一个丢失的模块，然后“npm安装”它，你仍然有
    // 重新启动Webpack的开发服务器以发现它。这个插件
    // 使发现自动生效，这样你就不用重新启动了。
    // 参见https://github.com/facebookincubator/create-react-app/issues/186
    new WatchMissingNodeModulesPlugin(paths.appNodeModules),
    // Moment.js是一个非常流行的库，它可以打包大型的地区文件
    // 在默认情况下是由于Webpack如何解释它的代码。这是一个实用的
    // 解决方案要求用户选择导入特定的地区。
    // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
    // 如果你不使用moment.js，你可以删除它。
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
  ],
  // 有些库导入节点模块，但在浏览器中不使用它们。
  // 告诉Webpack为它们提供空mock，这样导入它们就可以工作了。
  node: {
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty',
  },
  // 在开发过程中关闭性能提示，因为我们不做任何事情。
  // 分裂或缩小以速度的利益。这些警告成为
  // 麻烦。
  performance: {
    hints: false,
  },
};
