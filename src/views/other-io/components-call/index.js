/* eslint-disable object-shorthand */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-unused-vars */

import Vue from 'vue';
import StaffAuth from '@/components/StaffAuth.vue';
import ReceivePanel from '@/components/ReceivePanel.vue';
import IOFrom from './IOFrom.vue';
import InputSuccess from './InputSuccess.vue';
import outputSuccess from './outputSuccess.vue';

function mountDOM(instance) {
  const div = document.createElement('div');
  document.body.append(div);
  instance.$mount(div);
}

function unmountDOM(instance) {
  instance.$el.remove();
  instance.$destroy();
}

export function ioFrom(isInput) {
  return new Promise((resolve) => {
    const instance = new Vue({
      render(h) {
        return h(IOFrom, {
          props: {
            isInput,
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

export function inputSuccess() {
  const instance = new Vue({
    render(h) {
      return h(InputSuccess, {
        on: {
          closed() {
            unmountDOM(instance);
          },
        },
      });
    },
  });
  mountDOM(instance);
}

export function utputSuccess() {
  const instance = new Vue({
    render(h) {
      return h(outputSuccess, {
        on: {
          closed() {
            unmountDOM(instance);
          },
        },
      });
    },
  });
  mountDOM(instance);
}

/**
 * 支付
 * @param {number} needPayValue
 * @param {number} orderId
 * @returns
 */
export function receivePanel(needPayValue, orderId) {
  return new Promise((resolve) => {
    const instance = new Vue({
      render(h) {
        return h(ReceivePanel, {
          props: {
            needPayValue,
            orderId,
          },
          on: {
            success() {
              resolve(true);
            },
            cancel() {
              resolve();
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
