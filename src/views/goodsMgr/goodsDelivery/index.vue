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
    
   
      <el-form-item label="取回时间" prop="retrieveTime">
        <el-date-picker clearable size="small" style="width: 200px"
          v-model="queryParams.retrieveTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择取回装备时间">
        </el-date-picker>
      </el-form-item>
  
   
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    

    <el-table v-loading="loading" :data="goodsDeliveryList">
      <el-table-column type="text" width="55" align="center" />
      <el-table-column label="头像" align="center" prop="avatar" />
      <el-table-column label="昵称" align="center" prop="nickName" />
      <el-table-column label="箱子" align="center">
        <template slot-scope="scope">
          <img class="scope_img" :src="scope.row.boxPicture" alt="">
          <span>{{scope.row.boxName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品" align="center">
        <template slot-scope="scope">
          <img class="scope_img" :src="scope.row.goodsPicture" alt="">
          <span>{{scope.row.goodsName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品价格" align="center" prop="goodsPrice" />
      <el-table-column label="交易地址" align="center" prop="transactionUrl" />
      <el-table-column label="取回装备时间" align="center" prop="retrieveTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.retrieveTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <!--<el-table-column label="发货时间" align="center" prop="deliverGoodsTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.deliverGoodsTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发货成本价" align="center" prop="deliverGoodsCostPrice" />
      <el-table-column label="steam充值码" align="center" prop="steamRechargeCode" />
      <el-table-column label="是否星会员每日免费获得；0=不是；1=是" align="center" prop="luckyFlag" />
      <el-table-column label="箱子所属主播用户id" align="center" prop="anchorUserId" />
      <el-table-column label="自动发货购买标记" align="center" prop="voluntarilyPay" />-->
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

    <!-- 添加或修改待发货对话框 -->
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
import { listGoodsDelivery, getGoodsDelivery, delGoodsDelivery, addGoodsDelivery, updateGoodsDelivery, exportGoodsDelivery } from "@/api/goodsMgr/goodsDelivery";
import { goodsDeliverGoods } from "@/api/goodsMgr/goodsExchange";

export default {
  name: "GoodsDelivery",
  data() {
    return {
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
      // 待发货表格数据
      goodsDeliveryList: [],
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
    /** 查询待发货列表 */
    getList() {
      this.loading = true;
      listGoodsDelivery(this.queryParams).then(response => {
        console.log("----------------------------goodsDeliveryList待发货列表")
        console.log(response.rows)
        this.goodsDeliveryList = response.rows;
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
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
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
      this.title = "添加待发货";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.confirmExchangeRes.id = row.id;
      const id = row.id || this.ids
      getGoodsDelivery(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改待发货";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateGoodsDelivery(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addGoodsDelivery(this.form).then(response => {
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
      this.$confirm('是否确认删除待发货编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delGoodsDelivery(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有待发货数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportGoodsDelivery(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
<style scoped>
.scope_img{
  width: 146px;
  display: block;
}
</style>
<style>
.exchange div.el-dialog{
  margin-top: 30vh !important;
}
</style>