export const COIN_RMB_RATE = 33;

// 参数过滤，返回有值的属性
export function paramsFilter(par = {}) {
    let result = {}
    for (let i in par) {
        let item = par[i]
        if (
            item === null ||
            item === undefined ||
            item === '' ||
            (item instanceof Array && item.length === 0) ||
            (item instanceof Object && !(item instanceof Object) && JSON.stringify(item) !== '{}')
        ) {
        } else {
            result[i] = item
        }
    }
    return result
}

// 转换为人民币价格，最多两位小数
export function coin2Rmb(num) {
    return numFixed(num / 100);
}

/**
 * 保留p为小数
 * 向上取整
 * @p 最多保留小数位
 **/
export function numFixed(num, p = 2) {
    let sign = num >= 0 ? 1 : -1;
    p = Math.pow(10, p);
    num *= sign * p;
    let intNum = parseInt(num);
    num = num % 1;
    if (num % 1 >= 0.1)
        intNum += 1;
    num = intNum * sign / p;
    return num;
}

export function loadScript(src, callback) {
    let s = document.createElement('script');
    s.async = false;
    s.src = src;
    let onLoad = function () {
        s.parentNode.removeChild(s);
        s.removeEventListener('load', this);
        s.removeEventListener('error', this);
        callback(true);
    };
    let onLoadError = function () {
        s.parentNode.removeChild(s);
        s.removeEventListener('load', this);
        s.removeEventListener('error', this);
        callback(false);
    };
    s.addEventListener('load', onLoad, false);
    s.addEventListener('error', onLoadError, false);
    document.body.appendChild(s);
};

/**清除对象**/
export function clearObject(obj) {
    for (let key in obj) {
        obj[key] = "";
    }
}

// 深拷贝对象
export function deepClone(item = {}) {
    const target = item.constructor === Array ? [] : {}; // 判断复制的目标是数组还是对象
    for (let keys in item) { // 遍历目标
        if (item.hasOwnProperty(keys)) {
            if (item[keys] && typeof item[keys] === 'object') { // 如果值是对象，就递归一下
                target[keys] = item[keys].constructor === Array ? [] : {};
                target[keys] = deepClone(item[keys]);
            } else { // 如果不是，就直接赋值
                target[keys] = item[keys];
            }
        }
    }
    return target;
}

// 解析地址栏的参数，并返回解析后的对象
export function parseQuery(query = window.location.href.split('?')[1]) {
    const reg = /([^=&\s]+)[=\s]*([^&\s]*)/g
    let obj = {}
    while (reg.exec(query)) obj[RegExp.$1] = RegExp.$2
    return obj
}

// async 异步处理
export function to(promise) {
    return promise
        .then(res => {
            return [null, res]
        })
        .catch(err => [err])
}

/**
 * JavaScript实现版本号比较
 * v1是否比v2大或者一样
 */
export function compareVersion(v1, v2) {
    let arr1 = v1.split('.');
    let arr2 = v2.split('.');
    //将两个版本号拆成数字
    let minL = Math.max(arr1.length, arr2.length);
    let pos = 0;        //当前比较位
    let diff = 0;        //当前为位比较是否相等
    //逐个比较如果当前位相等则继续比较下一位
    while (pos < minL) {
        diff = parseInt(arr1[pos]) - parseInt(arr2[pos]);
        if (diff != 0) {
            break;
        }
        pos++;
    }
    if (diff > 0) {
        console.log('新版本')
        return true;
    } else if (diff == 0) {
        console.log('稳定版')
        return true;
    } else {
        console.log('旧版本')
        return false;
    }
}

export function toFixed(d) {
    let s = this + ''
    if (!d) d = 0
    if (s.indexOf('.') === -1) s += '.'
    s += new Array(d + 1).join('0')
    if (new RegExp('^(-|\\+)?(\\d+(\\.\\d{0,' + (d + 1) + '})?)\\d*$').test(s)) {
        let ss = '0' + RegExp.$2
        let pm = RegExp.$1
        let a = RegExp.$3.length
        let b = true
        if (a === d + 2) {
            a = ss.match(/\d/g)
            if (parseInt(a[a.length - 1]) > 4) {
                for (let i = a.length - 2; i >= 0; i--) {
                    a[i] = parseInt(a[i]) + 1
                    if (a[i] === 10) {
                        a[i] = 0
                        b = i !== 1
                    } else break
                }
            }
            ss = a.join('').replace(new RegExp('(\\d+)(\\d{' + d + '})\\d$'), '$1.$2')
        }
        if (b) ss = ss.substr(1)
        return (pm + ss).replace(/\.$/, '')
    }
    return this + ''
}
