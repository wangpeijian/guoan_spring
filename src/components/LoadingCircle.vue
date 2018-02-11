<style scoped lang="scss">
    .mask {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .box {
            width: 30%;
            height: 0;
            padding-bottom: 30%;
            position: relative;

            .loading {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
            }
        }
    }
</style>

<template>
    <div class="mask">
        <div class="box">
            <canvas class="loading" :height="size" :width="size" id="loadingCanvas"></canvas>
        </div>
    </div>
</template>

<script>
    const stepLength = 0.01;

    export default {
        props: {
            res: {
                type: Array,
                default: [],
            },
        },

        data() {
            return {
                size: 200,

                ctx: null,
                total: 0,
                complete: 0,

                targetPercent: 0,  // 0 - 1
                nowPercent: 0,      // 0 - 1
            }
        },

        created() {

        },

        mounted() {
            this.total = this.res.length || 1;
            this.init();
            this.run();
            this.imageLoad();
        },

        methods: {
            init() {
                const canvas = document.getElementById('loadingCanvas');
                const ctx = canvas.getContext('2d');
                this.ctx = ctx;
                ctx.imageSmoothingQuality = "high";
                ctx.imageSmoothingEnabled = true;

                this.drawRing();
            },

            drawRing(percent = 0) {
                const size = this.size;
                const ctx = this.ctx;
                ctx.clearRect(0, 0, size, size);

                ctx.beginPath();
                ctx.strokeStyle = '#bababa';
                ctx.lineWidth = 20;
                ctx.arc(size / 2, size / 2, size / 2 - 20, 0, 2 * Math.PI);
                ctx.stroke();

                const lingrad = ctx.createLinearGradient(0, 0, 0, 150);
                lingrad.addColorStop(0, '#1eb1eb');
                lingrad.addColorStop(1, '#1eb1eb');

                ctx.beginPath();
                ctx.strokeStyle = lingrad;
                ctx.lineWidth = 20;
                ctx.lineCap = 'round';
                ctx.arc(size / 2, size / 2, size / 2 - 20, -0.5 * Math.PI, (-0.5 * Math.PI) + percent * (2 * Math.PI));

                ctx.shadowColor = "#97f9ff";
                ctx.shadowBlur = 20;
                ctx.stroke();

                //百分比
                ctx.font = "40px 黑体";
                ctx.fillStyle = '#1eb1eb';
                ctx.textBaseline = "middle";
                const percentText = `${(percent * 100).toFixed(0)}%`;
                const text = ctx.measureText(percentText);
                ctx.fillText(percentText, (size  - text.width) / 2, size / 2 );
            },

            run() {
                const step = () => {
                    if (this.res.length === 0) {
                        this.targetPercent = 1;
                    } else {
                        this.targetPercent = Number((this.complete / this.total).toFixed(2));
                    }

                    if (this.nowPercent >= 1) {
                        this.$emit("complete");
                        return;
                    }

                    if (this.nowPercent < this.targetPercent) {
                        this.nowPercent += stepLength;
                        this.drawRing(this.nowPercent);
                    }

                    window.requestAnimationFrame(step);
                };

                window.requestAnimationFrame(step);
            },

            imageLoad() {
                this.res.map(item => {
                    let img = document.createElement("img");
                    img.onload = ()=>{
                        this.complete++;
                    };
                    img.src = item;
                });

            }
        },

        watch: {},

        components: {}
    }
</script>


