'use strict';

// process: node的一个全局变量
// process.env: 返回一个包含用户环境信息的对象

const fs = require('fs');
const path = require('path');
const paths = require('./paths');

// 确保包括paths.js 之后env.js将会读取.env变量。
// 删除缓存区模块./paths
delete require.cache[require.resolve('./paths')];

// 环境变量, 默认是development
const NODE_ENV = process.env.NODE_ENV;
if (!NODE_ENV) {
  throw new Error(
    'The NODE_ENV environment variable is required but was not specified.'
  );
}

// https://github.com/bkeepers/dotenv#what-other-env-files-can-i-use
var dotenvFiles = [
  `${paths.dotenv}.${NODE_ENV}.local`,
  `${paths.dotenv}.${NODE_ENV}`,
  // 不包括 `.env.local` for `test` 环境
  // 因为通常情况下，你期望测试产生相同的结果
  // results for everyone
  NODE_ENV !== 'test' && `${paths.dotenv}.local`,
  paths.dotenv,
].filter(Boolean);

// 加载环境变量.env*文件。抑制警告使用沉默
// 如果这个文件丢失了。dotenv永远不会修改任何环境变量
// 已经设置好了。变量展开在.env文件中。
// https://github.com/motdotla/dotenv
// https://github.com/motdotla/dotenv-expand
dotenvFiles.forEach(dotenvFile => {
  if (fs.existsSync(dotenvFile)) {
    require('dotenv-expand')(
      require('dotenv').config({
        path: dotenvFile,
      })
    );
  }
});

// 我们支持根据“NODE_PATH”解析模块。
// 这让你可以在大型的monorepos中使用绝对路径：
// https://github.com/facebookincubator/create-react-app/issues/253。
// 它与节点本身的“节点路径”类似：
// https://nodejs.org/api/modules.html modules_loading_from_the_global_folders
// 注意，与Node不同的是，只有来自“nodepath”的相对路径被授予。
// 否则，我们将冒导入节点的风险。js核心模块进入应用程序而不是Webpack shims。
// https://github.com/facebookincubator/create-react-app/issues/1023#issuecomment-265344421
// 我们还会解决这些问题以确保使用它们的所有工具都能持续工作
const appDirectory = fs.realpathSync(process.cwd());
process.env.NODE_PATH = (process.env.NODE_PATH || '')
  .split(path.delimiter)
  .filter(folder => folder && !path.isAbsolute(folder))
  .map(folder => path.resolve(appDirectory, folder))
  .join(path.delimiter);

// 抓取NODE_ENV and REACT_APP_*应用环境变量，并让它们做好准备
// 通过在Webpack配置中通过DefinePlugin注入应用程序。
const REACT_APP = /^REACT_APP_/i;

function getClientEnvironment(publicUrl) {
  const raw = Object.keys(process.env)
    .filter(key => REACT_APP.test(key))
    .reduce(
      (env, key) => {
        env[key] = process.env[key];
        return env;
      },
      {
        // 用于确定我们是否在生产模式下运行。
        // 最重要的是，它会把反应转换成正确的模式。
        NODE_ENV: process.env.NODE_ENV || 'development',
        // 有助于解决“public”静态资源的正确路径
        // For example, <img src={process.env.PUBLIC_URL + '/img/logo.png'} />.
        // 这只能用作逃生舱口. 你通常会将
        // 将这些图像放入“src”中，并在代码中“import”它们以获得它们的路径。
        PUBLIC_URL: publicUrl,
      }
    );
  // 把所有的值都化好这样我们就可以输入Webpack定义插件
  const stringified = {
    'process.env': Object.keys(raw).reduce((env, key) => {
      env[key] = JSON.stringify(raw[key]);
      return env;
    }, {}),
  };

  return { raw, stringified };
}

module.exports = getClientEnvironment;
