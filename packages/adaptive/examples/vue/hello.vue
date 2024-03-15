<template>
    <div class="sample">
        <h4>Start Hello component</h4>
        <teleport-to target="#hitTarget">Hola</teleport-to>
        <p class="greeting">{{ greeting }}</p>

        <br />
        <button @click="changeText">Test Vue component is working</button>
        <br />

        <!-- Example of directive binding with Adaptive -->
        <div v-adaptive="{ addClass: { desktop: 'cinco' } }">Using Directive inside Vue component</div>
        <br />

        <!-- Example of use as a ref element with plugin style -->
        <div ref="six">Using Ref element inside component for Vue Plugin mode and custom media query expression</div>

        <br />
        <!-- Example of a later insertion -->
        <div v-if="show" class="lazy">Using (observer) After load inside component</div>
        <br />
        <button @click="toggle">Show hide Lazy element</button>
        <br />
        <div style="background-color: white" v-teleport-to="'#hello'">
            this is a VUE component... Getting teleported (teleport) from the component to "inside of static Hello"
        </div>
        <br />
        <div ref="callmeback">Has a callback function at a defined breakdown</div>
        <br />
        <div v-if="tablet">Has a conditional IF tablet</div>
        <br />
        <div id="hitTarget"></div>
        <h4>End Hello component</h4>
    </div>
</template>
<script>
export default {
    data() {
        return {
            greeting: 'Example Vue component Hello World!',
            show: false,
            tablet: null,
        };
    },
    mounted: function () {
        // Example using the ref and custom registered media query (see the app.js)
        this.Adaptive.registerElement(this.$refs.six, { addClass: { doggy: 'seven' } });

        // can use this...
        this.Adaptive.registerElement(this.$refs.callmeback, {
            execute: {
                mobile: function (element) {
                    console.log('This is a callback at mobile breakdown');
                    console.log(element);
                },
            },
        });
        // or
        this.Adaptive.if('tablet', [this, 'tablet']);
        // or
        this.Adaptive.if('tablet', function () {
            // code
        });
        // or
        this.Adaptive.if('tablet', this.changeText);
    },
    methods: {
        changeText() {
            this.greeting = Math.floor(Math.random() * 10);
        },
        toggle() {
            this.show = !this.show;
        },
    },
};
</script>

<style>
.greeting {
    color: red;
    font-weight: bold;
}
</style>
