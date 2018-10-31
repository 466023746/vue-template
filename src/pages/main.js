import Vue from 'vue';

import {toast} from '@kaola-kol/ct-toast';
import scrollload from '@kaola-kol/ct-scrollload';

Vue.use(toast);
Vue.use(scrollload);

import getShare from 'mobileweb-ui/share/share.js';
getShare();
