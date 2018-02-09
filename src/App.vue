<style lang="scss">

</style>

<template>
    <div id="app">
        <ResourceLoading :res="res" @complete="complete" v-show="!loadComplete"/>
        <router-view v-show="loadComplete"></router-view>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                res: [
                    "http://img.guoanfamily.com/spring/pages/page_01.jpg",
                    "http://img.guoanfamily.com/spring/pages/page_02.jpg",
                    "http://img.guoanfamily.com/spring/pages/page_03.jpg",
                    "http://img.guoanfamily.com/spring/pages/page_04.jpg",
                    "http://img.guoanfamily.com/spring/pages/page_05.jpg",
                    "http://img.guoanfamily.com/spring/pages/page_06.jpg",
                    "http://img.guoanfamily.com/spring/pages/page_07.jpg",
                    "http://img.guoanfamily.com/spring/pages/page_08.jpg",
                    "http://img.guoanfamily.com/spring/pages/page_09.jpg",
                    "http://img.guoanfamily.com/spring/pages/page_10.jpg",
                    "http://img.guoanfamily.com/spring/pages/page_11.jpg",
                    "http://img.guoanfamily.com/spring/pages/page_12.jpg",
                    "http://img.guoanfamily.com/spring/pages/page_13.jpg",
                    "http://img.guoanfamily.com/spring/pages/page_14.jpg",
                    "http://img.guoanfamily.com/spring/pages/page_15.jpg",
                    "http://img.guoanfamily.com/spring/pages/page_16.jpg",
                    "http://img.guoanfamily.com/spring/pages/page_17.jpg",
                    this.$isMaxScreen() ?
                        'http://img.guoanfamily.com/spring/pages/image-bg-max.png'
                        : 'http://img.guoanfamily.com/spring/pages/image-bg.png'
                ],
                loadComplete: false,
            }
        },

        created() {
            if(window.location.href.includes("act.guoanfamily.com")){
                if(!sessionStorage.getItem("openid") || !sessionStorage.getItem("nickname") || !sessionStorage.getItem("headimgurl")){
                    let openid = this.getQueryString("openid");
                    if (openid) {
                        this.setStorage("openid", openid);
                        this.setStorage("nickname", this.getQueryString("nickname"));
                        this.setStorage("headimgurl", this.getQueryString("headimgurl"));
                    } else {
                        //跳转到微信授权链接
                        window.location.href = `http://act.guoanfamily.com/openweixin/user/getCode?redirect_url=${window.location.href}&scope=snsapi_base`;
                    }
                }
            }
        },

        mounted() {
            if(location.href.includes("&isappinstalled")){
                window.location.href = "http://act.guoanfamily.com/staticWeb/spring/"
            }
            this.$router.replace("/");

            if(this.getSession("IMAGE")){
                this.setSession("IMAGE");
                this.loadComplete = true
            }
        },

        methods: {
            getQueryString(name) {
                let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
                let r = window.location.search.substr(1).match(reg);
                if (r != null) return decodeURIComponent(r[2]);
                return null;
            },

            complete(){
                this.loadComplete = true;
            },
        },

        watch: {},

        components: {}
    }
</script>

