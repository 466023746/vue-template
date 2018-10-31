<template>
    <div class="dialog" v-show="show">
        <div class="dialog__bg"></div>
        <div :class="['dialog__content', {'dialog__content--center': center}]">
            <slot></slot>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'common-dialog',
        props: {
            show: Boolean,
            lockScroll: {
                type: Boolean,
                default: true
            },
            // 默认居中，false自定义位置
            center: {
                type: Boolean,
                default: true
            }
        },
        watch: {
            show(v) {
                if (v) {
                    if (this.lockScroll) {
                        document.body.classList.add('dialog-lock-scroll');
                    }
                } else {
                    document.body.classList.remove('dialog-lock-scroll');
                }
            }
        }
    }
</script>

<style lang="scss">
    .dialog {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 2000;

        &__bg {
            position: absolute;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, .8);
        }

        &__content {

            &--center {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }
        }
    }

    .dialog-lock-scroll {
        overflow: hidden;
    }
</style>
