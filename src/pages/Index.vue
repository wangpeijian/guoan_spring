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

            .choose-image{
                position: absolute;
                top: 0;
                width: 100%;
                left: 0;
                height: 100%;
                opacity: 0;
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
                height: 2.5rem;
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
                    }

                    .comment-info{
                        padding: 0 0 0 .9rem;

                        .praise{
                            position: absolute;
                            right: 0;
                            top: 0;
                            display: inline-block;
                            height: .3rem;
                            width: .3rem;
                            background: url("../../static/img/praise.png") no-repeat center;
                            background-size: contain;

                            &.active{
                                background: url("../../static/img/praise-active.png") no-repeat center;
                                background-size: contain;
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

            <img class="page" v-for="(item, index) in res" :key="item" :src="item" alt="" v-if="index <= 13">

            <Barrage :barrageList="barrageList" :comment="commentData" v-if="barrageList.length !== 0"/>

          <!--  <img class="page" :src="res[14]" alt="">-->

            <div class="box">
                <img class="page" :src="res[15]">
                <input class="choose-image" type="file" id="file" @change="chooseImage">
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
                            <span class="praise" :class="item.praised ? 'active' : ''" @click="praiseComment(index)" v-if="item.praised !== undefined"></span>
                            <p class="name">{{item.name}}</p>
                            <pre class="comment-text">{{item.text}}</pre>
                            <p class="comment-time">1分钟前</p>
                        </div>
                    </li>
                </ul>
            </section>
        </div>
    </div>
</template>

<script>
    const stableComment = [
        {
            name: "刘鑫",
            text: "智者见于未萌。5年来，公司全体同路人不忘初心，一路同行，确立了生态引领区域发展的“1+2+4+8”的新战略格局，以生态引领城市可持续发展的EOD模式为引领，布局生态城市、特色小镇、创新地产、城市运营四大业务群，努力打造“最具价值的生态城市综合运营商”。未来，我们将以无所畏惧、追求极致的态度，全新起航，开创生态文明建设的城市运营新风尚，续写引领人民美好生活的新篇章！",
        },
        {
            name: "刘春",
            text: "2018年是国安科技控股战略执行的开局之年，是展望新时代的一年，望公司全体同事在国安科技控股的坚强领导下，不忘初心、砥砺前行、同路同行、努力拼搏，在新的征程上取得更好的成绩。新的一年充满希望，我们每一个人要多一份责任、多一份坚守，感恩国安、感恩身边的每一位同仁，凝心聚力、共筑梦想，坚信国安科技控股的明天会更好。祝国安科技控股全体同事新年快乐！"
        },
        {
            name: "江涛",
            text: "我们辞别充满挑战、奋发有为的2017年，喜迎充满希望、开拓进取的2018年。值此辞旧迎新之际，我谨代表峨眉公司，向为公司发展做出贡献的全体员工致以最诚挚的问候和最衷心的祝福!"
        },
        {
            name: "吴智雄",
            text: "一个人走得快，一群人走得远，为了那远方的梦想，让我们携手，一路同行。"
        },
        {
            name: "杨川",
            text: "个人之力如星点，集体之火可燎原。2018年愿你我同心同向，同路同行！共创共享，砥砺奋进！不忘初心，在“中国领先的生态城市运营商”的大道上撸起袖子加油干！"
        },
        {
            name: "杨小航",
            text: "过去的一年，是艰苦创业、努力拼搏的一年。国安科技控股大家庭全体员工同心同行、共同奋进，取得了一定成绩。展望2018年，让我们不忘初心、牢记使命、聚力前行！"
        },
        {
            name: "杜科",
            text: "过去的一年，是艰苦创业的一年，是努力拼搏的一年，也是公司值得骄傲的一年。广大员工，沿着公司发展的方向，兢兢业业，努力拼搏，爱岗敬业，朝着共同的目标一同奋进，取得了巨大的成绩。“雄关漫漫真如铁，而今迈步从头越”面对2018年的机遇和挑战，我们将一如既往、信心倍增，激情满怀。"
        },
        {
            name: "姜玉明",
            text: "同路相伴，心系国安，永争第一，众志成城。辞旧迎新之际，让我们用激情点燃梦想，用努力铸就辉煌，用最饱满的热情迎接2018！"
        },
        {
            name: "侯露",
            text: "五载芳华，我们同心同向，戮力前行谱写华章。新征程，让我们不忘初心，追求卓越，携手共筑基业长青，最具价值的城市运营商，再创国安科技控股新辉煌！"
        },
        {
            name: "张建军",
            text: "新思想引领新征程， 2018，让我们共同携手，为生活更美好而奋斗！"
        },
        {
            name: "殷程旭",
            text: "天道酬勤，时不我待。新年的曙光，已照亮前路，让我们不蹉跎岁月，勿空谈妄语，携手奋进，只争朝夕启新程。"
        },
        {
            name: "党艳梅",
            text: "岁月不居，五载风雨战略重塑谱新篇；继往开来，厚积薄发城市发展焕新颜。以此献礼国安城市五周年生日。"
        },
        {
            name: "范睿",
            text: "伟大是坚持出来的！"
        },
        {
            name: "王永峰",
            text: "祝愿国安城市，能够作为满足客户尊重与自我实现的城市运营商，永远比时代提前一小步。"
        },
        {
            name: "刘灯",
            text: "不忘初心，砥砺前行！让我们携手，投身这样一个恢弘时代，开启国安城市新篇章！"
        },
        {
            name: "杨永锋",
            text: "2017年已悄然过去，2018年已经开启。站在新的历史起点上，机遇与挑战并存，希望与责任同在。让我们发扬国安永远争第一精神，为国安城市再创辉煌！"
        },
        {
            name: "李珂",
            text: "五年风雨兼程路；几载耕耘易春秋；一路同行的国安城市人；必将共同迎来广阔而美好的伟大前程！"
        },
        {
            name: "张丽文",
            text: "愿与公司共同携手，相扶相持，不离不弃，共同开创国安城市更加美好的未来！"
        },
        {
            name: "赵钺",
            text: "用真诚品味生活，用真情品味朋友，用真心品味工作。国安城市同路人，让我们不忘初心、砥砺前行、再创佳绩！"
        },
        {
            name: "宋波",
            text: "国安城市5年，一路走来我们同心同向，同路同行！新的一年，让我们不忘初心，在追求卓越的道路上砥砺前行。国安永远争第一！"
        },
        {
            name: "崔幼玲",
            text: "回顾2017艰辛而有为，展望2018行稳以致远。新征程已然出发，我们会以更加稳健自信的姿态，不忘初心砥砺前行！"
        },
        {
            name: "陈凯",
            text: "2018年我们会以更加稳健自信姿态，奋力有为，行稳致远！让我们携手并肩，在新的起点上砥砺奋进，共创国安城市美好明天！"
        },
        {
            name: "冯启源",
            text: "五年的艰苦奋斗，铸就了今天的辉煌成绩，这就是国安精神的最佳体现！国安城市公司的明天一定会更加美好！"
        },
    ].map(item =>{
        item.praised = true;
        item.portrait = "../../static/img/head.png";
        return item;
    });

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
                commentList: stableComment,

                comment: "",
                barrageList: [{
                    text: ""
                }],

                commentData: null,
            }
        },

        created() {

        },

        mounted() {
            if(window.location.href.includes("act.guoanfamily.com")){
                this.wxconfig();
            }

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
                this.commentList[i].praised = !this.commentList[i].praised;
            },

            submit(){
                const openid = sessionStorage.getItem("openid");
                const nickname = sessionStorage.getItem("nickname");
                const headimgurl = sessionStorage.getItem("headimgurl");

                this.commentList.push({
                    name: nickname,
                    portrait: headimgurl,
                    text: this.comment,
                });

                this.commentData = {
                    portrait: headimgurl,
                    text: this.comment,
                };

                this.comment = "";
            },
        },
        watch: {

        },

        components: {}
    }
</script>
