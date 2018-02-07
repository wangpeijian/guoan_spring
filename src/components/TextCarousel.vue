<style scoped lang="scss">
    .number{

    }
</style>

<template>
    <span class="number">{{number}}</span>
</template>

<script>
    export default {
        props:{
            start: {
                type: Number,
                default: 0
            },

            end: {
                type: Number,
                default: 100
            },

            duration: {
                type: Number,
                default: 3000
            },

            decimals: {
                type: Number,
                default: 3000
            }
        },

        data() {
            return {
                number: 0,

                loopTime: 300,
                step: 1,
            }
        },

        created() {

        },

        mounted() {
            this.number = this.start;
            this.run();
        },

        methods: {
            run(){

                //计算时间间隔

            }
        },

        components: {}
    }
</script>
