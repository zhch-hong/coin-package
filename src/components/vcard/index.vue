<template>
    <div class="vcard-component" :class="{'flex':flex}" :style="{padding:padding?'20px':'0px'}">
        <slot></slot>
    </div>
</template>
<script>
export default {
    name: "vcard",
    props: {
        padding: {
            type: Boolean,
            default: false
        },
        flex: {
            type: Boolean,
            default: false
        }
    }
};
</script>
<style lang="scss" scoped>
@import "@/styles/mixin.scss";

.vcard-component {
    width: 100%;
    min-height: 96px;
    margin-bottom: 20px;
    background-color: #ffffff;
}
.flex {
    @include flex(flex-start, center, row);
}
</style>
