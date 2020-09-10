<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="用户昵称" prop="nickName">
        <el-input
          v-model="queryParams.nickName"
          placeholder="请输入用户昵称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!--<el-form-item label="商品名称" prop="goodsName">
        <el-input
          v-model="queryParams.goodsName"
          placeholder="请输入商品名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>-->
      <!--<el-form-item label="取回时间" prop="retrieveTime">
        <el-date-picker clearable size="small" style="width: 200px"
          v-model="queryParams.retrieveTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择取回装备时间">
        </el-date-picker>
      </el-form-item>-->
      <el-form-item label="取回时间" prop="dateRange">
        <el-date-picker
          v-model="dateRange"
          size="small"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <div style="position: absolute;top: 30px;right: 70px;font-size: 20px;">累计兑换数量：{{sumNum}}，商品总金额：{{sumAmount}}$</div>


    <el-table v-loading="loading" :data="goodsExchangeList">
      <el-table-column type="text" width="55" align="center" />
      <el-table-column label="头像" align="center">
        <template slot-scope="scope">
          <img :src="(scope.row.avatar===null||scope.row.avatar===''||scope.row.avatar==='img')?imgAvatar:scope.row.avatar" alt="" class="imgAvatar">
        </template>
      </el-table-column>
      <el-table-column label="昵称" align="center" prop="nickName" />
      <el-table-column label="商品" align="center">
        <template slot-scope="scope">
          <img class="scope_img" :src="scope.row.goodsPicture" alt="">
          <p>{{scope.row.goodsName}}</p>
        </template>
      </el-table-column>
      <el-table-column label="商品价格" align="center" prop="goodsPrice" />
      <el-table-column label="交易地址" align="center" prop="transactionUrl" />
      <el-table-column label="取回时间" align="center" prop="retrieveTime" width="180">
        <template slot-scope="scope">
          <span>{{scope.row.retrieveTime}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
            <el-button type="primary"  @click="handleUpdate(scope.row)">发货</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改兑换对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body class="exchange">
      <el-form ref="form" label-width="80px">
        <el-form-item label="成本价">
          <el-input v-model="confirmExchangeRes.deliverGoodsCostPrice" placeholder="请输入成本价"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmExchange(confirmExchangeRes.deliverGoodsCostPrice)">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listGoodsExchange, getGoodsExchange, delGoodsExchange, addGoodsExchange, updateGoodsExchange, exportGoodsExchange,goodsDeliverGoods } from "@/api/goodsMgr/goodsExchange";

export default {
  name: "GoodsExchange",
  data() {
    return {
      //开箱统计时间查询
      searchTime:"",
      dateRange:"",
      //sumAmount商品总金额
      sumAmount:0,
      //累计取回数量
      sumNum:0,
      //默认头像
      imgAvatar:require("../../../assets/headerImg/logo_icon.png"),
        //选择
       options: [{
          value: '0',
          label: '不是'
        }, {
          value: '1',
          label: '是'
        }],
        value: '',
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 兑换表格数据
      goodsExchangeList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userId: undefined,
        boxId: undefined,
        goodsId: undefined,
        goodsState: undefined,
        deliveryAddress: undefined,
        retrieveTime: undefined,
        deliverGoodsTime: undefined,
        deliverGoodsCostPrice: undefined,
        steamRechargeCode: undefined,
        luckyFlag: undefined,
        anchorUserId: undefined,
        voluntarilyPay: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      },
      //兑换参数
      confirmExchangeRes:{
        "id":null,
        "deliverGoodsCostPrice":undefined
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /**兑换商品**/
    confirmExchange(row){
      this.confirmExchangeRes.deliverGoodsCostPrice = row
      console.log(this.confirmExchangeRes)
      goodsDeliverGoods(this.confirmExchangeRes).then(res=>{
        if(res.code===0){
          this.open = false;
          this.msgSuccess("发货成功！");
          this.getList()
        }
      })
    },
    /** 查询兑换列表 */
    getList() {
      this.loading = true;
      if(this.dateRange){
        this.searchTime = this.dateRange[0] +' 00:00:00'+' - ' + this.dateRange[1] + ' 00:00:00'
      }else{
        this.searchTime=""
      }
      this.queryParams.searchTime=this.searchTime;
      listGoodsExchange(this.queryParams).then(response => {
        console.log("------------------------------goodsExchangeList")
        console.log(response.rows)
        this.sumAmount = response.sumAmount
        console.log(this.sumAmount)
        this.sumNum=response.total
        this.goodsExchangeList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        userId: undefined,
        boxId: undefined,
        goodsId: undefined,
        createTime: undefined,
        delFlag: undefined,
        goodsState: undefined,
        deliveryAddress: undefined,
        retrieveTime: undefined,
        deliverGoodsTime: undefined,
        deliverGoodsCostPrice: undefined,
        steamRechargeCode: undefined,
        luckyFlag: undefined,
        anchorUserId: undefined,
        voluntarilyPay: undefined
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      console.log(this.queryParams)
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange="";
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加兑换";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.confirmExchangeRes.id = row.id;
      const id = row.id || this.ids
      getGoodsExchange(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改兑换";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateGoodsExchange(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addGoodsExchange(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              }
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除兑换编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delGoodsExchange(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有兑换数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportGoodsExchange(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
<style scoped>
.scope_img{
  width: 100px;
  display: inline-block;
}
.imgAvatar{
  width: 80px;
}
</style>
<style>
.exchange div.el-dialog{
  margin-top: 30vh !important;
}
</style>