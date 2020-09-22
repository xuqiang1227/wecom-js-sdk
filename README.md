# 企业微信JS SDK认证

 [![npm package](https://img.shields.io/npm/v/wecom-js-sdk.svg?style=flat-square)](https://www.npmjs.org/package/wecom-js-sdk) 
 [![NPM downloads](http://img.shields.io/npm/dm/wecom-js-sdk.svg?style=flat-square)](http://npmjs.com/wecom-js-sdk)

## 说明

点击侧边栏入口的url -> 访问到web端的一个地址。

web解析该地址，然后访问企业微信的认证地址。通过重定向地址再返回到web地址，与入口地址相同。

然后在web端认证。


该项目有两部分内容: 1、获取用户信息，2、`wx.config` 权限注入。这两部分内容不依赖。

* 准备工作

需要一个可以正常访问的域名：例如：`http://t9mvyd.39nat.com`

配置nginx，将项目的各个项目通过上述域可以正常访问。

* 配置第三方应用

在企业管理管理页面创建第三方应用，然后创建侧边框。配置：`http://t9mvyd.39nat.com?corpId=APPID`

这里我的做法是将 `corpId` 直接配置进去。在web的入口 `index.ts` 中解析。

* 获取code

```js
window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=APPID&redirect_uri=REDIRECT_URIresponse_type=code&scope=SCOPE&state=STATE#wechat_redirect`;

```
 根据 `redirect_uri` 回来的地址，我们就可以拿到code了。

 * 缓存 `code` 和 `corpId`

  对于一个应用的生命周期内，`code` 和 `corpId` 是不变的。所以我们可以放到内在和 `sessionStorage` 中。

* 获取用户信息。

  需要服务端提供一个接口。根据 `code` 和 `corpId` 来获取用户信息。

* 获取签名

  对于一个应用，1天只允许获取100次的签名，所以在服务端和web端都需要缓存。

  而且从企业微信获取到的签名是会对整个应用的。

  从服务端拿到企业签名和应用签名。

  将这个签名信息缓存起来。

* 认证

  调用企业微信的每一个 jsApi 都需要认证。而且不同的url页面，都要进行认证。

  所以在进入每个页面时，我们单独调用 `wx.config` 和 `wx.agentConfig`.

## 接口、api说明

 * `setAuthContext` 设置必须的属性。

    |参数|说明|是否必填|默认值|
    |----|-----|----|-----|
    |weComBaseUrl|企业微信的认证地址|否|`https://open.weixin.qq.com/connect/oauth2/authorize`|
    |redirectUrl| 回调地址(一般是系统的入口) | 否| `window.location.href`|
    |authScope|企业微信参数|否|`snsapi_userinfo`|
    |nonceStr|企业微信参数|否|`@_weCom_js_sdk_app`|
    |timestamp|企业微信参数|否|`Date.now()`|
    |jsApiList|企业微信参数|否|`['invoke']`|

    例如：

    ```js
    import { setAuthContext } from 'wxcom-js-jdk';

    setAuthContext({
      jsApiList(['chooseImage']);
    })
    ```

 * `registerFetchDataFunction` 注册获取`tickets`和`userInfo`的方法。

 通过这个方法，将系统后台实现的获取tickets 和 用户信息的方法注册进去。

 需要定义两个方法：

  `getTicket = (corpId) => {//系统自己实现}`

  `getUserInfo = (corpId, code) => {//系统自己实现}`,其中 `code` 就是由企业微信返回

  然后将这两个方法注册给js-sdk:

  ```js
    import { registerFetchDataFunction } from 'wxcom-js-sdk';
    registerFetchDataFunction({
      fetchTicket: getTicket,
      fetchUser: getUserInfo
    });
  ```

 * 在页面入口中调用 `weComStart` 方法

  ```js
  import { weComStart } from 'wecom-js-sdk';

  weComStart();

  ```
 >另外还可以在页面入口中单独调用 `getWeComCode`, `getReferTickets`, `getReferUser` 方法

 * 在需要认证的页面 调用 `doAuth` 方法, 不同的页面，都需要调用.


 ## Debug

  在运行过程中可开启 `wx.config` 中的 debug.

  ```js
  import { openDebug } from 'wxcom-js-sdk';

  // 在入口的地方调用 
  openDebug((result) => {
      // true 为开启， false 关闭。提示使用
      if(result) {
        Toast.info('debug 模式开启')
      } 
    });
  ```
  > 你可以在一直打开debug。因为启用的时候，需要双击页面8次，否则debug还是无法开启。

 ## 使用

 1、`yarn add wecom-js-sdk`;

 2、在项目入口的地方，比如`index.js`中：

  ```js

  import { setAuthContext, registerFetchDataFunction, weComStart, openDebug } from 'wecom-js-sdk';
  import { getTicket, getUserInfo } from './service'; // 从本地引入自已定义的方法，一般由后端提供数据

  setAuthContext({});
  registerFetchDataFunction({
      fetchTicket: getTicket,
      fetchUser: getUserInfo
    });

  weComStart();

  openDebug(); // 建议常开。系统稳定后，就可以不用了。

  ```

  3、在需要调用 wx.xxxx 的页面进行认证

  ```js
  import { doAuth } from 'wecom-js-sdk';
  
  const jsApiList = ['chooseImage']; // 在这里定义当前页面所需要的jsApiList

  doAuth(jsApiList);

  ```

至此，一个普通的认证就完成了。

如果项目其他的地方需要签名和用户信息时，有两种办法：

 * `const [tickets, userInfo] = await weComStart()`; 

    或者 

   `weComStart().then(props => {// tickets = props[0], userInfo = props[1]})`

 * 可以直接调用内方法

    ```js
    import { getReferTickets, getReferUser } from 'wecom-js-sdk';
    ```

> 最后，别忘记在你的html页面中引入 https://res.wx.qq.com/open/js/jweixin-1.2.0.js ！！！