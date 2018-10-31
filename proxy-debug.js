/**
 * Created by loutao on 2017/3/14.
 */

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
