/* eslint-disable object-shorthand */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-unused-vars */

import Vue from 'vue';
import StaffAuth from '@/components/StaffAuth.vue';
import ReceivePanel from '@/components/ReceivePanel.vue';
import IOFrom from './IOFrom.vue';

function mountDOM(instance) {
  const div = document.createElement('div');
  document.body.append(div);
  instance.$mount(div);
}

function unmountDOM(instance) {
  instance.$el.remove();
  instance.$destroy();
}

export function ioFrom(params) {
  return new Promise((resolve) => {
    const instance = new Vue({
      render(h) {
        return h(IOFrom, {
          props: {
            params,
          },
          on: {
            cancel() {
              resolve();
            },
            submit(from) {
              resolve(from);
            },
            closed() {
              unmountDOM(instance);
            },
          },
        });
      },
    });
    mountDOM(instance);
  });
}

export function staffAuth() {
  return new Promise((resolve) => {
    const instance = new Vue({
      render(h) {
        return h(StaffAuth, {
          props: {
            show: true,
          },
          on: {
            cancel() {
              resolve();
              unmountDOM(instance);
            },
            success(type) {
              resolve(type);
              unmountDOM(instance);
            },
          },
        });
      },
    });
    mountDOM(instance);
  });
}

/**
 * 支付
 * @param {number} needPayValue
 * @param {number} orderId
 * @returns
 */
export function receivePanel(needPayValue, orderId) {
  return new Promise((resolve) => {
    const observable = Vue.observable({ visible: true });
    const instance = new Vue({
      render(h) {
        return h(
          'el-dialog',
          {
            props: {
              'visible': observable.visible,
              'close-on-click-modal': false,
              'close-on-press-escape': false,
            },
            on: {
              'update:visible'(value) {
                observable.visible = value;
                resolve();
              },
              'closed'() {
                unmountDOM(instance);
              },
            },
          },
          [
            h(ReceivePanel, {
              props: {
                needPayValue,
                orderId,
              },
              on: {
                success() {
                  resolve(true);
                  observable.visible = false;
                },
              },
            }),
          ]
        );
      },
    });
    mountDOM(instance);
  });
}
