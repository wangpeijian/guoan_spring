<style scoped lang="scss">

    .block {
        width: 100%;
        height: 0;
        padding-bottom: 75%;
        margin: 0 auto;
        position: relative;
        background-position: center;
        background-size: cover;

        .barrage {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }

    }

</style>

<template>
    <section>
        <div class="block" :style="{backgroundImage: `url(${barrageBG})`}">
            <canvas class="barrage" :width="width" :height="height" id="barrageCanvas"></canvas>
        </div>

        <input class="barrage-input" type="text" v-model="addText">
        <button class="submit" @click="submit" :disabled="!addText">提交一次</button>

    </section>
</template>

<script>
    import barrageBG from '../../static/img/barrageBG.jpg';

    const width = 400;
    const height = 300;
    const barrageSpeed = 3;  //弹幕速度
    const density = 10;      //弹幕密度 （每屏平均n条）
    const portraitSize = 50;
    const barrageColor = ["#65ff59", "#ff7a70", "#2476ff", "#ff52d0", "#ffd96b", "#5ee4ff", "#e92d36"];

    export default {
        data() {
            return {
                barrageBG: barrageBG,
                width: width,
                height: height,

                barrageArray: [],
                ctx: null,

                track: [],
                lastTrack: 0,
                addText: "",
            }
        },

        created() {

        },

        mounted() {
            this.createTrack();
            this.getData();
            this.init();
            this.run();
        },

        methods: {
            createTrack(){
                let lines = height / portraitSize;
                let begin = 25;
                const track = [begin];
                while (--lines > 0){
                    track.push(begin += portraitSize);
                }
                this.track = track;
            },

            getData() {
                const textArray = [{
                    text: "哈哈1111111111",
                    portrait: "../../static/img/head.png"
                },{
                    text: "hello",
                    portrait: "../../static/img/head.png"
                },{
                    text: "我爱陈乔恩",
                    portrait: "../../static/img/head.png"
                },{
                    text: "啦啦啦",
                    portrait: "../../static/img/head.png"
                }];
                textArray.map(item => {
                    this._getRandomPosition(item, res => {
                        this.barrageArray.push(res);
                    });
                });
            },

            /**
             * 获得随机位置
             * @param text
             * @param cb
             * @param offset 手动偏移量，默认为一屏
             * @private
             */
            _getRandomPosition({text, portrait}, cb) {
                const offset = parseInt(this.barrageArray.length / density);

                let lastTrack = parseInt(this.track.length * Math.random());
                while (lastTrack === this.lastTrack){
                    lastTrack = parseInt(this.track.length * Math.random());
                }
                this.lastTrack = lastTrack;

                //避免文字相互挤压，分轨道展示弹幕
                const resObj = {
                    text: text,
                    color: barrageColor[parseInt(Math.random() * barrageColor.length)],
                     x: parseInt((1 + offset + Math.random()) * width),
                    // y: parseInt(yRandom * height),
                    y: this.track[lastTrack]
                };

                if (portrait) {
                    let image = new Image();
                    image.onload = function () {

                        const canvas = document.createElement("canvas");
                        canvas.width = portraitSize;
                        canvas.height = portraitSize;
                        const ctx = canvas.getContext('2d');
                        ctx.arc(portraitSize/2, portraitSize/2, portraitSize/2, 0 , 2 * Math.PI);
                        ctx.clip();
                        ctx.drawImage(image, 0, 0, portraitSize, portraitSize);

                        cb(Object.assign(resObj, {
                             image: ctx.getImageData(0, 0, portraitSize, portraitSize),
                            // image: image,
                        }));
                    };
                    image.src = portrait;
                } else {
                    cb(resObj)
                }
            },

            init() {
                const canvas = document.getElementById('barrageCanvas');
                const ctx = canvas.getContext('2d');
                this.ctx = ctx;
                ctx.imageSmoothingQuality = "high";
                ctx.imageSmoothingEnabled = true;
                // ctx.globalCompositeOperation = "destination-over";
                ctx.globalCompositeOperation = "lighter";
            },

            run() {
                const ctx = this.ctx;
                const step = () => {
                    ctx.clearRect(0, 0, width, height);

                    this.barrageArray.map(item => {
                        item.x -= barrageSpeed;
                        let {x, y, text, image} = item;

                        //用户头像
                        if(image){
                            ctx.beginPath();
                            ctx.putImageData(image, x - portraitSize - 10, y - portraitSize/2);
                            // ctx.drawImage(image, x - portraitSize - 10, y - 33, portraitSize, portraitSize);
                        }

                        //弹幕文字
                        ctx.beginPath();
                        ctx.font = "25px 黑体";
                        ctx.fillStyle = item.color;
                        ctx.textBaseline = "middle";
                        ctx.fillText(text, x, y);
                        //判断是否超出屏幕，超出则重新计算出生位置
                        const textWidth = ctx.measureText(text).width;

                        //文字背景
                        ctx.beginPath();
                        ctx.moveTo(x - 30, y);
                        ctx.lineCap = "round";
                        ctx.lineWidth = 35;
                        ctx.strokeStyle = "rgba(0, 0, 0, 0)";
                        ctx.lineTo(x + textWidth, y);
                        ctx.stroke();

                        if (x < -textWidth) {
                            this._getRandomPosition({}, ({x, y, color}) => {
                                item.color = color;
                                item.x = x;
                                item.y = y;
                            });
                        }
                    });

                    window.requestAnimationFrame(step);
                };
                window.requestAnimationFrame(step);
            },

            _pushText(text) {
                this._getRandomPosition({text}, res => {
                    this.barrageArray.push(res);
                });

            },

            submit() {
                const text = this.addText;
                this.addText = "";
                this._pushText(text);
            }
        },

        watch: {},

        components: {}
    }
</script>
