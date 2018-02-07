<style scoped lang="scss">

</style>

<template>
    <div>
       <!-- <ResourceLoading :res="res" @complete="complete" v-if="!loadComplete"/>-->

        <div class="main" v-if="loadComplete">

           <!-- <Barrage/>-->


            <div> <TextCarousel :start="0" :end="90.02" :duration="4" decimals="2" /></div>
            <br>
            <TextCarousel :start="0" :end="10" :during="4" decimals="0" />
            <br>
        </div>

    </div>
</template>

<script>
    const res = [
        "http://img.guoanfamily.com/20180202121908_卧室A1.jpg",
        "http://img.guoanfamily.com/20180129211355_卧室A1.jpg",
        "http://img.guoanfamily.com/20180124211410_卧室A2.jpg",
        "http://img.guoanfamily.com/20180124210023_卧室C2.jpg",
        "http://img.guoanfamily.com/20180124205417_卧室A1.jpg",
        "http://img.guoanfamily.com/20180124205407_卧室B1.jpg",
        "http://img.guoanfamily.com/20180124204535_af270c47f24f2aea988393604bada802_.jpg",
    ];

    export default {
        data() {
            return {
                res: res,
                loadComplete: true
            }
        },

        created() {

        },

        mounted() {

        },

        methods: {
            complete(){
                this.loadComplete = true;
            }
        },

        watch: {

        },

        components: {}
    }
</script>
