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

        .save, .re-choose{
            position: fixed;
            bottom: .9rem;
            width: 20%;
            left: 55%;
            height: .8rem;
            z-index: 3;
            background: #df262f;
            border-radius: .4rem;
            border: none;
            color: #fff;
            font-size: .35rem;
        }

        .re-choose{
            left: 25%;
            text-align: center;
            line-height: .8rem;

            .choose-image{
                position: absolute;
                top: 0;
                width: 100%;
                left: 0;
                height: 100%;
                opacity: 0;
            }
        }

        .toast{
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: -10;
            background: rgba(0, 0, 0, 0.5);
            border-radius: .4rem;
            border: none;
            color: #fff;
            font-size: .3rem;
            animation: fade 5s forwards;
            text-align: center;
            padding: .2rem .3rem;

            @keyframes fade {
                0%{
                    opacity: 1;
                    z-index: 4;
                }

                99%{
                    opacity: 1;
                    z-index: 4;
                }

                100%{
                    opacity: 0;
                    z-index: -1;
                }
            }
        }

        .palette {
            width: 100%;
            position: absolute;

            &.palette-box{
                z-index: 2;
            }
        }
    }
</style>

<template>
    <div class="block">
        <img class="picture" :src="imageUrl" alt="" id="picture" v-if="saved">
        <div class="toast" v-if="saved">长按保存图片分享</div>

        <div class="toast">请拖放图片到合适位置</div>

        <div v-show="!saved">
            <canvas class="palette" id="palette" :height="wHeight" :width="wWidth"></canvas>
            <canvas class="palette palette-box" id="paletteBox" :height="wHeight" :width="wWidth"></canvas>

            <div class="re-choose">
                重选
                <input class="choose-image" type="file" id="file" @change="chooseImage">
            </div>

            <button class="save" @click="saveImage">确定</button>
        </div>
    </div>


</template>

<script>
    import PbgMax from '../../static/img/image-bg-max.png';
    import Pbg from '../../static/img/image-bg.png';

    const message = [
        {
            msg: ['加薪不加班'],
        },{
            msg: ['随时能脱单']
        },{
            msg: ['平地起惊雷', '又比去年肥']
        },{
            msg: ['得鸿运 利仕途', '能旺夫']
        },{
            msg: ['情之起一往深而至挚']
        },{
            msg: ['保持现状', '瘦不下去']
        },{
            msg: ['一夜暴富', '富到流油']
        },{
            msg: ['涨工资', '不吃土']
        },{
            msg: ['比翼鸟连理枝喜相逢']
        },{
            msg: ['没办法', '只能靠脸吃饭']
        },{
            msg: ['买买买', '最不缺的就是钱！']
        },{
            msg: ['每天加班', '为公司奉献！']
        },{
            msg: ['努力就会有回报', '期望的都会实现']
        },{
            msg: ['人见人爱', '花见花开']
        },{
            msg: ['升职加薪', '丰厚年终奖']
        },{
            msg: ['吃得苦中苦', '照样普通人']
        },{
            msg: ['年假不让休']
        }
    ];

    export default {
        props: {

        },

        data() {
            return {
                wWidth: 0,
                wHeight: 0,
                ctx: null,
                ctxBox: null,

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
            if (this.$isMaxScreen()) {
                // this.wWidth = 720;
                // this.wHeight = 1280;
                this.wWidth = 720 * 2;
                this.wHeight = 1280 * 2;

                this.headPosition = {
                    x: 0,
                    y: 250,
                    w: 0,
                    h: 0
                };
            }else {
                // this.wWidth = 720;
                // this.wHeight = 1166;
                this.wWidth = 720 * 2;
                this.wHeight = 1166 * 2;

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
                    this.init(window.sessionStorage.getItem("IMAGE"));
                    // this.$router.replace(`/save`);
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

            async init(Pme) {
                const canvasBox = document.getElementById('paletteBox');
                const ctxBox = canvasBox.getContext('2d');
                this.ctxBox = ctxBox;
                ctxBox.imageSmoothingQuality = "high";
                ctxBox.imageSmoothingEnabled = true;

                const canvas = document.getElementById('palette');
                const ctx = canvas.getContext('2d');
                this.ctx = ctx;
                ctx.imageSmoothingQuality = "high";
                ctx.imageSmoothingEnabled = true;
                ctx.clearRect(0, 0, this.wWidth, this.wHeight);

                const me = await this.loadImage(Pme);
                const bg = await this.loadImage(this.$isMaxScreen() ? PbgMax : Pbg);
                this.me = me;
                this.bg = bg;

                //画头像默认用宽度为标准
                const {x, y} = this.headPosition;
                const w = this.wWidth;
                let h = parseInt(w / me.width * me.height);

                ctx.drawImage(me, 0, 0, me.width, me.height, x, y, w, h);
                this.headPosition = {x,y,w,h};

                ctxBox.drawImage(bg, 0, 0, bg.width, bg.height, 0, 0, this.wWidth, this.wHeight);

                const index = message.length * Math.random();
                const data = message[parseInt(index)];

                data.msg.map((item, i) =>{
                    ctxBox.font = "120px 黑体";
                    ctxBox.fillStyle = '#ffffff';
                    ctxBox.textBaseline = "middle";
                    ctxBox.textAlign = "center";

                    let y;
                    if(data.msg.length === 1){
                        y = 850 * 2;
                        if(this.$isMaxScreen()){
                            y = 960 * 2;
                        }
                    }else {
                        ctxBox.font = "100px 黑体";
                        if(i === 0){
                            y = 815 * 2;
                            if(this.$isMaxScreen()){
                                y = 925 * 2;
                            }
                        }else {
                            y = 885 * 2;
                            if(this.$isMaxScreen()){
                                y = 995 * 2;
                            }
                        }
                    }

                    ctxBox.fillText(item, 360 * 2, y, 380 * 2);
                });

                this.touchControl(canvasBox);
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

            touchControl(canvas) {
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
                            let moveX = (clientX - px);
                            let moveY = (clientY - py);

                            if(this.$needSmoothTouch()){
                                moveX = moveX * 4;
                                moveY = moveY * 4;
                            }

                            //计算位移
                            ctx.drawImage(me, 0, 0, me.width, me.height, x + moveX, y + moveY, w, h);
                            this.headPosition = {
                                x: x + moveX,
                                y: y + moveY,
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

                    // ctx.drawImage(bg, 0, 0, bg.width, bg.height, 0, 0, this.wWidth, this.wHeight);
                    // this.imageUrl = canvas.toDataURL('image/jpeg');
                }, false);

                canvas.addEventListener("touchend", (e) => {
                    this.lastPoint = null;
                }, false);
            },

            //等比缩放图片
            scaleImage(xScale, yScale, {x, y, w, h}) {

                if(this.$needSmoothTouch()){
                    xScale = xScale * 4;
                    yScale = yScale * 4;
                }

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

            saveImage(){
                //将两个图层的画面画到一个图层中并生成最终的图片
                const canvas = document.createElement("canvas");
                const ctxPic = canvas.getContext("2d");
                canvas.width = this.wWidth;
                canvas.height = this.wHeight;

                ctxPic.drawImage(document.getElementById('palette'),  0, 0, this.wWidth, this.wHeight, 0, 0, this.wWidth, this.wHeight);
                ctxPic.drawImage(document.getElementById('paletteBox'), 0, 0, this.wWidth, this.wHeight, 0, 0, this.wWidth, this.wHeight);
                this.imageUrl = canvas.toDataURL('image/jpeg');
                this.saved = true;
            }
        },

        components: {}
    };
</script>
