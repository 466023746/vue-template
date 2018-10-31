const ut = require('../ut');

let map;

module.exports = {
    prompts: {
        pageName: {
            type: 'input',
            message: '请输入页面名称：'
        },
    },
    move(answers) {
        map = ut.getFilesMap(answers, 'page-template', 'src/pages/');
        return map;
    },
    post({log}) {
        // ut.deleteMockFile(name);
        log.success('Create files successfully!');
        for (let key in map) {
            log.info(`${map[key]}`);
        }
    }
};
