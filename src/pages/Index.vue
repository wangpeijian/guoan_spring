<style scoped lang="scss">
    .main{
        transform: translate3d(0,0,0);
    }

    .page{
        display: block;
        width: 100%;
    }

    .box{
        position: relative;

        .choose-image{
            position: absolute;
            top: 0;
            width: 100%;
            left: 0;
            height: 100%;
            opacity: 0;
        }
    }

</style>

<template>
    <div>
        <div class="main">

            <img class="page" v-for="(item, index) in res" :key="item" :src="item" alt="" v-if="index <= 13">

            <img class="page" :src="res[14]" alt="">

            <div class="box">
                <img class="page" :src="res[15]">
                <input class="choose-image" type="file" id="file" @change="chooseImage">
            </div>


            <!--<Barrage/>-->
            <!--<Comment />-->
        </div>
    </div>
</template>

<script>

    export default {
        data() {
            const res = [
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
            ];

            return {
                res: res,
            }
        },

        created() {

        },

        mounted() {
           this.wxconfig();
           if(this.getSession("IMAGE")){
               window.location.reload();
           }
        },

        methods: {
            wxconfig() {
                const URL = window.location.href;
                this.post("jsapi/getJsapiSignature?local_url=" + URL,
                    {}, {
                        interfaceType: "weichat"
                    }).then(response => {
                    wx.config({
                        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                        appId: response.appid, // 必填，公众号的唯一标识
                        timestamp: parseInt(response.timestamp), // 必填，生成签名的时间戳
                        nonceStr: response.noncestr, // 必填，生成签名的随机串
                        signature: response.signature, // 必填，签名，见附录1
                        jsApiList: [
                            'onMenuShareTimeline',
                            'onMenuShareAppMessage',
                            'onMenuShareQQ',
                            'onMenuShareWeibo',
                            'onMenuShareQZone',
                        ]// 必填，需要使用的JS接口列表
                    });
                    wx.ready(() => {
                        // 分享给朋友
                        wx.onMenuShareAppMessage({
                            title: "迎元旦 贴窗花", //标题
                            desc: "新年伊始是元旦，万象更新又一年，国安科技控股真诚答谢活动，欢迎您的参与。", //描述
                            link: "http://act.guoanfamily.com/staticWeb/spring/#/",
                            imgUrl: "https://img.guoanfamily.com/www/newyearShare.jpg", //图片
                            trigger: (res) => {
                            },
                            success: (res) => {

                            },
                            cancel: (res) => {
                            },
                            fail: (res) => {
                            }
                        });
                        // 分享到朋友圈
                        wx.onMenuShareTimeline({
                            title: "迎元旦 贴窗花", //标题
                            desc: "新年伊始是元旦，万象更新又一年，国安科技控股真诚答谢活动，欢迎您的参与。", //描述
                            link: "http://act.guoanfamily.com/staticWeb/spring/#/",
                            imgUrl: "https://img.guoanfamily.com/www/newyearShare.jpg", //图片
                            trigger: (res) => {
                            },
                            success: (res) => {

                            },
                            cancel: (res) => {
                            },
                            fail: (res) => {
                            }
                        });

                        wx.error(function (res) {
                            console.error(res)
                        });
                    })
                });
            },

            chooseImage(e) {
                const fs = new FileReader();
                const file = e.target.files[0];
                const fileName = file.name.toLowerCase();
                if (!fileName.includes("png") && !fileName.includes("jpg")) {
                    alert("请选择图片");
                    return;
                }

                async function load() {
                    let base64 = fs.result;

                    //旋转图片
                    base64 = await this.formatImg(file);

                    //压缩图片
                    if (file.size / (1024 * 1024) > 2) {
                        base64 = await this.compressImage(base64);
                    }

                    this.setSession("IMAGE", base64);
                    this.$router.push(`/save`);
                }

                fs.onload = load.bind(this);
                fs.readAsDataURL(file);
            },

            compressImage(base64) {
                return new Promise(resolve => {
                    //调整图片大小
                    const image = new Image();
                    image.onload = e => {
                        const ow = image.width;
                        const oh = image.height;
                        const nw = 720;
                        const nh = parseInt(nw / ow * oh);

                        const canvas = document.createElement("canvas");
                        canvas.width = nw;
                        canvas.height = nh;
                        const ctx = canvas.getContext("2d");
                        ctx.drawImage(image, 0, 0, ow, oh, 0, 0, nw, nh);

                        resolve(canvas.toDataURL('image/jpeg'));

                    };
                    image.src = base64;
                });
            },

            //调整图片位置
            formatImg(file) {
                let Orientation;

                EXIF.getData(file, function() {
                    EXIF.getAllTags(this);
                    Orientation = EXIF.getTag(this, 'Orientation');
                });

                const rotateImg = this.rotateImg;

                return new Promise(resolve => {

                    let oReader = new FileReader();
                    oReader.onload = function(e) {
                        //let blob = URL.createObjectURL(file);
                        //_compress(blob, file, basePath);
                        let image = new Image();
                        image.src = e.target.result;
                        image.onload = function() {
                            let expectWidth = this.naturalWidth;
                            let expectHeight = this.naturalHeight;

                            if (this.naturalWidth > this.naturalHeight && this.naturalWidth > 800) {
                                expectWidth = 800;
                                expectHeight = expectWidth * this.naturalHeight / this.naturalWidth;
                            } else if (this.naturalHeight > this.naturalWidth && this.naturalHeight > 1200) {
                                expectHeight = 1200;
                                expectWidth = expectHeight * this.naturalWidth / this.naturalHeight;
                            }
                            let canvas = document.createElement("canvas");
                            let ctx = canvas.getContext("2d");
                            canvas.width = expectWidth;
                            canvas.height = expectHeight;
                            ctx.drawImage(this, 0, 0, expectWidth, expectHeight);
                            let base64 = null;
                            //修复ios
                            if (navigator.userAgent.match(/iphone/i)) {
                                console.log('iphone');
                                //如果方向角不为1，都需要进行旋转 added by lzk
                                if(Orientation !== "" && Orientation !== 1){
                                    switch(Orientation){
                                        case 6://需要顺时针（向左）90度旋转
                                            // alert('需要顺时针（向左）90度旋转');
                                            rotateImg(this,'left',canvas);
                                            break;
                                        case 8://需要逆时针（向右）90度旋转
                                            // alert('需要顺时针（向右）90度旋转');
                                            rotateImg(this,'right',canvas);
                                            break;
                                        case 3://需要180度旋转
                                            // alert('需要180度旋转');
                                            rotateImg(this,'right',canvas);//转两次
                                            rotateImg(this,'right',canvas);
                                            break;
                                    }
                                }

                                base64 = canvas.toDataURL("image/jpeg", 0.8);
                            }else if (navigator.userAgent.match(/Android/i)) {// 修复android
                                let encoder = new JPEGEncoder();
                                base64 = encoder.encode(ctx.getImageData(0, 0, expectWidth, expectHeight), 80);
                            }else{
                                if(Orientation !== "" && Orientation !== 1){
                                    switch(Orientation){
                                        case 6://需要顺时针（向左）90度旋转
                                            // alert('需要顺时针（向左）90度旋转');
                                            rotateImg(this,'left',canvas);
                                            break;
                                        case 8://需要逆时针（向右）90度旋转
                                            // alert('需要顺时针（向右）90度旋转');
                                            rotateImg(this,'right',canvas);
                                            break;
                                        case 3://需要180度旋转
                                            // alert('需要180度旋转');
                                            rotateImg(this,'right',canvas);//转两次
                                            rotateImg(this,'right',canvas);
                                            break;
                                    }
                                }

                                base64 = canvas.toDataURL("image/jpeg", 0.8);
                            }

                            resolve(base64);
                        };
                    };
                    oReader.readAsDataURL(file);

                });
            },

            rotateImg(img, direction,canvas) {
                //最小与最大旋转方向，图片旋转4次后回到原方向
                let min_step = 0;
                let max_step = 3;
                //let img = document.getElementById(pid);
                if (img == null)return;
                //img的高度和宽度不能在img元素隐藏后获取，否则会出错
                let height = img.height;
                let width = img.width;
                //let step = img.getAttribute('step');
                let step = 2;
                if (step == null) {
                    step = min_step;
                }
                if (direction === 'right') {
                    step++;
                    //旋转到原位置，即超过最大值
                    step > max_step && (step = min_step);
                } else {
                    step--;
                    step < min_step && (step = max_step);
                }
                //旋转角度以弧度值为参数
                let degree = step * 90 * Math.PI / 180;
                let ctx = canvas.getContext('2d');
                switch (step) {
                    case 0:
                        canvas.width = width;
                        canvas.height = height;
                        ctx.drawImage(img, 0, 0);
                        break;
                    case 1:
                        canvas.width = height;
                        canvas.height = width;
                        ctx.rotate(degree);
                        ctx.drawImage(img, 0, -height);
                        break;
                    case 2:
                        canvas.width = width;
                        canvas.height = height;
                        ctx.rotate(degree);
                        ctx.drawImage(img, -width, -height);
                        break;
                    case 3:
                        canvas.width = height;
                        canvas.height = width;
                        ctx.rotate(degree);
                        ctx.drawImage(img, -width, 0);
                        break;
                }
            },
        },
        watch: {

        },

        components: {}
    }
</script>
