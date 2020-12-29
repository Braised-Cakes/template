<template>
    <!-- <a-select-option
        :key="source.value"
        :value="source.value"
    >{{ source.label }}</a-select-option> -->
    <div>{{ source.label }}</div>
</template>

<script>
export default {
    // name: 'item-component',
    created() {
        console.log(999)
        console.log(this.source)
    },
    props: {
        source: [Object]
    }
}
</script>