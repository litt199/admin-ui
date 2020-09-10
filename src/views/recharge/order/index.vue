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
      <el-form-item label="创建时间" prop="createDate">
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
      <!--<el-form-item label="充值方式" prop="rechargeMode">
        <el-input
          v-model="queryParams.rechargeMode"
          placeholder="请输入充值方式"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>-->
      <el-form-item label="充值方式" prop="type" class="rechargeMode">
          <el-select v-model="queryParams.rechargeMode" placeholder="请选择充值方式" clearable size="small">
            <el-option label="微信" value="微信" />
            <el-option label="支付宝" value="支付宝" />
          </el-select>
        </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="sumAmountC">累计充值：{{sumAmount}}$</div>



    <el-table v-loading="loading" :data="orderList">
      <el-table-column type="text" width="55" align="center" />
      <el-table-column label="头像" align="center">
        <template slot-scope="scope">
          <img :src="(scope.row.avatar===null||scope.row.avatar===''||scope.row.avatar==='img')?imgAvatar:scope.row.avatar" alt="" class="imgAvatar">
        </template>
      </el-table-column>
      <el-table-column label="昵称" align="center" prop="nickName" />
      <el-table-column label="金额" align="center" prop="amount" />
      <el-table-column label="交易类型" align="center" prop="type" />
      <el-table-column label="支付方式" align="center" prop="rechargeMode" />
      <el-table-column label="账户余额" align="center" prop="currentMoney" />
      <el-table-column label="充值时间" align="center" prop="createDate" />
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改用户充值消费记录对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { listOrder, getOrder, delOrder, addOrder, updateOrder, exportOrder } from "@/api/order";

  export default {
    name: "Order",
    data() {
      return {
        sumAmount:0,//累计充值
        //默认头像
        imgAvatar:require("../../../assets/headerImg/logo_icon.png"),
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
        // 用户充值消费记录表格数据
        orderList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          userId: undefined,
          type: undefined,
          createDate: undefined,
          rechargeMode: undefined,
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {
          userId: [
            { required: true, message: "用户ID不能为空", trigger: "blur" }
          ],
          amount: [
            { required: true, message: "充值或消费金额不能为空", trigger: "blur" }
          ],
        },
        //开箱统计时间查询
        searchTime:"",
        dateRange:""

      };
    },
    created() {
      this.getList();
    },
    methods: {
      /** 查询用户充值消费记录列表 */
      getList() {
        this.loading = true;
        if(this.dateRange){
          this.searchTime = this.dateRange[0] +' 00:00:00'+' - ' + this.dateRange[1] + ' 00:00:00'
        }else{
          this.searchTime = "";
        }
        this.queryParams.searchTime=this.searchTime;
        listOrder(this.queryParams).then(response => {
          console.log("--------------------------------this.orderList")
          console.log(response.rows)
          this.orderList = response.rows;
          this.sumAmount = response.sumAmount
          console.log(this.sumAmount)
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
          amountRecordId: undefined,
          userId: undefined,
          userGoodsId: undefined,
          amount: undefined,
          type: undefined,
          createDate: undefined,
          rechargeMode: undefined,
          currentMoney: undefined,
          extensionCode: undefined,
          adminUserId: undefined
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
        this.dateRange="";
        this.queryParams.rechargeMode = undefined;
        this.resetForm("queryForm");
        this.handleQuery();
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.amountRecordId)
        this.single = selection.length!=1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = "添加用户充值消费记录";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const amountRecordId = row.amountRecordId || this.ids
        getOrder(amountRecordId).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = "修改用户充值消费记录";
        });
      },
      /** 提交按钮 */
      submitForm: function() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.amountRecordId != undefined) {
              updateOrder(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess("修改成功");
                  this.open = false;
                  this.getList();
                }
              });
            } else {
              addOrder(this.form).then(response => {
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
        const amountRecordIds = row.amountRecordId || this.ids;
        this.$confirm('是否确认删除用户充值消费记录编号为"' + amountRecordIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delOrder(amountRecordIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
      },
      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams;
        this.$confirm('是否确认导出所有用户充值消费记录数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportOrder(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
      }
    }
  };
</script>
<style scoped>
.imgAvatar{
  width: 80px;
}
.sumAmountC{
    color: red;
    position: absolute;
    top: 36px;
    right: 70px;
    font-weight: bold;
    font-size: 20px;

}
</style>>
