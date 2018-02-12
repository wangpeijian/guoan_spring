<style scoped lang="scss">
    .main{
        transform: translate3d(0,0,0);
        font-size: .2rem;

        .page{
            display: block;
            width: 100%;
        }

        .box{
            position: relative;

            .gif{
                position: absolute;
                top: 13%;
                width: 92.5%;
                left: 3.75%;
            }

            .choose-image{
                position: absolute;
                top: 0;
                width: 100%;
                left: 0;
                height: 100%;
                opacity: 0;
            }

            .point-tip{
                position: absolute;
                bottom: .2rem;
                width: .5rem;
                height: .5rem;
                background: url("../../static/img/point.png") no-repeat center;
                background-size: contain;
                left: 50%;
                transform: translate(-50%, -50%);
                animation: point-move .5s infinite alternate;

                @keyframes point-move {
                    from {
                        transform: translate(-50%, 0);
                    }
                    to{
                        transform: translate(-50%, -50%);
                    }
                }
            }
        }

        .comment-block{
            width: 92%;
            margin: 0 auto;
            display: block;
            background-image: url("../../static/img/material-page.jpg");
            background-size: 10px;
            padding: 0 4%;

            .tips{
                text-align: right;
                color: #326784;
                padding-bottom: .1rem;

                &::after{
                    content: "";
                    display: inline-block;
                    height: .24rem;
                    width: .24rem;
                    background: url("../../static/img/pen.png") no-repeat center;
                    background-size: contain;
                    padding-left: .15rem;
                    vertical-align: middle;
                }
            }

            .comment-input{
                width: 100%;
                padding: .1rem;
                border-radius: .1rem;
                border: 1px solid #ddd;
                height: 1.5rem;
                resize: none;
                color: #333;
            }

            .submit-btn{
                margin-top: .1rem;
                width: 100%;
                background: rgb(0, 174, 39);
                border: 0;
                line-height: .8rem;
                font-size: .4rem;
                color: #fff;
                border-radius: .1rem;

                &[disabled]{
                    background: rgb(172, 172, 172);
                }
            }

            .comment-list{
                padding: 1rem 0;

                .item{
                    position: relative;
                    margin: 0 0 .5rem 0;

                    .header{
                        width: .7rem;
                        height: .7rem;
                        position: absolute;
                        left: 0;
                        top: 0;
                        border-radius: 50%;
                    }

                    .comment-info{
                        padding: 0 0 0 .9rem;

                        .praise-box{
                            position: absolute;
                            right: 0;
                            top: 0;

                            .praise{
                                display: inline-block;
                                height: .3rem;
                                width: .3rem;
                                background: url("../../static/img/praise.png") no-repeat center;
                                background-size: contain;
                                vertical-align: middle;

                                &.active{
                                    background: url("../../static/img/praise-active.png") no-repeat center;
                                    background-size: contain;
                                }
                            }

                            .praise-num{
                                line-height: .3rem;
                                color: #326784;
                                vertical-align: middle;
                                display: inline-block;
                                position: relative;
                                top: .03rem;
                            }
                        }


                        .name{
                            color: #555;
                            padding-bottom: .15rem;
                        }

                        .comment-text{
                            padding-bottom: .15rem;
                            white-space: normal;
                            word-break: break-word;
                        }

                        .comment-time{
                            color: #999;
                            font-size: .1rem;
                        }
                    }
                }
            }
        }
    }

</style>

<template>
    <div>
        <div class="main">

            <img class="page" v-for="(item, index) in res" :key="item" :src="item" alt="" v-if="index <= 11">

            <div class="box">
                <img class="page" :src="res[12]" alt="">
                <img class="gif" src="http://img.guoanfamily.com/spring/pages/page-gif.gif" alt="">
            </div>


            <img class="page" :src="res[13]" alt="">

            <Barrage :barrageList="barrageList" :comment="commentData" v-if="barrageList.length !== 0"/>

          <!--  <img class="page" :src="res[14]" alt="">-->

            <div class="box">
                <img class="page" :src="res[15]">
                <input class="choose-image" type="file" id="file" @change="chooseImage">
                <span class="point-tip"></span>
            </div>

            <img class="page" :src="res[16]" alt="">

            <section class="comment-block">
                <p class="tips">写留言</p>
                <textarea class="comment-input" maxlength="100" placeholder="留言将由公众号筛选后显示，对所有人可见。" v-model="comment"></textarea>
                <button class="submit-btn" :disabled="comment.length < 3" @click="submit">提交</button>

                <ul class="comment-list">
                    <li class="item" v-for="(item, index) in commentList" :key="index">
                        <img class="header" :src="item.portrait" alt="" v-if="item.portrait">
                        <div class="comment-info">
                            <span class="praise-box" @click="praiseComment(index)" v-if="item.praised !== undefined">
                                 <span class="praise" :class="item.praised ? 'active' : ''" ></span>
                                <span class="praise-num">{{item.like}}</span>
                            </span>

                            <p class="name">{{item.name}}</p>
                            <pre class="comment-text">{{item.text}}</pre>
                            <p class="comment-time">{{item.time}}</p>
                        </div>
                    </li>
                </ul>
            </section>
        </div>
    </div>
</template>

<script>
   import headImage from '../../static/img/head.png';

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
                "http://img.guoanfamily.com/spring/pages/page_17.jpg",
            ];

            return {
                res: res,
                commentList: [],

                comment: "",
                barrageList: [{
                    text: ""
                }],

                commentData: null,
            }
        },

        created() {
            this.get("queryac").then(res => {
                const likeList = localStorage.getItem("likeList") || "";

                this.commentList = res.map(item => {
                    if(!(item.portrait = item.Headurlimg)){
                        item.portrait = headImage;
                    }
                    item.praised = likeList.includes(item.Id);
                    item.text = item.Usercomment;
                    item.time = new Date(item.Createtime).Format("yyyy-MM-dd hh:mm:ss");
                    item.name = item.Nickname;
                    item.like = item.Likenumber;
                    return item;
                });


                this.barrageList = this.commentList.filter((item, index) => {
                    return index > 22;
                });
            })
        },

        mounted() {
            if(window.location.href.includes("www.guoanfamily.com")){
                this.wxconfig();
            }

           if(sessionStorage.getItem("IMAGE")){
              sessionStorage.setItem("IMAGE", "");
               // window.location.href = "https://www.guoanfamily.com/staticWeb/spring/#/";
           }
        },

        methods: {
            wxconfig() {
                const URL = window.location.href;
                const title = "国安城市5周年庆";
                const desc = "逐梦新时代，同行新征程2018";
                const link = "https://www.guoanfamily.com/staticWeb/spring/#/";
                const imgUrl = "http://img.guoanfamily.com/spring/pages/page_01.jpgc";


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
                            title: title, //标题
                            desc: desc, //描述
                            link: link,
                            imgUrl: imgUrl, //图片
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
                            title: title, //标题
                            desc: desc, //描述
                            link: link,
                            imgUrl: imgUrl, //图片
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
                if (!fileName.includes("png") && !fileName.includes("jpg") && !fileName.includes("jpeg")) {
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
                    this.$router.replace(`/save`);
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
                            resolve(canvas.toDataURL("image/jpeg", 0.8));
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

            praiseComment(i){
                const likeList = localStorage.getItem('likeList') || "";
                const item = this.commentList[i];
                if(!likeList.includes(item.Id) && !item.praised){
                    this.get(`updateal?id=${item.Id}`);
                    item.praised = !item.praised;
                    item.like++;

                    localStorage.setItem('likeList', likeList + "," + item.Id);
                }
            },

            submit(){
                const openid = localStorage.getItem("openid");
                const nickname = localStorage.getItem("nickname");
                const headimgurl = `${localStorage.getItem("headimgurl")}?imageView2/0/w/100/h/100`;
                const comment = this.comment;

                this.commentList.push({
                    name: nickname,
                    portrait: headimgurl,
                    text: comment,
                    time: new Date().Format("yyyy-MM-dd hh:mm:ss")
                });

                this.commentData = {
                    portrait: headimgurl,
                    text: comment,
                };

                this.comment = "";

                this.post('insertac', {
                    "headurlimg": headimgurl,
                    "nickname": nickname,
                    "uid": openid,
                    "usercomment": comment
                })
            },
        },
        watch: {

        },

        components: {}
    }
</script>
