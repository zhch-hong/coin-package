<template>
  <div class="member-manage">
    <el-form
      ref="searchForm"
      style="width: 100%; padding: 20px 0 10px; background-color: #ffffff; border-radius: 10px"
      :inline="true"
      :model="searchForm"
      label-width="120px"
    >
      <el-form-item label="会员ID/卡号:" prop="uid">
        <el-input v-model="searchForm.uid" size="mini" clearable style="width: 200px" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="会员姓名:" prop="nickName">
        <el-input v-model="searchForm.nickName" size="mini" clearable style="width: 200px" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="会员电话:" prop="phone">
        <el-input v-model="searchForm.phone" size="mini" clearable style="width: 200px" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="会员等级:" prop="vipName">
        <el-input v-model="searchForm.vipName" size="mini" clearable style="width: 200px" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="状态:" prop="status">
        <el-select v-model="searchForm.status" style="width: 200px" clearable size="mini" placeholder="请选择">
          <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label=" ">
        <el-button type="primary" size="mini" style="width: 120px" @click="search">查 询</el-button>
        <el-button size="mini" style="width: 120px; border-color: #4194fe; color: #4194fe" @click="reset">重 置 </el-button>
      </el-form-item>
    </el-form>
    <el-table
      :loading="loading"
      :data="tableData"
      style="width: 100%; margin-top: 20px"
      :header-row-style="{ backgroundColor: '#ffffff' }"
      @row-dblclick="showDetail"
    >
      <el-table-column label="会员ID/卡号" prop="uid" align="center" min-width="120">
        <template slot-scope="scope">
          <div>
            <span>{{ scope.row.uid }}</span>
            <i class="el-icon-document-copy copy-name" :data-clipboard-text="scope.row.uid" @click="copyUid(scope.row.uid)"></i>
          </div>
        </template>
      </el-table-column>
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
      <div slot="empty" class="flex-column" style="align-items: center; padding: 20px 0">
        <img src="@/assets/no-data.png" style="width: 320px" />
        <div style="font-size: 20px; color: #9f9f9f; text-align: center">暂无数据</div>
      </div>
    </el-table>
    <div class="flex-center" style="padding: 20px">
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
    <vip-detail :detail="currentUser" @on-closed="currentUser = {}" />
  </div>
</template>

<script>
import { paramsFilter } from '@/utils/tools'
import VipDetail from './components/vipDetial'

const clipboard = require('electron').clipboard

export default {
  name: 'store',
  components: {
    VipDetail
  },
  data() {
    return {
      loading: false,
      statusList: [
        { label: '正常', value: 0 },
        { label: '禁用', value: 1 }
      ],
      // 查询、翻页
      searchForm: {
        uid: '',
        nickName: '',
        phone: '',
        vipName: '',
        status: ''
      },
      pageNum: 1,
      showNum: 10,
      count: 0,
      // 表格数据
      tableData: [],
      // 会员详情
      currentUser: {}
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
  methods: {
    // 查看详情
    showDetail(row) {
      this.currentUser = row
    },
    // 复制
    copyUid(uid) {
      clipboard.writeText(uid.toString())
    },
    reset() {
      this.pageNum = 1
      this.$refs.searchForm.resetFields()
      this.getInfo()
    },
    search() {
      this.pageNum = 1
      this.getInfo()
    },
    getInfo() {
      // 默认参数
      const params = {
        ...this.searchForm
      }
      if (params.time && params.time.length) {
        params.startTime = params.time[0]
        params.endTime = params.time[1]
      } else {
        params.startTime = ''
        params.endTime = ''
      }
      if (params.uid) {
        params.uid = Number(params.uid)
      }
      if (params.phone) {
        params.phone = Number(params.phone)
      }
      delete params.time
      params.pageNum = this.pageNum
      params.showNum = this.showNum
      this.loading = true
      this.$api
        .getUserList(params)
        .then((res) => {
          this.tableData = res.body.items.map((item) => {
            return {
              uid: item.uid,
              nickName: item.nickName,
              vipName: item.vipName || '普通会员',
              phone: item.phone,
              IDCard: item.IDCard,
              birthday: item.birthday,
              coin: item.coin || 0,
              sendCoin: item.sendCoin || 0,
              starCoin: item.starCoin || 0,
              status: item.status === 0 ? '正常' : '禁用',
              endTime: item.endTime === 0 ? '无期限' : item.endTime
            }
          })
          this.count = res.body.count
        })
        .finally((result) => {
          this.loading = false
        })
    },
    // 导出表格
    exportXlSX() {
      this.loading = true
      const obj = {
        pageNum: 1,
        showNum: this.count,
        ...paramsFilter(this.searchForm)
      }
      this.$api.redCoinDetail.getRedCoinDetail(obj).then(
        (res) => {
          const data = res.body.items.map((val) => {
            return [val.playerInPut, val.playerOutPut, val.date]
          })
          const tHeader = ['用户投入(红包币)', '用户产出(红包币)', '变动日期']
          exportTable(tHeader, data, '集团列表').then(() => {
            this.loading = false
          })
        },
        (err) => {
          this.loading = false
        }
      )
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/mixin.scss';

.member-manage {
  padding: 20px;

  .copy-name {
    margin-left: 8px;
    cursor: pointer;

    &:hover {
      color: #409eff;
    }
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
    border-left: 1px solid #dcdfe6;
    width: 50%;

    .qrcode {
      border: 1px solid #dcdfe6;
      width: 240px;
      height: 240px;
    }
  }
}
</style>
