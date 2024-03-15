<template>
    <div>
        Composition Api component
        <button @click="count++">You clicked me {{ count }} times.</button>
    </div>
</template>

<script>
import { ref, inject, onMounted } from 'vue';

export default {
    setup() {
        const Adaptive = inject('Adaptive');
        // console.log($Adaptive);
        const count = ref(0);

        Adaptive.if('mobile', function() {
            console.log(555);
        });

        Adaptive.if('desktop', function() {
            console.log(33);
        }).else(() => {
            console.log(44);
        });

        return { count };
    },
};
</script>
