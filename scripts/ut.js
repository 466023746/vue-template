const fs = require('fs');
const path = require('path');

function getFilesMap(answers, dirname, target) {
    const root = path.resolve('./');
    const files = readDir(path.resolve(__dirname, dirname, './template'));
    const map = {};

    files.forEach(file => {
        const oldFile = file.replace(new RegExp(`${__dirname}/${dirname}/template/`), '');
        const newFile = file
            .replace(root, '')
            .replace(new RegExp(`scripts/${dirname}/template/`), target)
            .replace(/%=\s*([^%=\s]+)\s*%/g, (str, $1) => answers[$1]);

        map[oldFile] = newFile;
    });

    return map
}
exports.getFilesMap = getFilesMap;

function readDir(dir) {
    let files = [];
    const filenames = fs.readdirSync(dir);

    for (let filename of filenames) {
        const childPath = path.resolve(dir, filename);
        const stats = fs.statSync(childPath);

        if (stats.isFile()) {
            files.push(childPath);
        } else {
            files = files.concat(readDir(childPath));
        }
    }

    return files;
}
exports.readDir = readDir;

/**
 * 动态创建mock文件
 * @param apiList
 * @param dirname
 * @returns {boolean}
 */
function createMockFile(apiList, dirname) {
    if (apiList) {
        apiList = apiList.split(/,，/g);

        apiList.forEach(api => {
            const arr = api.split('/');
            const dir = arr.slice(0, arr.length - 1).join('/');
            const name = arr[arr.length - 1];
            let filename = path.join(__dirname, `${dirname}/template/mock/async`, dir);
            filename = path.format({
                dir: filename,
                name,
                ext: '.json'
            });

            createFile(filename);
        });

        return true
    }
}
exports.createMockFile = createMockFile;

/**
 * 删除mock文件
 * @param dirname
 * @returns {boolean}
 */
function deleteMockFile(dirname) {
    const filename = path.resolve(__dirname, `${dirname}/template/mock/async`);
    const files = formatReadDir(filename);

    files.forEach(file => deleteFile(file));
    return true
}
exports.deleteMockFile = deleteMockFile;

/**
 * 创建文件或者文件夹
 * @param filename
 */
function createFile(filename, ...cb) {
    if (!filename) return;

    let {ext} = path.parse(filename);

    if (ext) {
        try {
            fs.writeFileSync(filename, '');
        } catch (e) {
            let {dir} = path.parse(filename);

            createFile(dir, () => createFile(filename));
        }
    } else {
        try {
            fs.mkdirSync(filename);
            cb && cb.forEach(fn => fn());
        } catch (e) {
            let {dir} = path.parse(filename);

            createFile(dir, () => createFile(filename), ...cb);
        }
    }

    return true
}
exports.createFile = createFile;

/**
 * 删除文件或者文件夹
 * @param filename
 */
function deleteFile(filename) {
    if (!filename) return;

    let {ext} = path.parse(filename);

    if (ext) {
        fs.unlinkSync(filename);
    } else {
        const files = formatReadDir(filename);

        files.forEach(file => deleteFile(file));

        fs.rmdirSync(filename);
    }

    return true
}

/**
 * 读取文件夹内容，返回绝对路径
 * @param filename
 * @returns {*}
 */
function formatReadDir(filename) {
    if (!filename) return [];

    let files = fs.readdirSync(filename);
    files = files.map(file => path.resolve(filename, file));

    return files;
}
exports.formatReadDir = formatReadDir;
