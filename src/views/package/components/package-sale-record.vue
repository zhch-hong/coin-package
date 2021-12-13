<template>
  <div class="store-manage flex-column">
    <template v-if="!$store.state.offline">
      <el-form
        style="width: 100%; background-color: #ffffff; border-radius: 10px; padding: 20px 0 10px"
        ref="searchForm"
        :inline="true"
        :model="searchForm"
        label-width="120px"
      >
        <el-form-item label="玩家ID:" prop="uid">
          <el-input v-model.number="searchForm.uid" clearable size="mini" style="width: 240px" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="套餐名称:" prop="giftName">
          <el-input v-model="searchForm.giftName" clearable size="mini" style="width: 240px" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="人民币支付方式:" prop="valuePayType">
          <el-select v-model="searchForm.valuePayType" clearable size="mini" style="width: 240px" placeholder="请选择">
            <el-option v-for="item in payTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="取币类型:" prop="coinType">
          <el-select v-model="searchForm.coinType" clearable size="mini" style="width: 240px" placeholder="请选择">
            <el-option v-for="item in coinTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="收银员姓名:" prop="name">
          <el-input v-model="searchForm.name" clearable size="mini" style="width: 240px" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="订单状态:" prop="status">
          <el-select v-model="searchForm.status" style="width: 240px" clearable size="mini" placeholder="请选择">
            <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="购买时间:" prop="times">
          <el-date-picker
            v-model="searchForm.times"
            unlink-panels
            format="yyyy-MM-dd"
            style="width: 240px"
            value-format="yyyy-MM-dd HH:mm:ss"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            type="daterange"
            size="mini"
            placeholder="请输入变动时间"
            :default-time="['00:00:00', '23:59:59']"
            clearable
          ></el-date-picker>
        </el-form-item>
        <el-form-item label=" ">
          <el-button type="primary" size="mini" style="width: 120px" @click="search">查 询</el-button>
          <el-button size="mini" style="width: 120px; border-color: #4194fe; color: #4194fe" @click="reset">重 置 </el-button>
        </el-form-item>
      </el-form>
    </template>
    <div class="bc-title" style="margin: 20px 0">销售记录</div>
    <el-table
      :loading="loading"
      :data="tableData"
      style="width: 100%; flex: 1"
      :header-cell-style="{ backgroundColor: '#ffffff' }"
      :cell-style="{ backgroundColor: '#F0F2F5' }"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-table :data="props.row.orderGift" style="width: 100%" :header-cell-style="{ backgroundColor: 'rgb(242,242,242)' }">
            <el-table-column label="商品名称" prop="name" align="center" min-width="120"></el-table-column>
            <el-table-column label="市场价" prop="offValue" align="center" min-width="120">
              <template slot-scope="scope">
                <span>{{ scope.row.price | MIXIN_Points2Yuan | toFixed2 }}</span>
              </template>
            </el-table-column>
            <el-table-column label="销售数量" prop="count" align="center" min-width="120"></el-table-column>
            <el-table-column label="销售金额" prop="prizeName" align="center" min-width="120">
              <template slot-scope="scope">
                <span>{{ $calc.accMul(scope.row.price, scope.row.count) | MIXIN_Points2Yuan | toFixed2 }}</span>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column label="订单号" prop="orderId" align="center" min-width="140"></el-table-column>
      <el-table-column label="玩家ID" prop="uid" align="center" min-width="140"></el-table-column>
      <el-table-column label="套餐名称" prop="giftName" align="center" min-width="140"></el-table-column>
      <el-table-column label="下单时间" prop="time" align="center" min-width="160"></el-table-column>
      <el-table-column label="订单状态" prop="status" align="center" min-width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.status | formatStatus }}</span>
        </template>
      </el-table-column>
      <el-table-column label="应收金额" prop="offValueSum" align="center" min-width="120">
        <template slot-scope="scope">
          <span>{{ $calc.accAdd(scope.row.offValueSum, scope.row.cutRMB || 0) | MIXIN_Points2Yuan | toFixed2 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="应收积分" prop="coinValueSum" align="center" min-width="120">
        <template slot-scope="scope">
          <span>{{ $calc.accAdd(scope.row.coinValueSum, $calc.accMul(scope.row.cutRMB, 0.33)) | toFixed2 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="应收游戏币" prop="gameCoinSum" align="center" min-width="120"></el-table-column>
      <el-table-column label="已优惠金额" prop="cutRMB" align="center" min-width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.cutRMB || 0 | MIXIN_Points2Yuan | toFixed2 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="实收金额" align="center" min-width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.offValueSum | MIXIN_Points2Yuan | toFixed2 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="人民币支付方式" prop="valuePayType" align="center" min-width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.valuePayType | formatValuePayType }}</span>
        </template>
      </el-table-column>
      <el-table-column label="支付方式" prop="" align="center" min-width="120">
        <template slot-scope="scope">
          <span v-if="scope.row.orderPayType == 1">积分</span>
          <span v-else-if="scope.row.orderPayType == 2">人民币</span>
          <span v-else-if="scope.row.orderPayType == 3">游戏币</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="支付积分" prop="payCoin" align="center" min-width="120"></el-table-column>
      <el-table-column label="支付金额" prop="payValue" align="center" min-width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.payValue | MIXIN_Points2Yuan | toFixed2 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="支付游戏币" prop="payGameCoin" align="center" min-width="120"></el-table-column>
      <el-table-column label="取币类型" align="center" min-width="120">
        <template slot-scope="scope">
          <span>{{ formatCoinType(scope.row.coinType) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="收银员姓名" prop="name" align="center" min-width="120"></el-table-column>
      <el-table-column label="退单审核员" prop="auditor" align="center" min-width="120"></el-table-column>
      <el-table-column label="操作" v-if="!this.$store.state.offline" align="center" min-width="120">
        <template slot-scope="scope">
          <el-button type="text" @click="openAuthModal(scope.row)">退单</el-button>
          <el-button type="text" @click="printTicket(scope.row)">打印小票</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--导出以及分页部分-->
    <div class="flex-between" style="width: 100%; padding: 10px">
      <div></div>
      <el-pagination
        :page-size.sync="showNum"
        :current-page.sync="pageNum"
        @current-change="changePage"
        @size-change="changePage"
        background
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="count"
      ></el-pagination>
      <el-button type="primary" size="mini" icon="el-icon-document" :loading="loading" @click="exportXlSX">导出数据 </el-button>
    </div>
    <StaffAuth :show.sync="showAuthModal" @success="authSuccess"></StaffAuth>
  </div>
</template>

<script>
import exportTable from '@/utils/outputExcel'
import moment from 'moment'
import { to } from '@/utils/tools'
import StaffAuth from '../../../components/StaffAuth'
import { getToken } from '../../../utils/auth'

export default {
  name: 'store',
  components: {
    StaffAuth
  },
  data() {
    return {
      loading: false,
      statusList: [
        { label: '待支付', value: 0 },
        { label: '已支付', value: 1 },
        { label: '已退单', value: 2 }
      ],
      payTypeList: [
        { label: '未支付', value: 0 },
        { label: '微信', value: 1 },
        { label: '支付宝', value: 2 },
        { label: '现金', value: 3 },
        { label: '其他', value: 4 }
      ],
      coinTypeList: [
        { label: '实物币', value: 1 },
        { label: '电子币', value: 2 },
        { label: '人工取币', value: 3 }
      ],
      // 查询、翻页
      searchForm: {
        uid: '',
        giftName: '',
        valuePayType: '',
        name: '',
        status: '',
        coinType: '',
        times: []
      },
      options: [
        {
          value: '1',
          label: '是'
        },
        {
          value: '0',
          label: '否'
        }
      ],
      pageNum: 1,
      showNum: 10,
      count: 0,
      ticketHeight: 0,
      // 表格数据
      tableData: [],
      // 退单\授权
      currentOrder: {},
      showAuthModal: false
    }
  },
  filters: {
    toFixed2(val) {
      return val.toFixed(2)
    },
    formatStatus(val) {
      switch (val) {
        case 0:
          return '待支付'
        case 1:
          return '已支付'
        case 2:
          return '已退单'
        default:
          return '其他'
      }
    },
    formatValuePayType(type) {
      switch (type) {
        case 0:
          return '未支付'
        case 1:
          return '微信'
        case 2:
          return '支付宝'
        case 3:
          return '现金'
        default:
          return '其他'
      }
    }
  },
  async created() {
    if (this.$store.state.offline) {
      const db = await this.$db.openDB('offlineDB')
      this.tableData = await this.$db.cursorGetData(db, 'giftRecord')
    } else {
      this.getInfo()
    }
  },
  methods: {
    formatCoinType(val) {
      switch (val) {
        case 1:
          return '实物币'
        case 2:
          return '电子币'
        case 3:
          return '人工取币'
        default:
          return '-'
      }
    },
    getHeight(value) {
      this.ticketHeight += value || 25
      return this.ticketHeight
    },
    authSuccess(data) {
      this.backPrize(data)
    },
    openAuthModal(order) {
      this.currentOrder = order
      console.log(order)
      this.showAuthModal = true
    },
    backPrize(data) {
      this.loading = true
      this.$api
        .backCoinGift({ orderId: this.currentOrder.orderId, ...data })
        .then((res) => {
          this.printBackTicket()
          this.$message.success('退单成功')
          this.getInfo()
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 打印小票
    async printTicket(data) {
      console.log(data)
      if (!LODOP) {
        this.$message.error('未安装打印控件，请先安装控件后重新启动系统')
        return
      }
      const printFlag = Number(sessionStorage.getItem('printFlag'))
      if (printFlag) {
        let p
        if (this.$store.state.offline) {
          const db = await this.$db.openDB('offlineDB')
          const printInfo = await this.$db.getDataByIndex(db, 'printFormat', 'code', 'GIFT_SALE')
          if (printInfo) {
            p = printInfo
          }
        } else {
          const [err, res] = await to(this.$api.getStorePrint({ code: 'GIFT_SALE' }))
          if (res) {
            p = res.body.printInfo
          }
        }
        if (p.printFlag) {
          LODOP.PRINT_INIT('')
          // LODOP.ADD_PRINT_RECT(0, 0, 180, 240, 3, 1);
          LODOP.SET_PRINT_STYLE('FontSize', 8)
          LODOP.ADD_PRINT_TEXT(this.getHeight(), 0, 180, 25, p.title)
          LODOP.ADD_PRINT_TEXT(this.getHeight(), 0, 180, 25, p.theme)
          LODOP.ADD_PRINT_TEXT(this.getHeight(), 0, 180, 25, `订单编号：${data.orderId}`)
          LODOP.ADD_PRINT_TEXT(this.getHeight(), 0, 180, 25, `交易分店：${p.storeName}`)
          LODOP.ADD_PRINT_TEXT(this.getHeight(), 0, 180, 25, `========== 商品信息 =========`)
          LODOP.ADD_PRINT_TEXT(this.getHeight(), 0, 180, 25, `商品：${data.orderGift[0].name}`)
          LODOP.ADD_PRINT_TEXT(this.getHeight(), 0, 180, 25, `数量：${data.orderGift[0].count}`)
          LODOP.ADD_PRINT_TEXT(this.getHeight(), 0, 180, 25, `单价：￥${this.MIXIN_Points2Yuan(data.orderGift[0].price)}`)
          LODOP.ADD_PRINT_TEXT(
            this.getHeight(),
            0,
            180,
            25,
            `小计：￥${this.MIXIN_Points2Yuan(this.$calc.accMul(data.orderGift[0].price, data.orderGift[0].count))}`
          )
          LODOP.ADD_PRINT_TEXT(this.getHeight(), 0, 180, 25, `----------------------------`)
          LODOP.ADD_PRINT_TEXT(this.getHeight(), 0, 180, 25, `已优惠金额：￥${this.MIXIN_Points2Yuan(data.cutRMB)}`)
          LODOP.ADD_PRINT_TEXT(this.getHeight(), 0, 180, 25, `总计：￥${this.MIXIN_Points2Yuan(data.offValueSum)}`)
          LODOP.ADD_PRINT_TEXT(this.getHeight(), 0, 180, 25, `操作用户：${getToken()}`)
          LODOP.ADD_PRINT_TEXT(this.getHeight(), 0, 180, 25, `操作时间：${moment().format('YYYY-MM-DD HH:mm:ss')}`)
          LODOP.ADD_PRINT_TEXT(this.getHeight(), 0, 180, 25, p.endTheme)
          let codeInfoList = []
          if (data.codeInfoList) {
            codeInfoList = JSON.parse(data.codeInfoList)
          }
          if (codeInfoList.length && (data.orderGift[0].type === 2 || data.orderGift[0].type === 3)) {
            codeInfoList.forEach((item, index) => {
              const h = index === 0 ? 0 : 150
              const qrcode = `${process.env.VUE_APP_CASHPAGEJUMP}?codeType=${item.codeType}&uid=${item.uid}&couponsCode=${item.code}&pageType=verification`
              LODOP.ADD_PRINT_BARCODE(this.getHeight(h), 25, 170, 170, 'QRCode', qrcode)
              LODOP.SET_PRINT_STYLEA(0, 'QRCodeVersion', 7)
            })
          }
          // LODOP.PRINT_DESIGN()
          // LODOP.PREVIEW()
          LODOP.PRINT()
          this.ticketHeight = 0
        } else {
          this.$message.error('小票格式未定义，无法打印')
        }
      }
    },
    // 退单打印小票
    printBackTicket(callback) {
      if (!LODOP) {
        this.$message.error('未安装打印控件，请先安装控件后重新启动系统')
        return
      }
      const printFlag = +sessionStorage.getItem('printFlag')
      if (printFlag) {
        this.$api.getStorePrint({ code: 'GIFT_BACK' }).then(async (res) => {
          const p = res.body.printInfo
          if (p.printFlag) {
            LODOP.PRINT_INIT('')
            // LODOP.ADD_PRINT_RECT(0, 0, 180, 240, 3, 1);
            LODOP.SET_PRINT_STYLE('FontSize', 8)
            LODOP.ADD_PRINT_TEXT(this.getHeight(), 0, 180, 25, p.title)
            LODOP.ADD_PRINT_TEXT(this.getHeight(), 0, 180, 25, p.theme)
            LODOP.ADD_PRINT_TEXT(this.getHeight(), 0, 180, 25, `交易分店：${p.storeName}`)
            LODOP.ADD_PRINT_TEXT(this.getHeight(), 0, 180, 25, `========== 商品信息 =========`)
            LODOP.ADD_PRINT_TEXT(this.getHeight(), 0, 180, 25, `订单号：${this.currentOrder.orderId}`)
            LODOP.ADD_PRINT_TEXT(this.getHeight(), 0, 180, 25, `退单名称：${this.currentOrder.giftName}`)
            LODOP.ADD_PRINT_TEXT(this.getHeight(), 0, 180, 25, `数量：${this.currentOrder.orderGift[0].count}`)
            LODOP.ADD_PRINT_TEXT(this.getHeight(), 0, 180, 25, `小计：￥${this.MIXIN_Points2Yuan(this.currentOrder.offValueSum)}`)
            LODOP.ADD_PRINT_TEXT(this.getHeight(), 0, 180, 25, `操作用户：${getToken()}`)
            LODOP.ADD_PRINT_TEXT(this.getHeight(), 0, 180, 25, `操作时间：${moment().format('YYYY-MM-DD HH:mm:ss')}`)
            LODOP.ADD_PRINT_TEXT(this.getHeight(), 0, 180, 25, p.endTheme)
            LODOP.PRINT()
            this.ticketHeight = 0
            callback && callback()
          } else {
            callback && callback()
          }
        })
      }
    },
    reset() {
      this.$refs.searchForm.resetFields()
      this.pageNum = 1
      this.getInfo()
    },
    search() {
      this.pageNum = 1
      this.getInfo()
    },
    // 翻页
    changePage(val) {
      this.getInfo()
    },
    getInfo() {
      // 默认参数
      const params = { ...this.searchForm }
      if (params.times && params.times.length) {
        params.startTime = params.times[0]
        params.endTime = params.times[1]
      } else {
        params.startTime = ''
        params.endTime = ''
      }
      delete params.times
      params.pageNum = this.pageNum
      params.showNum = this.showNum
      this.loading = true
      this.$api
        .getGiftOrder(params)
        .then((res) => {
          this.tableData = res.body.items
          this.count = res.body.count
        })
        .finally((result) => {
          this.loading = false
        })
    },
    getOrderStatus(status) {
      switch (status) {
        case 0:
          return '待支付'
        case 1:
          return '已支付'
        case 2:
          return '已退单'
        default:
          return '其他支付'
      }
    },
    getValuePayType(type) {
      switch (type) {
        case 0:
          return '未支付'
        case 1:
          return '微信'
        case 2:
          return '支付宝'
        case 3:
          return '现金'
        default:
          return '其他'
      }
    },
    // 导出表格
    exportXlSX() {
      this.loading = true
      const params = { ...this.searchForm }
      if (params.times && params.times.length) {
        params.startTime = params.times[0]
        params.endTime = params.times[1]
      } else {
        params.startTime = ''
        params.endTime = ''
      }
      delete params.times
      params.pageNum = 1
      params.showNum = this.count
      this.$api.getGiftOrder(params).then(
        (res) => {
          const valuePayTypeList = ['未支付', '微信', '支付宝', '现金', '其他']
          const orderPayType = ['-', '积分', '人民币', '游戏币']
          const data = res.body.items.map((val) => {
            return [
              val.orderId.toString(),
              val.uid,
              val.giftName,
              val.time,
              this.getOrderStatus(val.status),
              this.MIXIN_Points2Yuan(this.$calc.Subtr(val.offValueSum, val.cutRMB || 0)),
              this.$calc.accAdd(val.coinValueSum, this.$calc.accMul(val.cutRMB, 0.33)),
              val.gameCoinSum,
              this.MIXIN_Points2Yuan(val.cutRMB),
              this.MIXIN_Points2Yuan(val.offValueSum),
              valuePayTypeList[val.valuePayType],
              orderPayType[val.orderPayType],
              val.payCoin,
              this.MIXIN_Points2Yuan(val.payValue),
              val.payGameCoin,
              this.formatCoinType(val.coinType),
              val.name,
              val.auditor
            ]
          })
          const tHeader = [
            '订单号',
            '玩家ID',
            '套餐名称',
            '下单时间',
            '订单状态',
            '应收金额',
            '应收积分',
            '应收游戏币',
            '已优惠金额',
            '实收金额',
            '人民币支付方式',
            '支付方式',
            '支付积分',
            '支付金额',
            '支付游戏币',
            '取币类型',
            '收银员姓名',
            '退单审核员'
          ]
          exportTable(tHeader, data, '套餐销售记录').then(() => {
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

.store-manage {
  padding: 20px;

  .list-container {
    padding: 20px;
  }

  .total-content {
    margin: 0;
    padding: 20px;
  }

  .pagenation-box {
    padding: 20px;
    @include flex(space-between, center, row);
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
    }
  }
}
</style>
