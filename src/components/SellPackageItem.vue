<template>
  <div class="sell-package-item" @click="$emit('click')">
    <div class="item-name flex-center" :style="styleFormat(item)">
      {{ item.giftName }}
    </div>

    <div class="flex-between">
      <div>
        <div class="item_bottom_fonst">{{ item.price | MIXIN_Points2Yuan }}元</div>
        <div class="item_bottom_fonst1">({{ item.price | MIXIN_Points2StarCoin }}积分)</div>
      </div>
      <div>
        <img src="../assets/package-sale/cart-icon.png" style="width: 26px" />
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

  methods: {
    styleFormat(object) {
      const { bgColor, textColor, type } = object;
      const style = {};
      if (bgColor !== '') {
        style['background-color'] = bgColor;
      } else {
        style['background-color'] = type === 3 ? '#7D74F6' : '#4194FE';
      }

      if (textColor !== '') {
        style.color = textColor;
      }
      return style;
    },
  },
};
</script>
<style lang="scss" scoped>
.sell-package-item {
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
  .item-name {
    text-align: center;
    padding: 6px;
    overflow: hidden;
    background-color: #41a3fe;
    color: #ffffff;
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
    font-weight: bold;
    border-radius: 20px;
  }

  .flex-between {
    align-content: center;
    padding: 12px 0 0 0;
    box-sizing: border-box;

    .item_bottom_fonst {
      font-size: 18px;
      color: #848484;
    }
    .item_bottom_fonst1 {
      color: #a3a3a3;
      font-size: 14px;
      line-height: 23px;
    }
  }
}
</style>
