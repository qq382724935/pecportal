<!--
 * @Author: 刘利军
 * @Date: 2020-06-18 17:58:00
 * @LastEditors: 刘利军
 * @LastEditTime: 2020-06-18 18:00:02
 * @Description: 
--> 


cacheEnabled：设置WebView是否应使用浏览器缓存

cacheMode：覆盖缓存的使用方式。缓存的使用方式取决于导航类型。对于正常的页面加载，将检查缓存并根据需要重新验证内容。返回时，内容不会被重新验证，而只是从缓存中检索内容。此属性允许客户端重写此行为。
可能的值是:
LOAD_DEFAULT—默认的缓存使用模式。如果导航类型没有强加任何特定行为，请在可用且未过期时使用缓存资源，否则从网络加载资源。
LOAD_CACHE_ELSE_NETWORK—使用可用的缓存资源，即使它们已经过期。否则从网络加载资源。
LOAD_NO_CACHE—不使用缓存，从网络加载。
LOAD_CACHE_ONLY—不使用网络，从缓存加载。

clearCache() 清除所有使用的WebView的缓存