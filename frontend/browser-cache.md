---
outline: deep
---

# 浏览器缓存机制

缓存是一种保存资源副本并在下次请求时直接使用该副本的技术。

所有缓存资源都仅仅针对GET请求，而对POST，DELETE，PUT这类行为操作通常不做任何缓存。

## 缓存的作用

* 减小网络I/O,减小服务器压力
* 加快页面访问速度
* 减少宽带消耗
  
## 浏览器静态资源请求流程
![浏览器静态资源请求流程](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/4/28/163083c5c8f0de63~tplv-t2oaga2asx-jj-mark:3024:0:0:0:q75.awebp)

## 资源缓存分类
按照获取资源时请求的优先级依次排序：
* Memory Cache、Disk Cache
* Service Worker Cache
* HTTP Cache
* Push Cache

## HTTP-Cache
HTTP缓存又分为强缓存与协商缓存。强缓存优先级高于协商缓存。在匹配强缓存失败后，才匹配协商缓存。

### 新鲜度限值

HTTP通过缓存将服务器资源的副本保留一段时间，这段时间称为新鲜度限值。这在一段时间内请求相同资源不会再通过服务器。HTTP协议中Cache-Control 和 Expires可以用来设置新鲜度的限值。

### 服务器再验证

浏览器或代理缓存中缓存的资源过期了，并不意味着它和原始服务器上的资源有实际的差异，仅仅意味着到了要进行核对的时间了。这种情况被称为服务器再验证。

* 如果资源发生变化，则需要取得新的资源，并在缓存中替换旧资源。
* 如果资源没有发生变化，缓存只需要获取新的响应头，和一个新的过期时间，对缓存中的资源过期时间进行更新即可。

### 强缓存

强缓存主要通过Cache-Control和Expires设置。Cache-control是HTTP1.1响应头设置，Expires是HTTP1.0中的响应头设置。

当匹配强缓存时，会直接从缓存中获得资源，不再与服务端通信。返回HTTP状态码为200。

![from-disk-cache](https://raw.githubusercontent.com/staven630/blog/master/assets/images/fromdiskcache.png)

Chrome会根据本地内存的使用率来决定缓存存放在哪，如果内存使用率很高，放在磁盘里面，内存的使用率很低会暂时放在内存里面。

##### Cache-Control和Expires

![cache-control-expires](https://raw.githubusercontent.com/staven630/blog/master/assets/images/cachecontrolexpires.png)


Cache-Control设置的是相对时间，单位为s。Expires设置具体的过期时间（时间戳）。由于客户端与服务端的时间可能存在差异，导致Expires设置可能存在偏差。因此，优先考虑使用Cache-Control。

目前依然会设置Expires，目的是为了兼容http1.0。

##### Cache-Control属性

| 属性     | 描述                                                                                                        |
| :------- | :---------------------------------------------------------------------------------------------------------- |
| max-age  | 单位s。设置缓存最大的有效期。在max-age时间段内，浏览器不会再向服务器发送请求                                |
| s-maxage | 单位s。只在代理服务器中的public资源生效，优先级高于max-age。在s-maxage内，向代理浏览器请求缓存资源。        |
| public   | 指定资源，既可以被浏览器缓存，也可以被代理服务器缓存                                                        |
| private  | 只能被浏览器缓存                                                                                            |
| no-cache | 忽略浏览器缓存，匹配协商缓存：与服务器确认资源是否被更改过(依据if-None-Match和Etag)，在决定是否使用本地缓存 |
| no-store | 禁止任何缓存，重新向服务器发送请求，下载完整响应                                                            |

##### 后端设置

* node.js
```
res.setHeader('Cache-Control', 'public, max-age=' + 864000);
```

### 协商缓存
![last-modified](https://raw.githubusercontent.com/staven630/blog/master/assets/images/etaglastmodified.png)
<br /> 
协商缓存需要向服务器验证缓存的有效性。

HTTP1.1推荐使用的验证方式是If-None-Match/Etag，在HTTP1.0中则使用If-Modified-Since/Last-Modified。

##### Etag与if-None-Match

ETag值通常由服务器端计算，并在响应客户端请求时将它返回给客户端，验证资源是否已经修改。

> Etag值计算

* Apache

默认通过FileEtag中FileEtag INode Mtime Size的配置自动生成ETag。

* Nginx
  
默认以“文件最后修改时间16进制-文件长度16进制”设置Etag。

* Express

[serve-static](https://expressjs.com/en/resources/middleware/serve-static.html)中间件配置


##### if-Modified-Since与Last-Modified

if-Modified-Since与Last-Modified是HTTP1.0中用来验证资源是否过期的请求/响应头，这两个头部都是日期，验证过程与Etag类似。使用这两个头部来验证资源是否更新时，存在以下问题：

* 有些文件被重写了，但内容没有更改。重写的文件的修改日期与if-Modified-Since不相同，会被当成新资源，导致不必要的重新请求。
* if-Modified-Since只能那个检查到以秒为最小时间差检测文件的变化，当修改文件过快可能不能及时检测到文件的变化。
* 有些文档资源被修改了，但修改内容(比如注释)并不重要，不需要所有的缓存都更新

##### 后端设置

* node.js
```javascript
res.setHeader('Cache-Control', 'public, max-age=' + 864000);
res.setHeader('Last-Modified', xxx);
res.setHeader('ETag', xxx);

```

### 启发式缓存
当响应头中没有设置Etag或者if-Modified-Since，会根据Date和Last-Modified之间的时间差值的10%作为缓存周期。

### html中缓存控制
* 使用Meta标签设置
```html
<meta http-equiv="pragma" content="no-cache" />
<meta http-equiv="cache-control" content="no-cache, must-revalidate" />
<meta http-equiv="cache" content="no-cache" />
<meta http-equiv="expires" content="Wed, 26 Feb 2017 08:21:57 GMT" />
```
* 微信浏览器中避免html被缓存
  
通过设置不存在的manifest。根据HTML5 W3C规范，解析器下载manifest header 404/410时，缓存即失效。
```html
<html manifest="IGNORE.manifest">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="pragma" content="no-cache">
    <meta http-equiv="cache-control" content="no-cache, must-revalidate">
    <meta http-equiv="cache" content="no-cache">
    <meta http-equiv="expires" content="Wed, 26 Feb 2017 08:21:57 GMT">
    <meta http-equiv="expires" content="0">
  </head>
</html>
```

### 最佳实践

* html：使用协商缓存
* js/css/image：使用强缓存，文件名采用hash值形式

