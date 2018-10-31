<template>
    <div class="task-item">
        <header>
            <div class="task-item__label">任务</div>
            <div class="task-item__name f-els-2">{{name}}</div>
            <i class="task-item__circle task-item__circle--left"></i>
            <i class="task-item__circle task-item__circle--right"></i>
        </header>

        <main>
            <div class="task-item__fee">
                <i class="dot"></i>任务稿费：<span class="task-item__price">¥{{rewardMin}}～¥{{rewardMax}}</span>
            </div>
            <div class="task-item__date">
                <i class="dot"></i>报名截止时间： {{enrollDeadline}}
            </div>
            <div class="task-item__goods">
                <div class="task-item__goods-img" :style="{'background-image': 'url(' + goods.goodsImage + ')'}"></div>
                <div class="task-item__goods-right">
                    <div class="task-item__goods-name f-els-2">{{goodsName}}</div>
                    <div class="task-item__goods-price">价值 ¥{{goods.goodsPrice}}</div>
                </div>
                <div class="task-item__goods-label">
                    <div class="task-item__goods-label-inner">赠送</div>
                </div>
            </div>
        </main>

        <footer>
            <button class="task-item__btn" @click="cooperation">报名合作</button>
        </footer>

        <common-dialog :show="dialogShow">
            <div class="cooperation-dialog">
                <i class="sqfont icn-close cooperation-dialog__close" @click="close"></i>
                <div class="cooperation-dialog__title">
                    <div class="cooperation-dialog__title-inner"><span class="cooperation-dialog__title-text">如何报名合作</span></div>
                </div>
                <div class="cooperation-dialog__first">
                    <i class="dot"></i>
                    <div class="cooperation-dialog__right">
                        <div class="cooperation-dialog__sub-title">首次参与：</div>
                        <div class="cooperation-dialog__text">联系平台客服微信kaolakol，开通任务权限</div>
                    </div>
                </div>

                <div class="cooperation-dialog__already">
                    <i class="dot"></i>
                    <div class="cooperation-dialog__right">
                        <div class="cooperation-dialog__sub-title">已参与过：</div>
                        <div class="cooperation-dialog__text">登录kol.kaola.com 找到任务中心去报名</div>
                    </div>
                </div>

                <div class="cooperation-dialog__footer">
                    <button class="cooperation-dialog__btn" @click="close">我知道了</button>
                </div>
            </div>
        </common-dialog>
    </div>
</template>

<script>
    import commonDialog from '@/components/common-dialog';

    export default {
        name: 'task',
        components: {
            commonDialog
        },
        props: {
            name: String,
            rewardMin: String,
            rewardMax: String,
            enrollDeadline: String,
            goods: Object,
            goodsName: String
        },
        data() {
            return {
                dialogShow: false
            }
        },
        methods: {
            cooperation() {
                this.dialogShow = true;
            },
            close() {
                this.dialogShow = false;
            }
        }
    }
</script>

<style lang="scss">
    .task-item {
        margin-top: 15px;
        background: #fff;
        border-radius: 4px;
        box-shadow: 0 1px 8px 0 rgba(0, 0, 0, 0.15);

        header {
            position: relative;
            margin: 0 10px;
            padding: 20px 10px 14px;
            display: flex;
            border-bottom: 1px dotted #e2e2e2;
        }

        &__label {
            flex-shrink: 0;
            width: 37px;
            height: 18px;
            line-height: 18px;
            text-align: center;
            margin-right: 8px;
            background: #6cb882;
            border-radius: 100px;
            font-size: 12px;
            color: #fff;
        }

        &__name {
            font-size: 14px;
            color: #333;
            font-weight: bold;
            line-height: 20px;
        }

        &__circle {
            position: absolute;
            width: 116px;
            height: 98px;
            bottom: -49px;
            background-size: 39px;
            background-repeat: no-repeat;

            &--left {
                left: -118px;
                background-image: url(//haitao.nos.netease.com/0c7757cb-4d8c-473b-8606-9ca71511f2af_116_296.png);
                background-position: right -4px center;
            }

            &--right {
                right: -118px;
                background-image: url(//haitao.nos.netease.com/04fa9fcc-bddb-4f5e-9e95-637afa53cc9f_116_296.png);
                background-position: left -4px center;
            }
        }

        main {
            padding: 15px 20px;
        }

        &__fee,
        &__date {
            font-size: 14px;
            color: #333;
            line-height: 1;
        }

        &__date {
            margin-top: 12px;
        }

        .dot {
            vertical-align: 5px;
            margin-right: 6px;
        }

        &__price {
            font-size: 20px;
            color: #ff0000;
            font-weight: bold;
        }

        &__goods {
            position: relative;
            margin-top: 10px;
            padding: 10px;
            background: #f5f5f5;
            border-radius: 4px;
            display: flex;
            align-items: center;
        }

        &__goods-img {
            flex-shrink: 0;
            width: 90px;
            height: 90px;
            background: center/cover no-repeat;
            margin-right: 15px;
        }

        &__goods-right {
            flex-grow: 1;
            margin-top: -1.5px;
        }

        &__goods-name {
            font-size: 14px;
            line-height: 20px;
            height: 40px;
            color: #666;
        }

        &__goods-price {
            margin-top: 15px;
            font-size: 14px;
            color: #333;
            padding-right: 60px;
        }

        &__goods-label {
            position: absolute;
            right: -10px;
            bottom: 8px;
            width: 70px;
            height: 32px;
            line-height: 32px;
            text-align: center;
            border: 1px solid #ff0000;
            border-radius: 2px;
            padding: 2px 4px 4px 2px;
            font-size: 18px;
            color: #ff0000;
            font-weight: bold;
            transform: rotate(-15deg);
        }

        &__goods-label-inner {
            border-radius: 2px;
            border: 1px solid #ff0000;
            width: 100%;
            height: 100%;
        }

        footer {
            padding-bottom: 20px;
            text-align: center;
        }

        &__btn {
            width: 195px;
            height: 30px;
            line-height: 28px;
            text-align: center;
            background: #ff0000;
            border-radius: 100px;
            font-size: 16px;
            color: #fff;
            border: 0;
            outline: 0;
        }
    }

    .cooperation-dialog {
        position: relative;
        width: 270px;
        background: url(//haitao.nos.netease.com/1aee5ea4-9e2a-4f42-99c3-ba613c71a461_810_1005.png) center/cover no-repeat #fff;
        border-radius: 10px;
        padding: 25px 20px 30px;
        box-sizing: border-box;

        &__close {
            position: absolute;
            top: 15px;
            right: 15px;
            cursor: pointer;
            color: #ccc;
        }

        &__title {
            font-size: 20px;
            color: #333;
            font-weight: bold;
            text-align: center;
        }

        &__title-inner {
            position: relative;
            display: inline-block;

            &::before {
                content: '';
                position: absolute;
                bottom: 0;
                width: 100%;
                height: 10px;
                background: #ffe8e8;
            }
        }

        &__title-text {
            position: relative;
            z-index: 1;
        }

        &__first,
        &__already {
            display: flex;
            margin-top: 20px
        }

        .dot {
            flex-shrink: 0;
            margin-right: 10px;
            margin-top: 6px;
        }

        &__sub-title {
            font-size: 16px;
            color: #333;
            line-height: 22px;
        }

        &__text {
            margin-top: 5px;
            font-size: 16px;
            color: #666;
            line-height: 22px;
        }

        &__footer {
            margin-top: 29px;
            text-align: center;
        }

        &__btn {
            border: 0;
            outline: 0;
            background-image: linear-gradient(-90deg, #ff0000, #ff3264);
            box-shadow: 0 6px 12px 2px rgba(255, 0, 0, 0.3);
            border-radius: 100px;
            width: 120px;
            height: 38px;
            line-height: 38px;
            text-align: center;
            font-size: 16px;
            color: #fff;
        }
    }
</style>
