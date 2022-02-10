<template>
  <div class="sell-goods-item" @click="$emit('click')">
    <div class="item-name flex-center">{{ item.prizeName }}</div>
    <div class="flex-between">
      <div>
        <div class="item_bottom_fonst">{{ item.offValue | MIXIN_Points2Yuan }}元</div>
        <div class="item_bottom_fonst1">{{ item.coinValue }}积分</div>
      </div>
      <div>
        <div class="item_bottom_fonst2">库存</div>
        <div class="item_bottom_fonst2">{{ item.inventory }}</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
};
</script>
<style lang="scss" scoped>
.sell-goods-item {
  /* 屏幕小于1400px */
  @media screen and (max-width: 1400px) {
    width: 195px;
    padding: 14px 19px 0 19px;
    height: 167px;
  }
  /* 屏幕大于1400px */
  @media screen and (min-width: 1401px) {
    width: 270px;
    padding: 19px 28px 0;
    height: 222px;
  }
  box-sizing: border-box;
  background-color: #ffffff;
  border-radius: 1px 1px 1px 1px;
  box-shadow: 0px 2px 0px 0px rgba(204, 204, 204, 0.15);
  border-radius: 10px;
  .item-name {
    text-align: center;
    /* 屏幕小于1400px */
    @media screen and (max-width: 1400px) {
      font-size: 17px;
      height: 93px;
    }
    /* 屏幕大于1400px */
    @media screen and (min-width: 1401px) {
      font-size: 20px;
      height: 143px;
    }
    padding: 6px;
    overflow: hidden;
    background-color: #8f91f2;
    word-break: break-all;
    color: #ffffff;
    font-weight: bold;
    border-radius: 20px;
  }

  .flex-between {
    align-content: center;
    padding: 12px 0 0 0;
    box-sizing: border-box;
    .item_bottom_fonst {
      font-size: 18px;
      color: #3f6af5;
    }
    .item_bottom_fonst1 {
      color: #3f6af5;
      font-size: 14px;
      line-height: 23px;
    }
    .item_bottom_fonst2 {
      color: #848484;
      font-size: 14px;
      line-height: 23px;
      text-align: right;
    }
  }
}
</style>
