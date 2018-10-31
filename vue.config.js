const path = require('path');
const glob = require('glob');
const webpack = require('webpack');

const pagesDir = path.resolve(__dirname, 'src/pages');
const pagesDirDist = path.resolve(__dirname, 'dist/pages');

const pages = (() => {
    const files = glob.sync(`**/index.ftl`, {cwd: pagesDir});
    let result = {};

    files.forEach(file => {
        let template = path.resolve(pagesDir, file);
        let filename = template.replace(pagesDir, pagesDirDist);
        let entry = template.replace('index.ftl', 'main.js');

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
const host = getIp();
const port = 9998;

const proxyOption = (() => {
    const files = glob.sync(`**/*.json`, {cwd: mockDir});
    let result = {};

    files.forEach(file => {
        const parse = path.parse(file);
        const key = path.join('/', parse.dir, parse.name);
        const rewritePath = path.join('/mock', file);

        result[key] = {
            target: `http://${host}:${port}`,
            rewrite: () => rewritePath,
            events: {
                proxyReq: (proxyReq => {
                    // post转为GET
                    proxyReq.method = 'GET';
                })
            }
        }
    });

    return result
})();

const copyWebpackPlugin = require('copy-webpack-plugin');
const cdnPath = '/v/dist';

const baseUrl = {
    development: '/',
    test: cdnPath,
    production: `//w.kl.126.net${cdnPath}`,
    debug: cdnPath
};

const outputDir = {
    production: path.join(__dirname, 'dist', cdnPath)
};

module.exports = {
    baseUrl: baseUrl[process.env.build],
    outputDir: outputDir[process.env.build],
    pages,
    chainWebpack: config => {
        config.module
            .rule('ftl')
            .test(/\.ftl/)
            .use('html-loader')
            .loader('html-loader')
            .end();

        config.module
            .rule('html')
            .test(/\.html/)
            .use('html-loader')
            .loader('html-loader')
            .options({
                minify: false
            })
            .end();

        config
            .when(process.env.build === 'development', config => {
                config.module
                    .rule('mcss')
                    .test(/\.mcss/)
                    .use('style-loader')
                    .loader('style-loader')
            });

        config
            .when(process.env.build !== 'development', config => {
                config.module
                    .rule('mcss')
                    .use('extract-css-loader')
                    .loader(require('mini-css-extract-plugin').loader)
                    .options({
                        publicPath: '../'
                    });
            });

        config.module
            .rule('mcss')
            .test(/\.mcss/)
            .use('css-loader')
            .loader('css-loader')
            .end()
            .use('postcss-loader')
            .loader('postcss-loader')
            .end()
            .use('mcss-loader')
            .loader('mcss-loader')
            .options({
                include: path.join(__dirname, 'node_modules', '@kaola', 'mobileweb-mcss')
            })
            .end();

        config.module
            .rule('window')
            .test(/(nej-h5|jweixin-1\.3\.2)/)
            .use('imports-loader')
            .loader('imports-loader?this=>window');

        config.plugin('copy')
            .use(copyWebpackPlugin, [[
                {
                    context: path.resolve(__dirname, 'src'),
                    from: '**/!(index).ftl',
                    to: path.resolve(__dirname, 'dist')
                }
            ]]);

        formatHtmlPlugin(pages, config);

        config.resolve.alias
            .set('mobileweb-ui', '@kaola/mobileweb-ui')
            .set('mobileweb-helper', '@kaola/mobileweb-helper')
            .set('mobileweb-mcss', '@kaola/mobileweb-mcss')
            .set('nej', '@kaola/nej-h5')
            .set('regularjs', 'regularjs/dist/regular')
            .set('jsbridge_4ios', '@kaola/jsbridge_4ios')
            .set('iscroll', 'iscroll/build/iscroll-probe.js');

        config
            .plugin('provide')
            .use(webpack.ProvidePlugin, [{
                wx: require.resolve('@kaola/mobileweb-ui/wxApi/jweixin-1.3.2')  //为微信jssdk暴露全局变量
            }]);

        config
            .when(process.env.build === 'development', config => {
                config.output
                    .filename('js/[name].js');
            });

        config
            .when(process.env.build === 'debug', config => {
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
            });
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
                host,
                port,
                devMiddleware: {
                    writeToDisk: true
                },
                open: {
                    app: 'chrome'
                },
                hotClient: {
                    allEntries: true
                }
            },
            proxyOption
        }
    }
};

function getIp() {
    const os = require('os');
    const interfaces = os.networkInterfaces();
    const obj = interfaces.en0;
    const local = 'localhost';
    if (obj) {
        const ipv4 = obj.find(item => item.family === 'IPv4');
        return ipv4 && ipv4.address || local;
    } else {
        return local;
    }
}
