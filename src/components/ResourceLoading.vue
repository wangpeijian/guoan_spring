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
        background: #ffffff;

        .box {
            width: 150px;
            height: 50px;
            position: relative;

           .loading-icon{
               background: url("../../static/img/loading-icon.png") center no-repeat;
               background-size: contain;
               width: 75px;
               height: 57px;
               display: inline-block;
               position: absolute;
               top: -45px;
               right: 20px;
               z-index: 2;
               animation: icon-move 2s ease-in-out infinite;

               @keyframes icon-move {
                   0%{
                       transform: translate(5px, 0);
                   }

                   25%{
                       transform: translate(0, 5px);
                   }

                   50%{
                       transform: translate(-5px, 0);
                   }

                   75%{
                       transform: translate(0, -5px);
                   }

                   100%{
                       transform: translate(5px, 0);
                   }
               }
           }

            .loading-bg{
                background: url("../../static/img/loading-bg.png") center no-repeat;
                background-size: contain;
                width: 150px;
                height: 50px;
                display: inline-block;
                position: absolute;
                bottom: 0;

                &::after{
                    content: 'Loading';
                    font-size: .25rem;
                    background: #fff;
                    position: absolute;
                    bottom: 0;
                    width: 100%;
                    left: 0;
                    color: #333;
                    display: inline-block;
                    text-align: center;
                }

                .progress-box{
                    position: absolute;
                    top: 8px;
                    left: 24px;
                    height: 20px;
                    right: 24px;

                    .progress{
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 0;
                        height: 20px;
                        background: rgb(222, 30, 43);
                        transition: .3s;
                    }
                }
            }
        }
    }
</style>

<template>
    <div class="mask">
        <div class="box">
            <span class="loading-icon"></span>
            <div class="loading-bg">
                <div class="progress-box">
                    <div class="progress" :style="{width:  progress}" v-if="total !== 0"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

    export default {
        props: {
            res: {
                type: Array,
                default: [],
            },
        },

        data() {
            return {
                ctx: null,
                total: 0,
                complete: 0,

                progress: 0,
            }
        },

        created() {
            this.total = this.res.length || 1;
        },

        mounted() {
            this.init();
            this.imageLoad();
        },

        methods: {
            init() {

            },

            imageLoad() {
                this.res.map(item => {
                    let img = document.createElement("img");
                    img.onload = ()=>{
                        this.complete++;
                        if (this.complete >= this.total) {
                            setTimeout(() => {
                                this.$emit("complete")
                            }, 500);
                        }
                    };
                    img.src = item;
                });

            }
        },

        watch: {
            complete(){
                this.progress = `${Number((this.complete / this.total).toFixed(2)) * 100}%`;
            }
        },

        components: {}
    }
</script>


