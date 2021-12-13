<template>
    <div>
        <el-table :data="tableData" style="width: 100%">
            <el-table-column
                label="创建时间"
                prop="time"
                align="center"
            ></el-table-column>
            <el-table-column
                label="真实姓名"
                prop="realName"
                align="center"
            ></el-table-column>
            <el-table-column
                label="操作类型"
                prop="type"
                align="center"
            ></el-table-column>
            <el-table-column
                label="详细备注"
                prop="remark"
                align="center"
            ></el-table-column>
        </el-table>
        <div class="pagenation-box">
            <el-pagination
                :page-size.sync="showNum"
                :current-page.sync="pageNum"
                @current-change="getData"
                @size-change="getData"
                background
                :page-sizes="[10, 20]"
                layout="total, sizes, prev, pager, next, jumper"
                :total="count"
            />
        </div>
    </div>
</template>

<script>
export default {
    name: "ActionLogs",
    props: {
        userInfo: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            tableData: [],
            pageNum: 1,
            showNum: 10,
            count: 0,
        }
    },
    filters: {
        formatType(val) {
            switch (val) {
                case 1:
                    return '提币'
                case 2:
                    return '补游戏币'
                case 3:
                    return '补积分'
                default:
                    return '其他'
            }
        }
    },
    watch: {
        userInfo: {
            deep: true,
            immediate: true,
            handler(val) {
                if (val.uid) {
                    this.getData()
                }
            }
        }
    },
    methods: {
        async getData() {
            const params = {
                pageNum: this.pageNum,
                showNum: this.showNum,
                uid: this.userInfo.uid
            }
            const res = await this.$api.getUserOperationDetail(params)
            this.tableData = res.body.items
            this.count = res.body.count
        }
    }
}
</script>

<style lang="scss" scoped>
.pagenation-box {
    margin-top: 12px;
    display: flex;
    justify-content: flex-end;
}
</style>