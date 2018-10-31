# h5工程vue架构说明

社区h5准备接入vue技术栈，这里介绍下新的技术栈的一些细节

## 核心

采用[vue cli](https://cli.vuejs.org/)

## 开发

- 本地开发`npm run serve`
    * 启动一个server
    * 自动打开根页面，根据导航跳转相应页面
    * 支持hmr
- 测试/线上调试`npm run debug`
    * 启动一个server
    * 自动设置浏览器代理

*注意：开发和调试的server互相独立，它们之间没有任何关系*

## 说明

项目通过`vue cli`生成，本次说明将通过一份`vue cli`的配置文件一一叙说

```js
// src/main/resources/wap-vue/vue.config.js

const fs = require('fs');
const path = require('path');
const glob = require('glob');

const pagesDir = path.resolve(__dirname, 'src/pages');
const pagesDirDist = path.resolve(__dirname, 'dist/pages');

const pages = (() => {
    const files = glob.sync(`**/index.ftl`, {cwd: pagesDir});
    let result = {};

    files.forEach(file => {
        let template = path.resolve(pagesDir, file);
        let filename = template.replace(pagesDir, pagesDirDist);
        let entry = filename.replace('index.ftl', 'main.js');

        let name = path.parse(file).dir;
        result[name] = {
            template,
            filename,
            entry
        }
    });

    return result
})();

const formatHtmlPlugin = (pages, config) => {
  for (const name in pages) {
      config
          .plugin(`html-${name}`)
          .tap(args => {
              // ftl文件不minify，否则会报错
              args[0].minify = false;

              return args
          })
  }
};

const mockDir = path.resolve(__dirname, 'mock');
const port = 9998;

const proxyOption = (() => {
    const files = glob.sync(`**/*.json`, {cwd: mockDir});
    let result = {};

    files.forEach(file => {
        const parse = path.parse(file);
        const key = path.join('/', parse.dir, parse.name);
        const rewritePath = path.join('/mock', file);

        result[key] = {
            target: 'http://localhost:9998',
            rewrite: () => rewritePath
        }
    });

    return result
})();

const copyWebpackPlugin = require('copy-webpack-plugin');

const baseUrl = {
    development: '/',
    test: '/v/dist/',
    production: '//w.kl.126.net/community/v/dist/',
    debug: '/v/dist/'
};

const filename = {
    development(config) {
        config.output
            .filename('js/[name].js');
    },
    debug(config) {
        config.output
            .filename('js/[name].js')
            .chunkFilename('js/[name].js');

        config.plugin('extract-css')
            .tap(args => {
                args[0].filename = 'css/[name].css';
                args[0].chunkFilename = 'css/[name].css';
                return args
            });

        config.module
            .rule('images')
            .use('url-loader')
            .tap(options => {
                options.fallback.options.name = 'img/[name].[ext]';
                return options
            });

        config.module
            .rule('svg')
            .use('file-loader')
            .tap(options => {
                options.name = 'img/[name].[ext]';
                return options
            });

        config.module
            .rule('media')
            .use('url-loader')
            .tap(options => {
                options.fallback.options.name = 'media/[name].[ext]';
                return options
            });

        config.module
            .rule('fonts')
            .use('url-loader')
            .tap(options => {
                options.fallback.options.name = 'fonts/[name].[ext]';
                return options
            });
    }
};

module.exports = {
    baseUrl: baseUrl[process.env.build],
    pages,
    chainWebpack: config => {
        const filenameFn = filename[process.env.build];
        filenameFn && filenameFn(config);

        config.module
            .rule('ftl')
            .test(/\.ftl/)
            .use('html-loader')
            .loader('html-loader')
            .end();

        config.plugin('copy')
            .use(copyWebpackPlugin, [[
                {
                    context: path.resolve(__dirname, 'src'),
                    from: '**/!(index).ftl',
                    to: path.resolve(__dirname, 'dist')
                }
            ]]);

        formatHtmlPlugin(pages, config);
    },
    pluginOptions: {
        ftlRender: {
            ftlOption: {
                root: path.resolve(__dirname, 'dist/pages'),
                paths: [
                    path.resolve(__dirname, 'node_modules/@kaola/mobileweb-ftl')
                ]
            },
            serverOption: {
                port,
                devMiddleware: {
                    writeToDisk: true
                },
                open: {
                    app: 'chrome'
                }
            },
            proxyOption
        }
    }
};
```

内容很多，没事，一行一行分析

## 多页应用

依然是一个多页应用，没有采用vue惯用的单页。

```js
const pagesDir = path.resolve(__dirname, 'src/pages');
const pagesDirDist = path.resolve(__dirname, 'dist/pages');

const pages = (() => {
    const files = glob.sync(`**/index.ftl`, {cwd: pagesDir});
    let result = {};

    files.forEach(file => {
        let template = path.resolve(pagesDir, file);
        let filename = template.replace(pagesDir, pagesDirDist);
        let entry = filename.replace('index.ftl', 'main.js');

        let name = path.parse(file).dir;
        result[name] = {
            template,
            filename,
            entry
        }
    });

    return result
})();

module.exports = {
    pages
};
```

通过`pages`的自执行`function`根据`src/pages`目录自动生成`vue cli`需要的`pages`配置项，此配置项会在`vue cli`内部动态生成多个`htmlWebpackPlugin`，从而达到多页目的

每一页的目录结构为

```js
- demo
    - index.ftl // 页面，命名必须为index
    - mock.ftl  // 页面mock数据
    - main.js   // js入口
    - App.vue   // 根组件
    - store.js  // vue store
```

*注意：新建的页面需要重新运行`npm run serve`才能生效*

## mock

```js
const mockDir = path.resolve(__dirname, 'mock');
const port = 9998;

const proxyOption = (() => {
    const files = glob.sync(`**/*.json`, {cwd: mockDir});
    let result = {};

    files.forEach(file => {
        const parse = path.parse(file);
        const key = path.join('/', parse.dir, parse.name);
        const rewritePath = path.join('/mock', file);

        result[key] = {
            target: `http://localhost:${port}`,
            rewrite: () => rewritePath
        }
    });

    return result
})();
```

mock路由根据`mock`目录结构自动生成

## 调试

```js
const filename = {
    development(config) {
        config.output
            .filename('js/[name].js');
    },
    debug(config) {
        config.output
            .filename('js/[name].js')
            .chunkFilename('js/[name].js');

        config.plugin('extract-css')
            .tap(args => {
                args[0].filename = 'css/[name].css';
                args[0].chunkFilename = 'css/[name].css';
                return args
            });

        config.module
            .rule('images')
            .use('url-loader')
            .tap(options => {
                options.fallback.options.name = 'img/[name].[ext]';
                return options
            });

        config.module
            .rule('svg')
            .use('file-loader')
            .tap(options => {
                options.name = 'img/[name].[ext]';
                return options
            });

        config.module
            .rule('media')
            .use('url-loader')
            .tap(options => {
                options.fallback.options.name = 'media/[name].[ext]';
                return options
            });

        config.module
            .rule('fonts')
            .use('url-loader')
            .tap(options => {
                options.fallback.options.name = 'fonts/[name].[ext]';
                return options
            });
    }
};
```

`debug`模式的原理是代理静态资源到本地，由于测试/线上环境的资源带hash，本地如果也带hash，两者hash很可能不同，导致404，所以生成的文件名统一都去掉hash

`debug`使用了`proxy-local`库，看一下它的配置文件

```js
// src/main/resources/wap-vue/proxy-debug.js

const proxyLocal = require('proxy-local')
const url = require('url')
const path = require('path')

const httpRules = [
    {
        test: '**/v/dist/**',  // kaola-community-web wap
        async fn(remoteUrl) {
            let localPath = __dirname;
            let obj = url.parse(remoteUrl)
            let {pathname} = obj
            pathname = pathname.replace(/v\/dist/, 'dist')
            let basename = path.basename(pathname)
            let ext = path.extname(pathname).substr(1)
            let arr = basename.split('.')
            if (ext != 'map' && arr.length > 2) {
                arr.splice(1, 1)
            }
            let fileName = arr.join('.')
            let dir = path.join(localPath, path.dirname(pathname))

            console.log(path.join(dir, fileName))
            return path.join(dir, fileName)
        }
    }
]

const httpsRules = httpRules

const httpOptions = {
    rules: httpRules,
    autoSetProxy: true
}

const httpsOptions = {
    rules: httpsRules,
    autoSetProxy: true
}

let httpServer = new proxyLocal.httpServer(httpOptions)
let httpsServer = new proxyLocal.httpsServer(httpsOptions)

httpServer.start()
httpsServer.start()

```

分别启动http和https代理服务器，这里注意`autoSetProxy`选项，它会自动设置你的浏览器代理，然后就是配置一个映射规则，映射到本地，开启后访问测试/线上环境，如果看到

![代理图片](https://haitao.nos.netease.com/c77e9690-45ff-451f-a910-3f64357b2fac_521_315.jpg)

说明代理成功

## ftl处理

### 解析

```js
const formatHtmlPlugin = (pages, config) => {
  for (const name in pages) {
      config
          .plugin(`html-${name}`)
          .tap(args => {
              // ftl文件不minify，否则会报错
              args[0].minify = false;

              return args
          })
  }
};

module.exports = {
    chainWebpack: config => {

        config.module
            .rule('ftl')
            .test(/\.ftl/)
            .use('html-loader')
            .loader('html-loader')
            .end();

        formatHtmlPlugin(pages, config);
    }
};
```

采用html-loader处理，并且要关调minify，否则会报错，因为minify不支持ftl

### 渲染

```js
module.exports = {
    pluginOptions: {
        ftlRender: {
            ftlOption: {
                root: path.resolve(__dirname, 'dist/pages'),
                paths: [
                    path.resolve(__dirname, 'node_modules/@kaola/mobileweb-ftl')
                ]
            },
            serverOption: {
                port,
                devMiddleware: {
                    writeToDisk: true
                },
                open: {
                    app: 'chrome'
                }
            },
            proxyOption
        }
    }
};
```

首先server采用了`vue-cli-plugin-ftl-render`这个库，其内部使用了`fast-ftl`作为ftl的渲染引擎，ftl的加载路径这里设置了两个，一个是`dist/pages`，一个是`node_modules/@kaola/mobileweb-ftl`，模版里面建议都使用绝对路径加载，保证风格统一

*注意：由于是多路径加载，可能会存在同名文件，ftl加载器会使用第一个找到的文件，路径优先级是`paths >> root`*

## 底层支持

由于h5依赖公共组提供的regular、nej组件，为了减少迁移成本，本架构webpack支持了这类组件，可以直接使用

## 规范

- [社区vue规范](https://github.com/466023746/blog/issues/3)
- [社区js注释规范](https://github.com/466023746/blog/issues/4)
- [社区css规范](https://github.com/466023746/blog/issues/5)
- [社区commit规范](https://github.com/466023746/blog/issues/6)

