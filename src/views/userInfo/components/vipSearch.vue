<template>
    <div class="store-manage">
        <vcard padding flex>
            <el-form ref="searchForm" style="width:100%;" :inline="true" :model="searchForm" label-width="120px">
                <el-row justify="space-between" align="center">
                    <el-col :span="20" :gutter="20">
                        <el-form-item label="会员ID/卡号:" prop="uid">
                            <el-input
                                    v-model="searchForm.uid"
                                    size="mini"
                                    clearable
                                    style="width:200px;margin-top: 7px;"
                                    placeholder="请输入"
                            >
                                <el-button slot="append" type="primary" size="mini"
                                           style="background-color: #3a8ee6;color: #ffffff;">读会员卡
                                </el-button>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="会员姓名:" prop="nickName">
                            <el-input
                                    v-model="searchForm.nickName"
                                    size="mini"
                                    clearable
                                    style="width:200px;"
                                    placeholder="请输入"
                            >
                            </el-input>
                        </el-form-item>
                        <el-form-item label="会员电话:" prop="phone">
                            <el-input
                                    v-model="searchForm.phone"
                                    size="mini"
                                    clearable
                                    style="width:200px;"
                                    placeholder="请输入"
                            >
                            </el-input>
                        </el-form-item>
                        <el-form-item label="会员等级:" prop="vipName">
                            <el-input
                                    v-model="searchForm.vipName"
                                    size="mini"
                                    clearable
                                    style="width:200px;"
                                    placeholder="请输入"
                            >
                            </el-input>
                        </el-form-item>
                        <el-form-item label="状态:" prop="status">
                            <el-select
                                    v-model="searchForm.status"
                                    style="width:200px;"
                                    clearable
                                    size="mini"
                                    placeholder="请选择"
                            >
                                <el-option
                                        v-for="item in statusList"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4" style="textAlign:right;">
                        <el-button type="primary" size="mini" style="width:96px;" @click="search">查 询</el-button>
                        <el-button size="mini" style="width:96px;" @click="reset">重 置</el-button>
                    </el-col>
                </el-row>
            </el-form>
        </vcard>
        <vcard>
            <el-row class="list-container" type="flex" align="middle">
                <el-col :span="12">会员信息</el-col>
            </el-row>
            <el-table
                    :loading="loading"
                    :data="tableData"
                    style="width: 100%"
                    :header-cell-style="{backgroundColor:'rgb(242,242,242)'}"
            >
                <el-table-column label="会员ID/卡号" prop="uid" align="center" min-width="120"></el-table-column>
                <el-table-column label="会员姓名" prop="nickName" align="center" min-width="120"></el-table-column>
                <el-table-column label="会员等级" prop="vipName" align="center" min-width="160"></el-table-column>
                <el-table-column label="会员电话" prop="phone" align="center" min-width="120"></el-table-column>
                <el-table-column label="身份证" prop="IDCard" align="center" min-width="120"></el-table-column>
                <el-table-column label="会员生日" prop="birthday" align="center" min-width="120"></el-table-column>
                <el-table-column label="本币数" prop="coin" align="center" min-width="120"></el-table-column>
                <el-table-column label="赠币" prop="sendCoin" align="center" min-width="120"></el-table-column>
                <el-table-column label="积分" prop="starCoin" align="center" min-width="120"></el-table-column>
                <el-table-column label="状态" prop="status" align="center" min-width="120"></el-table-column>
                <el-table-column label="有效期" prop="endTime" align="center" min-width="150"></el-table-column>
            </el-table>
            <br/>
            <!--导出以及分页部分-->
            <div class="pagenation-box">
                <el-pagination
                        :page-size.sync="showNum"
                        :current-page.sync="pageNum"
                        @current-change="getInfo"
                        @size-change="getInfo"
                        background
                        :page-sizes="[10, 20, 50, 100]"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="count"
                ></el-pagination>
            </div>
        </vcard>
    </div>
</template>

<script>
    import {paramsFilter, clearObject} from "@/utils/tools";
    import {isPhone} from "../../../utils/validate";

    export default {
        name: "store",
        components: {},
        data() {
            return {
                loading: false,
                statusList: [
                    {label: '正常', value: 0},
                    {label: '禁用', value: 1},
                ],
                // 查询、翻页
                searchForm: {
                    uid: "",
                    type: "",
                },
                pageNum: 1,
                showNum: 10,
                count: 0,
                // 表格数据
                tableData: [],
            };
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
        mounted() {
            this.getInfo();
        },
        methods: {
            reset() {
                this.pageNum = 1;
                this.$refs.searchForm.resetFields();
                this.getInfo();
            },
            search() {
                this.pageNum = 1;
                this.getInfo();
            },
            getInfo() {
                //默认参数
                let params = {
                    ...this.searchForm
                };
                console.log(params);
                if (params.time && params.time.length) {
                    params.startTime = params.time[0];
                    params.endTime = params.time[1];
                } else {
                    params.startTime = '';
                    params.endTime = '';
                }
                delete params.time
                params.pageNum = this.pageNum;
                params.showNum = this.showNum;
                this.loading = true;
                this.$api
                    .getUserList(params)
                    .then(res => {
                        this.tableData = res.body.items.map(item => {
                            return {
                                uid: item.uid,
                                nickName: item.nickName,
                                vipName: item.vipName || "普通会员",
                                phone: item.phone,
                                IDCard: item.IDCard,
                                birthday: item.birthday,
                                coin: item.coin || 0,
                                sendCoin: item.sendCoin || 0,
                                starCoin: item.starCoin || 0,
                                status: item.status === 0 ? "未冻结" : "冻结",
                                endTime: item.endTime === 0 ? "无期限" : item.endTime
                            }
                        });
                        this.count = res.body.count;
                    })
                    .finally(result => {
                        this.loading = false;
                    });
            },
            //导出表格
            exportXlSX() {
                this.loading = true;
                let obj = {
                    pageNum: 1,
                    showNum: this.count,
                    ...paramsFilter(this.searchForm)
                };
                this.$api.redCoinDetail.getRedCoinDetail(obj).then(
                    res => {
                        let data = res.body.items.map(val => {
                            return [val.playerInPut, val.playerOutPut, val.date];
                        });
                        const tHeader = [
                            "用户投入(红包币)",
                            "用户产出(红包币)",
                            "变动日期"
                        ];
                        exportTable(tHeader, data, "集团列表").then(() => {
                            this.loading = false;
                        });
                    },
                    err => {
                        this.loading = false;
                    }
                );
            }
        }
    };
</script>

<style lang="scss" scoped>
    @import "@/styles/mixin.scss";

    .store-manage {
        .list-container {
            padding: 20px;
        }

        .total-content {
            margin: 0;
            padding: 20px;
        }

        .pagenation-box {
            padding: 20px;
            @include flex(flex-end, center, row);
        }
    }

    .auth-container {

        @include flex(center, center, row);

        .left {
            width: 50%;
        }

        .right {
            @include flex(center, center, column);
            text-align: center;
            border-left: 1px solid #DCDFE6;
            width: 50%;

            .qrcode {
                border: 1px solid #DCDFE6;
                width: 240px;
                height: 240px;
            }
        }
    }
</style>
