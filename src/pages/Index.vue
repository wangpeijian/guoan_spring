<style scoped lang="scss">

</style>

<template>
    <div>

    </div>
</template>

<script>
    export default {
        data() {
            return {}
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
                    Composite = Matter.Composite,
                    Composites = Matter.Composites,
                    Common = Matter.Common,
                    MouseConstraint = Matter.MouseConstraint,
                    Mouse = Matter.Mouse,
                    World = Matter.World,
                    Bodies = Matter.Bodies;

                // create engine
                let engine = Engine.create(),
                    world = engine.world;

                // create renderer
                let render = Render.create({
                    element: document.body,
                    engine: engine,
                    options: {
                        width: window.screen.width,
                        height: window.screen.height,
                        showAngleIndicator: true
                    }
                });

                Render.run(render);

                // create runner
                let runner = Runner.create();
                Runner.run(runner, engine);
            }
        },

        components: {}
    }
</script>
