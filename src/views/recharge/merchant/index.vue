<template>
  <div class="app-container">
    <!--<el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>-->

   <!--  <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['recharge:merchant:add']"
        >新增</el-button>
      </el-col>
     <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['recharge:merchant:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['recharge:merchant:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['recharge:merchant:export']"
        >导出</el-button>
      </el-col>
    </el-row>-->

    <el-table v-loading="loading" :data="merchantList">
      <el-table-column type="text" width="55" align="center" />
      <el-table-column label="支付方式" align="center" prop="paymentMethod" />
      <el-table-column label="状态" align="center" prop="status" />
      <el-table-column label="商户号" align="center" prop="merchantNumber" />
      <el-table-column label="秘钥key" align="center" prop="secretKey" />
      <el-table-column label="支付接口地址" align="center" prop="paymentInterfaceUrl" />
      <el-table-column label="支付回调通知接口地址" align="center" prop="paymentNotifyUrl"  />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['recharge:merchant:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['recharge:merchant:remove']"
          >删除</el-button>
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

    <!-- 添加或修改支付接口对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body class="merchant">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="支付方式" prop="paymentMethod">
          <el-input v-model="form.paymentMethod" placeholder="请输入支付方式" />
        </el-form-item>
        <el-form-item label="支付接口地址" prop="paymentInterfaceUrl">
          <el-input v-model="form.paymentInterfaceUrl" placeholder="请输入支付接口地址" />
        </el-form-item>
        <el-form-item label="支付回调通知接口地址" prop="paymentNotifyUrl" class="callback">
          <el-input v-model="form.paymentNotifyUrl" placeholder="请输入支付回调通知接口地址" />
        </el-form-item>
        <el-form-item label="商户号" prop="merchantNumber">
          <el-input v-model="form.merchantNumber" placeholder="请输入商户号" />
        </el-form-item>
        <el-form-item label="秘钥key" prop="secretKey">
          <el-input v-model="form.secretKey" placeholder="请输入秘钥key" />
        </el-form-item>
        <el-form-item label="状态" prop="type" class="status">
          <el-select v-model="form.status" placeholder="请选择状态" clearable size="small">
            <el-option label="启用" value="0" />
            <el-option label="关闭" value="1" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { listMerchant, getMerchant, delMerchant, addMerchant, updateMerchant, exportMerchant } from "@/api/merchant";

  export default {
    name: "Merchant",
    data() {
      return {
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
        // 支付接口表格数据
        merchantList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {
        }
      };
    },
    created() {
      this.getList();
    },
    methods: {
      /** 查询支付接口列表 */
      getList() {
        this.merchantList = []
        this.loading = true;
        listMerchant(this.queryParams).then(response => {
          console.log("------------------------this.merchantList")
          console.log(response.rows)
          response.rows.forEach((value,index)=>{
          if(value.status===0){value.status="启用"}else if(value.status===1){value.status="关闭"}
          this.merchantList.push(value);
        })
          // this.merchantList = response.rows;
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
          paymentMethod: undefined,
          paymentMethodIcon: undefined,
          paymentInterfaceUrl: undefined,
          paymentNotifyUrl: undefined,
          merchantNumber: undefined,
          secretKey: undefined,
          createTime: undefined,
          delFlag: undefined,
          status: "0"
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
        this.title = "添加支付接口";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const id = row.id || this.ids
        getMerchant(id).then(response => {
          let value = response.data;
          if(value.status===0){value.status="启用"}else if(value.status===1){value.status="关闭"}
          this.form = value;
          this.open = true;
          this.title = "修改支付接口";
        });
      },
      /** 提交按钮 */
      submitForm: function() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.id != undefined) {
              var params = this.form;
              if(params.status=="启用"){params.status=0}else if(params.status=="关闭"){params.status=1}
              updateMerchant(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess("修改成功");
                  this.open = false;
                  this.getList();
                }
              });
            } else {
              addMerchant(this.form).then(response => {
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
        this.$confirm('是否确认删除支付接口编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delMerchant(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
      },
      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams;
        this.$confirm('是否确认导出所有支付接口数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportMerchant(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
      }
    }
  };
</script>
<style>
.merchant .el-form-item--medium .el-form-item__label{
  line-height: 36px;
  text-align: right;
}

.merchant .el-form-item.callback.el-form-item--medium .el-form-item__label{
  line-height: 18px!important;
}
</style>
