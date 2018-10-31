import axios from 'axios';
import {toastObj} from '@kaola-kol/ct-toast';
import {NOT_TOAST} from '@/widget/const';

axios.defaults.timeout = 30000;

const errorMsg = '服务器错误，请稍后再试';

axios.interceptors.response.use(
    (response) => {
        const {data, config} = response;
        const {code, msg, body} = data;

        if (code < 0) {
            // 支持不使用默认toast
            if (!config[NOT_TOAST]) {
                toastObj.show({message: msg || errorMsg, singleMsg: true});
            }
            return Promise.reject(data);
        }
        return body;
    },
    (error) => {
        const {config} = error;

        // 支持不使用默认toast
        if (!config[NOT_TOAST]) {
            toastObj.show({message: errorMsg, singleMsg: true});
        }
        return Promise.reject(error);
    }
);

export default axios;
