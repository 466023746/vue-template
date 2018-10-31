<template>
    <div id="app">
        <img class="top-img" src="//haitao.nos.netease.com/77f8c478-998d-4f29-8817-f126c85aefa9_750_460.png" alt="">

        <div class="participate">
            <div class="participate__title">如何报名</div>
            <div class="participate__left">
                <div class="participate__line1">首次参与</div>
                <i class="participate__line2 sqfont icn-kefu"></i>
                <div class="participate__line3">
                    <i class="participate__triangle"></i>
                    微信号：kaolakol
                </div>
                <div class="participate__line4">联系客服</div>
                <div class="participate__line5">开通任务权限</div>
            </div>

            <div class="participate__middle-line"></div>

            <div class="participate__right">
                <div class="participate__line1">已参与过</div>
                <i class="participate__line2 sqfont icn-task-center"></i>
                <div class="participate__line3">
                    <i class="participate__triangle"></i>
                    任务中心
                </div>
                <div class="participate__line4">登录kol.kaola.com</div>
                <div class="participate__line5">报名任务</div>
            </div>
        </div>

        <div class="task">
            <div class="task__title">
                <span class="task__title-line">
                    ||||||||||||||||||||||||||||||||||||||||||||||||
                </span>
                <span class="task__title-text">以下任务正在邀稿</span>
                <span class="task__title-line">
                    ||||||||||||||||||||||||||||||||||||||||||||||||
                </span>
            </div>

            <ct-scrollload :loading="loading"
                           :fail="fail"
                           :hasMore="hasMore"
                           @getData="getList">
                <task v-for="item in list" v-bind="item" :key="item.goodsId"></task>
            </ct-scrollload>
        </div>

        <footer class="footer">
            <img class="footer__img" src="//haitao.nos.netease.com/29f78201-1753-4a50-8945-5eb435860087_99_99.png" alt="">
            <div class="footer__right">
                <div class="footer__text">登录考拉创作平台 kol.kaola.com</div>
                <div class="footer__text">了解更多任务详情</div>
            </div>
        </footer>
    </div>
</template>

<script>
    import "normalize.css";
    import "@/css/variable.scss";
    import "@/css/common.scss";
    import api from '@/api';
    import task from '@/components/task'
    import _ from 'lodash';

    export default {
        name: 'app',
        components: {
            task
        },
        data() {
            return {
                page: 0,
                list: [],
                loading: false,
                fail: false,
                hasMore: true
            }
        },
        methods: {
            getList() {
                this.loading = true;
                this.page++;

                api.getTaskList({
                    pageNo: this.page
                }).then(body => {
                    this.loading = false;
                    this.fail = false;
                    const {data = {}} = body;
                    const {hits = []} = data;

                    this.list = this.list.concat(hits);
                    if (_.isEmpty(hits)) {
                        this.hasMore = false;
                    }
                }).catch(() => {
                    this.loading = false;
                    this.fail = true;
                    this.page--;
                })
            }
        }
    }
</script>

<style lang="scss">
    @import "../../css/variable.scss";

    body {
        background: #fff1f1;
    }

    .top-img {
        width: 100%;
        margin-bottom: rem750(-88);
    }

    .participate{
        position: relative;
        margin: 0 20px;
        background: #fff;
        box-shadow: 0 2px 16px 0 rgba(0, 0, 0, 0.15);
        border-radius: 4px;
        display: flex;
        padding: 45px 0 30px;
        justify-content: center;

        &__title {
            position: absolute;
            width: 130px;
            height: 40px;
            line-height: 40px;
            text-align: center;
            top: -20px;
            left: 50%;
            margin-left: -65px;
            background: #1a1a1a;
            border-radius: 100px;
            font-size: 18px;
            color: #fff;
            font-weight: bold;
        }

        &__left,
        &__right {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        &__middle-line {
            height: 125px;
            width: 1px;
            background: #eee;
            align-self: flex-end;
            flex-shrink: 0;
        }

        &__line1 {
            font-size: 18px;
            color: #333333;
            font-weight: bold;
        }

        &__line2 {
            margin-top: 16px;
        }

        .sqfont {
            font-size: 52px;
            color: #ff0000;
        }

        &__line3 {
            position: relative;
            margin-top: 15px;
            padding: 3px 6px;
            background: #ff0000;
            border-radius: 4px;
            font-size: 12px;
            color: #fff;
            line-height: 1;
        }

        &__triangle {
            position: absolute;
            bottom: -8px;
            left: 50%;
            margin-left: -4px;
            border: 4px solid transparent;
            border-top-color: #ff0000;
        }

        &__line4,
        &__line5 {
            font-size: 14px;
            color: #333;
            line-height: 1;
            margin-top: 9px;
        }

        &__line5 {
            margin-top: 6px;
        }

        &__border-line {
            position: absolute;
            top: 84px;
            left: 50%;
            transform: translateX(-50%);
            border-left: 1px solid #eee;
            height: 125px;
        }
    }

    .task {
        margin: 35px 20px 0;

        &__title {
            height: 25px;
            display: flex;
            justify-content: center;
            align-items: center;
            line-height: 1;
        }

        &__title-line {
            color: #999;
            white-space: nowrap;
            overflow: hidden;
            letter-spacing: 3px;
            transform: skewX(-25deg);
            height: 7px;
        }

        &__title-text {
            flex-shrink: 0;
            margin: 0 8px;
            font-size: 18px;
            color: #333;
            font-weight: bold;
        }
    }

    .footer {
        background: #333333;
        padding: 23px 0;
        margin-top: 20px;
        display: flex;
        justify-content: center;
        align-items: center;

        &__img {
            width: 33px;
            flex-shrink: 0;
            margin-right: 10px;
        }

        &__text {
            font-size: 14px;
            color: #fff;
            line-height: 20px;
        }
    }
</style>
