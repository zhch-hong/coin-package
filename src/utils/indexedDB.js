/**
 * 封装的方法以及用法
 import { openDB,
            addData,
            getDataByKey,
            cursorGetData,
            getDataByIndex,
            cursorGetDataByIndex,
            updateDB,
            deleteDB,
            cursorDelete,
            closeDB,
            deleteDBAll } from './indexedDB.js'
 openDB('myDB', 'one').then(db => {  // 打开 / 创建 Indexed 数据
      // addData(db, 'one', { id: 1, name: '张三', age: 24 }) // 新增数据
      // addData(db, 'one', { id: 2, name: '李四', age: 30 }) // 新增数据
      // getDataByKey(db, 'one', 1) // 通过主键读取数据
      // cursorGetData(db, 'one') // 通过游标读取数据
      // getDataByIndex(db, 'one','name', '张三') // 通过索引读取数据
      // cursorGetDataByIndex(db, 'one', 'name', '张三') // 通过索引和游标查询记录
      // updateDB(db, 'one', { id: 1, name: '张三', age: 25 }) // 更新数据
      // deleteDB(db, 'one', 2) // 删除数据
      // cursorDelete(db, 'one', 'name', '张三') // 通过索引和游标删除指定的数据
      // closeDB(db) // 关闭数据库
    })
 // deleteDBAll('myDB') // 删除数据库 慎用!!!!!!!!!!
 *
 * 打开数据库
 * @param {object} dbName 数据库的名字
 * @param {string} version 数据库的版本
 * @return {object} 该函数会返回一个数据库实例
 */
const storeList = [
    {
        name: 'prizeInfo',
        config: {
            keyPath: 'id'
        },
        index: [{
            key: 'id',
            config: {unique: true}
        }]
    },
    {
        name: 'prizeRecord',
        config: {
            keyPath: 'orderId'
        },
        index: [{
            key: 'orderId',
            config: {unique: true}
        }]
    },
    {
        name: 'giftInfo',
        config: {
            keyPath: 'giftId'
        },
        index: [{
            key: 'giftId',
            config: {unique: true}
        }]
    },
    {
        name: 'giftRecord',
        config: {
            keyPath: 'orderId'
        },
        index: [{
            key: 'orderId',
            config: {unique: true}
        }]
    },
    {
        name: 'staffInfo',
        config: {
            keyPath: 'phone'
        },
        index: [{
            key: 'phone',
            config: {unique: true}
        }]
    },
    {
        name: 'printFormat',
        config: {
            keyPath: 'id'
        },
        index: [{
            key: 'id',
            config: {unique: true}
        }, {
            key: 'code',
            config: {unique: true}
        }]
    }
]

export function openDB(dbName, version = 1) {
    return new Promise((resolve, reject) => {
        //  兼容浏览器
        let indexedDB = window.indexedDB
        let db
        const request = indexedDB.open(dbName, version)
        request.onsuccess = function (event) {
            db = event.target.result // 数据库对象
            resolve(db)
        }

        request.onerror = function (event) {
            console.log('数据库打开报错')
        }

        request.onupgradeneeded = function (event) {
            // 数据库创建或升级的时候会触发
            console.log('onupgradeneeded')
            db = event.target.result // 数据库对象
            storeList.forEach(store => {
                if (!db.objectStoreNames.contains(store.name)) {
                    let objectStore = db.createObjectStore(store.name, store.config) // 创建表
                    if (store.index) {
                        store.index.forEach(item => {
                            objectStore.createIndex(item.key, item.key, item.config)
                        })
                    }
                }
            })
        }
    })
}

/**
 * 新增数据
 * @param {object} db 数据库实例
 * @param {string} storeName 仓库名称
 * @param {object} data 数据
 */
export function addData(db, storeName, data) {
    return new Promise((resolve, reject) => {
        let request = db
            .transaction([storeName], 'readwrite') // 事务对象 指定表格名称和操作模式（"只读"或"读写"）
            .objectStore(storeName) // 仓库对象
            .add(data)
        request.onsuccess = function (event) {
            console.log('数据写入成功')
            resolve()
        }

        request.onerror = function (event) {
            console.log('数据写入失败')
            reject()
        }
    })
}

/**
 * 通过主键读取数据
 * @param {object} db 数据库实例
 * @param {string} storeName 仓库名称
 * @param {string} key 主键值
 */
export function getDataByKey(db, storeName, key) {
    return new Promise((resolve, reject) => {
        let transaction = db.transaction([storeName]) // 事务
        let objectStore = transaction.objectStore(storeName) // 仓库对象
        let request = objectStore.get(key)

        request.onerror = function (event) {
            console.log('事务失败')
        }

        request.onsuccess = function (event) {
            console.log('主键查询结果: ', request.result)
            resolve(request.result)
        }
    })
}

/**
 * 通过游标读取数据
 * @param {object} db 数据库实例
 * @param {string} storeName 仓库名称
 */
export function cursorGetData(db, storeName) {
    return new Promise((resolve, reject) => {
        let list = []
        let store = db
            .transaction(storeName, 'readwrite') // 事务
            .objectStore(storeName) // 仓库对象
        let request = store.openCursor() // 指针对象
        request.onsuccess = function (e) {
            let cursor = e.target.result
            if (cursor) {
                // 必须要检查
                list.push(cursor.value)
                cursor.continue() // 遍历了存储对象中的所有内容
            } else {
                resolve(list)
            }
        }
    })
}

/**
 * 通过索引读取数据
 * @param {object} db 数据库实例
 * @param {string} storeName 仓库名称
 * @param {string} indexName 索引名称
 * @param {string} indexValue 索引值
 */
export function getDataByIndex(db, storeName, indexName, indexValue) {
    return new Promise((resolve, reject) => {
        let store = db.transaction(storeName, 'readwrite').objectStore(storeName)
        let request = store.index(indexName).get(indexValue)
        request.onerror = function () {
            console.log('事务失败')
            reject()
        }
        request.onsuccess = function (e) {
            let result = e.target.result
            resolve(result)
        }
    })
}

/**
 * 通过索引和游标查询记录
 * @param {object} db 数据库实例
 * @param {string} storeName 仓库名称
 * @param {string} indexName 索引名称
 * @param {string} indexValue 索引值
 */
export function cursorGetDataByIndex(db, storeName, indexName, indexValue) {
    let list = []
    let store = db.transaction(storeName, 'readwrite').objectStore(storeName) // 仓库对象
    let request = store
        .index(indexName) // 索引对象
        .openCursor(IDBKeyRange.only(indexValue)) // 指针对象
    request.onsuccess = function (e) {
        var cursor = e.target.result
        if (cursor) {
            // 必须要检查
            list.push(cursor.value)
            cursor.continue() // 遍历了存储对象中的所有内容
        } else {
            console.log('游标索引查询结果：', list)
        }
    }
    request.onerror = function (e) {
    }
}

/**
 * 更新数据
 * @param {object} db 数据库实例
 * @param {string} storeName 仓库名称
 * @param {object} data 数据
 */
export function updateDB(db, storeName, data) {
    return new Promise((resolve, reject) => {
        let request = db
            .transaction([storeName], 'readwrite') // 事务对象
            .objectStore(storeName) // 仓库对象
            .put(data)
        request.onsuccess = function () {
            console.log('更新成功')
            resolve()
        }
        request.onerror = function () {
            console.log('更新失败')
            reject()
        }
    })
}

/**
 * 删除数据
 * @param {object} db 数据库实例
 * @param {string} storeName 仓库名称
 * @param {object} id 主键值
 */
export function deleteDB(db, storeName, id) {
    let request = db
        .transaction([storeName], 'readwrite')
        .objectStore(storeName)
        .delete(id)

    request.onsuccess = function () {
        console.log('数据删除成功')
    }

    request.onerror = function () {
        console.log('数据删除失败')
    }
}

/**
 * 通过索引和游标删除指定的数据
 * @param {object} db 数据库实例
 * @param {string} storeName 仓库名称
 * @param {string} indexName 索引名
 * @param {object} indexValue 索引值
 */
export function cursorDelete(db, storeName, indexName, indexValue) {
    let store = db.transaction(storeName, 'readwrite').objectStore(storeName)
    let request = store
        .index(indexName) // 索引对象
        .openCursor(IDBKeyRange.only(indexValue)) // 指针对象
    request.onsuccess = function (e) {
        let cursor = e.target.result
        let deleteRequest
        if (cursor) {
            deleteRequest = cursor.delete() // 请求删除当前项
            deleteRequest.onerror = function () {
                console.log('游标删除该记录失败')
            }
            deleteRequest.onsuccess = function () {
                console.log('游标删除该记录成功')
            }
            cursor.continue()
        }
    }
    request.onerror = function (e) {
    }
}

/**
 *  清空表数据
 *  @param {object} db 数据库实例
 *  @param {string} storeName 表名
 * */
export function clearDB(db, storeName) {
    return new Promise((resolve, reject) => {
        let store = db.transaction(storeName, 'readwrite').objectStore(storeName)
        store.clear()
        resolve()
    })

}

/**
 * 关闭数据库
 * @param {object} db 数据库实例
 */
export function closeDB(db) {
    db.close()
    console.log('数据库已关闭')
}

/**
 * 删除数据库
 * @param {object} dbName 数据库名称
 */
export function deleteDBAll(dbName) {
    console.log(dbName)
    let deleteRequest = window.indexedDB.deleteDatabase(dbName)
    deleteRequest.onerror = function (event) {
        console.log('删除失败')
    }
    deleteRequest.onsuccess = function (event) {
        console.log('删除成功')
    }
}
