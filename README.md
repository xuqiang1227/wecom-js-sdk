# 企业微信JS SDK认证

## 流程

点击侧边栏入口的url -> 访问到web端的一个地址。

web解析该地址，然后访问企业微信的认证地址。通过重定向地址再返回到web地址，与入口地址相同。

然后在web端认证。


该项目有两部分内容: 1、获取用户信息，2、`wx.config` 权限注入。这两部分内容不依赖。

* 准备工作

需要一个可以正常访问的域名：例如：`http://t9mvyd.39nat.com`

配置nginx，将项目的各个项目通过上述域可以正常访问。

* 配置第三方应用

在企业管理管理页面创建第三方应用，然后创建侧边框。配置：`http://t9mvyd.39nat.com?corpId=wwc0ff211cf0a76527`

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

## 如何使用

 * `setAuthContext` 设置必须的属性。获取 `tickets` 的 `url` 以及获取用户信息的 `url`

 * `registerFetchDataFunction` 注册获取`tickets`和`userInfo`的方法。

 * 在页面入口中调用 `getWeComCode`, `getReferTickets`, `getReferUser` 方法

 * 在需要认证的页面 调用 `doAuth` 方法