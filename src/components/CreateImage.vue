<style scoped lang="scss">
    .block {
        position: fixed;
        left: 0;
        top: 0;
        height: 100%;
        width: 100%;
        background: linear-gradient(#272d45, #1c1d3a);

        .picture {
            width: 100%;
        }

        /*.upload{
            position: fixed;
            bottom: 100px;
            width: 80%;
            left: 10%;
            height: 40px;
        }*/

        .save{
            position: fixed;
            bottom: 200px;
            width: 80%;
            left: 10%;
            height: 40px;
        }

        .palette {
            width: 100%;
        }
    }
</style>

<template>
    <div class="block">
        <img class="picture" :src="imageUrl" alt="" id="picture" v-if="saved">

        <div v-show="!saved">
            <!--<canvas class="palette" id="paletteBox" :height="wHeight" :width="wWidth"></canvas>-->
            <canvas class="palette" id="palette" :height="wHeight" :width="wWidth"></canvas>
            <button class="save" @click="saved = true">确定</button>
        </div>
    </div>


</template>

<script>
    import PbgMax from '../../static/img/image-bg-max.png';
    import Pbg from '../../static/img/image-bg.png';

    export default {
        props: {

        },

        data() {
            return {
                // wWidth: 357,
                // wHeight: 575,
                wWidth: 0,
                wHeight: 0,
                ctx: null,

                imageUrl: "",

                lastPoint: null,

                headPosition: {
                    x: 0,
                    y: 0,
                    w: 0,
                    h: 0
                },

                me: null,
                bg: null,

                saved: false,
            }
        },

        created() {
        },

        mounted() {
            if (this.$isIphoneX()) {
                this.wWidth = 720;
                this.wHeight = 1280;

                this.headPosition = {
                    x: 0,
                    y: 250,
                    w: 0,
                    h: 0
                };
            }else {
                this.wWidth = 720;
                this.wHeight = 1166;

                this.headPosition = {
                    x: 0,
                    y: 250,
                    w: 0,
                    h: 0
                };
            }


            this.init(window.sessionStorage.getItem("IMAGE"));
        },

        methods: {
            async init(Pme) {
                const canvas = document.getElementById('palette');
                const ctx = canvas.getContext('2d');
                this.ctx = ctx;
                ctx.imageSmoothingQuality = "high";
                ctx.imageSmoothingEnabled = true;

                const me = await this.loadImage(Pme);
                const bg = await this.loadImage(this.$isIphoneX() ? PbgMax : Pbg);
                this.me = me;
                this.bg = bg;

                //画头像默认用宽度为标准
                const {x, y} = this.headPosition;
                const w = this.wWidth;
                let h = parseInt(w / me.width * me.height);

                ctx.drawImage(me, 0, 0, me.width, me.height, x, y, w, h);
                this.headPosition = {x,y,w,h};

                ctx.drawImage(bg, 0, 0, bg.width, bg.height, 0, 0, this.wWidth, this.wHeight);

                this.imageUrl = canvas.toDataURL('image/jpeg');
                this.touchControl(canvas, ctx);
            },

            loadImage(url) {
                return new Promise((resolve, reject) => {
                    const image = new Image();
                    image.onload = function () {
                        resolve(image);
                    };
                    image.src = url;
                });
            },

            touchControl(canvas, ctx) {
                canvas.addEventListener("touchstart", (e) => {
                    this.lastPoint = null;
                }, false);

                canvas.addEventListener("touchmove", (e) => {
                    e.preventDefault();

                    const me = this.me;
                    const bg = this.bg;
                    const ctx = this.ctx;

                    //判断是否是双指移动
                    if (e.touches.length === 1) {
                        const {x, y, w, h} = this.headPosition;
                        const {clientX, clientY} = e.touches[0];
                        //单指只移动头像位置
                        if (this.lastPoint) {
                            ctx.clearRect(0, 0, this.wWidth, this.wHeight);
                            const {px, py} = this.lastPoint;
                            //计算位移
                            ctx.drawImage(me, 0, 0, me.width, me.height, x + (clientX - px), y + (clientY - py), w, h);
                            this.headPosition = {
                                x: x + (clientX - px),
                                y: y + (clientY - py),
                                w,
                                h
                            }
                        }
                        this.lastPoint = {px: clientX, py: clientY};

                    } else if (e.touches.length === 2) {
                        const [{clientX: clientX1, clientY: clientY1}, {clientX: clientX2, clientY: clientY2}] = e.touches;

                        if (this.lastPoint) {
                            ctx.clearRect(0, 0, this.wWidth, this.wHeight);
                            const {px1, py1, px2, py2} = this.lastPoint;

                            //判断是横向放大还是纵向放大
                            let lastDx = Math.abs(px1 - px2);
                            let lastDy = Math.abs(py1 - py2);

                            let newDx = Math.abs(clientX1 - clientX2);
                            let newDy = Math.abs(clientY1 - clientY2);

                            let headPosition = this.headPosition;

                            //横向变化大于纵向变化
                            if (Math.abs(newDx - lastDx) > Math.abs(newDy - lastDy)) {
                                headPosition = this.scaleImage(newDx - lastDx, 0, headPosition);
                            } else {
                                headPosition = this.scaleImage(0, newDy - lastDy, headPosition);
                            }

                            const {x, y, w, h} = headPosition;
                            ctx.drawImage(me, 0, 0, me.width, me.height, x, y, w, h);
                            this.headPosition = headPosition;
                        }

                        this.lastPoint = {px1: clientX1, py1: clientY1, px2: clientX2, py2: clientY2};
                    }

                    ctx.drawImage(bg, 0, 0, bg.width, bg.height, 0, 0, this.wWidth, this.wHeight);
                    this.imageUrl = canvas.toDataURL('image/jpeg');
                }, false);

                canvas.addEventListener("touchend", (e) => {
                    this.lastPoint = null;
                }, false);
            },

            //等比缩放图片
            scaleImage(xScale, yScale, {x, y, w, h}) {
                if (xScale) {
                    //横向缩放 计算新的高度
                    h = (w + xScale) / w * h;
                    w = w + xScale;
                } else if (yScale) {
                    //纵向缩放，计算宽度
                    w = (h + yScale) / h * w;
                    h = h + yScale;
                }

                return {x, y, w, h};
            },
        },

        components: {}
    };
</script>
