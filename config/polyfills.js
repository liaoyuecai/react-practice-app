'use strict';

if (typeof Promise === 'undefined') {
  // Rejection tracking prevents a common issue where React gets into an
  // inconsistent state due to an error, but it gets swallowed by a Promise,
  // and the user has no idea what causes React's erratic future behavior.

  // 拒绝跟踪阻止了一个常见的问题，即反应进入了一个
  // 不一致的状态由于一个错误，但是它被一个承诺所吞噬，
  // 而用户不知道是什么导致了反应不稳定的未来行为。
  require('promise/lib/rejection-tracking').enable();
  window.Promise = require('promise/lib/es6-extensions.js');
}

// fetch() polyfill for making API calls.
// fetch() 用于进行API调用的polyfill
require('whatwg-fetch');

// Object.assign() is commonly used with React.
// It will use the native implementation if it's present and isn't buggy.

// Object.assign()通常和react一起使用
// 如果它存在，并且没有bug, 它会使用native实现
Object.assign = require('object-assign');

// In tests, polyfill requestAnimationFrame since jsdom doesn't provide it yet.
// We don't polyfill it in the browser--this is user's responsibility.

// 在测试中，由于jsdom还没有提供它，所以polyfill requestAnimationFrame。
// 我们不会在浏览器中填充它——这是用户的责任。
if (process.env.NODE_ENV === 'test') {
  require('raf').polyfill(global);
}
