<style scoped lang="scss">

</style>

<template>
    <div>
        <button @click="startR">旋转</button>
        <button @click="startE">开始抽奖</button>
    </div>
</template>

<script>
    const viewX = 1500;
    const viewY = 1500;
    const wallWidth = 40;
    const boxSize = 800;
    const paddingTop = 80;
    const ballSize = 20;
    const triangleSize = 200;


    export default {
        data() {
            return {
                startRotate: false,
                startExtract: false,
            }
        },

        created() {

        },

        mounted() {
            this.init();
        },

        methods: {
            init() {
                let Engine = Matter.Engine,
                    Render = Matter.Render,
                    Runner = Matter.Runner,
                    Body = Matter.Body,
                    Events = Matter.Events,
                    Composite = Matter.Composite,
                    Composites = Matter.Composites,
                    Common = Matter.Common,
                    Constraint = Matter.Constraint,
                    MouseConstraint = Matter.MouseConstraint,
                    Mouse = Matter.Mouse,
                    World = Matter.World,
                    Vertices = Matter.Vertices,
                    Bodies = Matter.Bodies;

                let engine = Engine.create(),
                    world = engine.world;

                let render = Render.create({
                    element: document.body,
                    engine: engine,
                    options: {
                        width: 800,
                        height: 600,
                        showAngleIndicator: true
                    }
                });

                Render.run(render);

                let runner = Runner.create();
                Runner.run(runner, engine);

                Render.lookAt(render, {
                    min: {x: 0, y: 0},
                    max: {x: viewX, y: viewY}
                });

                //  盒子底部挡板
                const leftBottom = Bodies.rectangle((viewX - boxSize / 2) / 2, boxSize + paddingTop, boxSize / 2 + wallWidth, wallWidth, {isStatic: true, chamfer: wallWidth});
                const rightBottom = Bodies.rectangle((viewX - boxSize / 2) / 2 + boxSize / 2, boxSize + paddingTop, boxSize / 2 + wallWidth, wallWidth, {isStatic: true, chamfer: wallWidth});

                //  抽奖盒子
                World.add(world, [
                    Bodies.rectangle((viewX - boxSize) / 2 + boxSize / 2, paddingTop, boxSize + wallWidth, wallWidth, {isStatic: true}),
                    Bodies.rectangle((viewX - boxSize) / 2 + boxSize, boxSize / 2 + paddingTop, wallWidth, boxSize + wallWidth, {isStatic: true}),
                    //底部挡板换成两个挡板
                    leftBottom,
                    rightBottom,
                    //  Bodies.rectangle((viewX - boxSize) / 2 + boxSize / 2, boxSize + paddingTop, boxSize + wallWidth, wallWidth, {isStatic: true}),
                    Bodies.rectangle((viewX - boxSize) / 2, boxSize / 2 + paddingTop, wallWidth, boxSize + wallWidth, {isStatic: true})
                ]);

                //  盒子边角
                const coverSize = triangleSize / 2 - wallWidth / 2;
                World.add(world, [
                    Bodies.fromVertices((viewX - boxSize) / 2 + coverSize, paddingTop + coverSize, Vertices.fromPath(`0 0 0 ${triangleSize} ${triangleSize} 0`), {
                        isStatic: true,
                        angle: 0
                    }),
                    Bodies.fromVertices((viewX - boxSize) / 2 + boxSize - coverSize, paddingTop + coverSize, Vertices.fromPath(`0 0 ${triangleSize} 0  ${triangleSize} ${triangleSize}`), {
                        isStatic: true,
                        angle: 0
                    }),
                    Bodies.fromVertices((viewX - boxSize) / 2 + boxSize - coverSize, paddingTop + boxSize - coverSize, Vertices.fromPath(`${triangleSize} 0 ${triangleSize} ${triangleSize} 0 ${triangleSize}`), {
                        isStatic: true,
                        angle: 0
                    }),
                    Bodies.fromVertices((viewX - boxSize) / 2 + coverSize, paddingTop + boxSize - coverSize, Vertices.fromPath(` ${triangleSize} ${triangleSize} 0 ${triangleSize} 0 0`), {
                        isStatic: true,
                        angle: 0
                    })
                ]);

                let index = 0;
                //加入抽奖人小球
                World.add(world, Composites.stack((viewX - boxSize) / 2 + wallWidth + triangleSize, paddingTop + wallWidth + triangleSize, 10, 10, 0, 0, function (x, y) {
                    return Bodies.circle(x, y, ballSize, {
                        frictionAir: 0,
                        friction: 0.001,
                        restitution: 0.2
                    });
                }));

                //  抽奖盒子旋转的棍子
                let stick = Bodies.rectangle((viewX - boxSize) / 2 + boxSize / 2, boxSize / 2 + paddingTop, boxSize - wallWidth, wallWidth , {
                    isStatic: true,
                    chamfer: wallWidth / 2
                });
                World.add(world, stick);

                let rotateAngle = 0;
                let moveCount = 0;
                Events.on(engine, 'beforeUpdate', (event) => {
                    //  转动抽奖棍子
                    if (this.startRotate) {
                        rotateAngle += 0.01;
                        if(rotateAngle === 1){
                            rotateAngle = 0;
                        }
                        Body.setAngle(stick, Math.PI * rotateAngle)
                    } else {
                        Body.setAngle(stick, 0);
                    }

                    //  打开底部挡板
                    if (this.startExtract) {
                        if(moveCount + 1 >= ballSize * 5){
                            return;
                        }else{
                            moveCount++;
                            Body.setPosition(leftBottom, { x: leftBottom.position.x++, y: leftBottom.position.y });
                            Body.setPosition(rightBottom, { x: rightBottom.position.x--, y: rightBottom.position.y });
                        }
                    }else {
                        if(moveCount - 1 <= 0){
                            return;
                        }else {
                            moveCount--;
                            Body.setPosition(leftBottom, { x: leftBottom.position.x--, y: leftBottom.position.y });
                            Body.setPosition(rightBottom, { x: rightBottom.position.x++, y: rightBottom.position.y });
                        }
                    }
                });

            },

            startR(){
                this.startRotate = !this.startRotate
            },

            startE(){
                this.startExtract = !this.startExtract
            }

        },

        components: {}
    }
</script>
