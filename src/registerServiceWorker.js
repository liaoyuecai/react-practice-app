// 在生产环境中，我们注册service worker从本地缓存中服务资产

// 这使得应用程序在随后的产品访问中加载速度更快，并提供离线功能。
// 但是，这也意味着开发人员（和用户）只会在“N+1”访问页面上看到部署的更新，
// 因为以前缓存的资源在后台更新。

// 要了解更多关于这个模型的好处，请阅读https://goo.gl/kwvdny。这个链接还包括了选择退出这个行为的说明。

const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
    // [::1] 是IPv6主机地址
    window.location.hostname === '[::1]' ||
    // 127.0.0.1/8 被认为是IPv4的本地主机.
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
);

export default function register() {
  if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
    // URL构造函数在支持SW的所有浏览器中都可用.
    const publicUrl = new URL(process.env.PUBLIC_URL, window.location);
    if (publicUrl.origin !== window.location.origin) {
      // 如果publicurl与我们页面的服务不同，我们的service worker将无法工作。如果CDN用于服务资产，
      // 则可能会发生这种情况;参见https://github.com/facebookincubator/create-react-app/issues/2374
      return;
    }

    window.addEventListener('load', () => {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

      if (isLocalhost) {
        // 这是在本地主机上运行的。让我们检查service worker是否仍然存在
        checkValidServiceWorker(swUrl);

        // 将一些额外的日志记录添加到localhost，并将开发者指向service worker/pwa文档
        navigator.serviceWorker.ready.then(() => {
          console.log(
            'This web app is being served cache-first by a service ' +
              'worker. To learn more, visit https://goo.gl/SC7cgQ'
          );
        });
      } else {
        // 不是本地主机,只是注册service worke
        registerValidSW(swUrl);
      }
    });
  }
}

function registerValidSW(swUrl) {
  navigator.serviceWorker
    .register(swUrl)
    .then(registration => {
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // 此时，除，新的内旧内容将被清容将被添加到缓存中
              // 现在正是展示“新内容可用的最佳时机;请刷新。”消息在你的网页应用中
              console.log('New content is available; please refresh.');
            } else {
              // 在这一点上，一切都已被提出。这是显示“内容被缓存到离线使用”的最佳时机
              console.log('Content is cached for offline use.');
            }
          }
        };
      };
    })
    .catch(error => {
      console.error('Error during service worker registration:', error);
    });
}

function checkValidServiceWorker(swUrl) {
  // Check if the service worker can be found. If it can't reload the page.
  // 检查service worker是否可以找到。如果它不能重载页面
  fetch(swUrl)
    .then(response => {
      // 确保service worker的存在，并且我们确实得到了一个JS文件
      if (
        response.status === 404 ||
        response.headers.get('content-type').indexOf('javascript') === -1
      ) {
        // 确保service worker的存在，并且我们确实得到了一个JS文件
        navigator.serviceWorker.ready.then(registration => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        // Service worker发现。正常进行。
        registerValidSW(swUrl);
      }
    })
    .catch(() => {
      console.log(
        'No internet connection found. App is running in offline mode.'
      );
    });
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(registration => {
      registration.unregister();
    });
  }
}
