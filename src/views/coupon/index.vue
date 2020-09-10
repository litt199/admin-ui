<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="99px">
      <el-form-item label="优惠券类型：" prop="type" class="coupon">
        <el-select v-model="queryParams.type" placeholder="请选择优惠券类型" clearable size="small">
          <el-option label="代金券" value="1" />
          <el-option label="折扣券" value="2" />
          <el-option label="优惠券" value="3" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['coupon:coupon:add']"
        >新增</el-button>
      </el-col>
      <!--<el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['coupon:coupon:edit']"
        >修改</el-button>
      </el-col>-->
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['coupon:coupon:remove']"
        >删除</el-button>
      </el-col>
      <!--<el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['coupon:coupon:export']"
        >导出</el-button>
      </el-col>-->
    </el-row>

    <el-table v-loading="loading" :data="couponList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="名称" align="center" prop="name" />
      <el-table-column label="优惠券类型" align="center" prop="type" />
      <el-table-column label="面值/折扣" align="center" prop="faceValue" />
      <el-table-column label="限制金额(0表示无限制)" align="center" prop="limitValue" />
      <el-table-column label="有效期时长/天" align="center" prop="validPeriod" />
      <el-table-column label="描述" align="center" prop="detail" />
      <el-table-column label="发放方式" align="center" prop="giveMethod" />
      <el-table-column label="状态" align="center" prop="status" />
      <el-table-column label="创建时间" align="center" prop="createDate" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['coupon:coupon:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['coupon:coupon:remove']"
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

    <!-- 添加或修改优惠券和代金券对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="110px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="优惠券类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择优惠券类型" style="width:350px;">
            <el-option label="代金券" value="1" />
            <el-option label="折扣券" value="2" />
            <el-option label="优惠券" value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="面值/折扣" prop="faceValue">
          <el-input v-model="form.faceValue" placeholder="请输入面值，或者折扣" maxlength="10" oninput="value=value.match(/\d+(\.\d{0,2})?/) ? value.match(/\d+(\.\d{0,2})?/)[0] : ''" />
        </el-form-item>
        <el-form-item label="限制金额" prop="limitValue">
          <el-input v-model="form.limitValue" placeholder="请输入限制金额，0表示无限制" oninput="value= value.match(/\d+(\.\d{0,2})?/) ? value.match(/\d+(\.\d{0,2})?/)[0] : ''"  maxlength="10"/>
        </el-form-item>
        <el-form-item label="有效期时长/天" prop="validPeriod">
          <el-input v-model="form.validPeriod" placeholder="请输入有效期时长/天" onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))" maxlength="4"/>
        </el-form-item>
        <el-form-item label="描述" prop="detail">
          <el-input v-model="form.detail" placeholder="请输入描述" />
        </el-form-item>
        <el-form-item label="发放方式" prop="giveMethod">
          <el-select v-model="form.giveMethod" placeholder="请选择状态" style="width:350px;">
            <el-option label="注册发放" value="1"/>
            <el-option label="手工" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择状态" style="width:350px;">
            <el-option label="正常" value="0"/>
            <el-option label="下线" value="1" />
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
import { listCoupon, getCoupon, delCoupon, addCoupon, updateCoupon, exportCoupon } from "@/api/coupon";

export default {
  name: "Coupon",
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
      // 优惠券和代金券表格数据
      couponList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        type: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        name: [
          { required: true, message: "名称不能为空", trigger: "blur" }
        ],
        faceValue:[
          { required: true, message: "面值/折扣不能为空", trigger: "blur" }
        ],
        type: [
          { required: true, message: "优惠券类型不能为空",trigger:'blur'}
        ],
        limitValue: [
          { required: true, message: "限制金额，0表示无限制不能为空", trigger: "blur" }
        ],
        validPeriod: [
          { required: true, message: "有效期时长/天,不能为空", trigger: "blur" }
        ],
        status: [
          { required: true, message: "状态不能为空", trigger:'blur'}
        ],
        giveMethod:[
          { required: true, message: "发放方式不能为空", trigger:'blur'}
        ],
      },
      isSubmit:false
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询优惠券和代金券列表 */
    getList() {
      this.couponList=[];
      this.loading = true;
      listCoupon(this.queryParams).then(response => {
        response.rows.forEach((value,index)=>{
          if(value.type===1){value.type="代金券"}else if(value.type===2){value.type="折扣券"}else{value.type="优惠券"}
          if(value.status===0){value.status="正常"}else if(value.status===1){value.status="下线"}
          if(value.giveMethod===1){value.giveMethod="注册发放"}else if(value.giveMethod===2){value.giveMethod="手工"}
          this.couponList.push(value);
        })
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
        name: undefined,
        type: undefined,
        faceValue: undefined,
        limitValue: undefined,
        validPeriod: undefined,
        detail: undefined,
        giveMethod: undefined,
        status: undefined,
        delFlag: undefined,
        createDate: undefined
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
      this.title = "添加优惠券和代金券";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getCoupon(id).then(response => {
        let value = response.data;
        if(value.type===1){value.type="代金券"}else if(value.type===2){value.type="折扣券"}else{value.type="优惠券"}
        if(value.status===0){value.status="正常"}else if(value.status===1){value.status="下线"}
        if(value.giveMethod===1){value.giveMethod="注册发放"}else if(value.giveMethod===2){value.giveMethod="手工"}
        this.form = value;
        this.open = true;
        this.title = "修改优惠券和代金券";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            var params = this.form;
            if(params.type=="代金券"){params.type=1}else if(params.type=="折扣券"){params.type=2}else if(params.type=="优惠券"){params.type=3}
            if(params.status=="正常"){params.status=0}else if(params.status=="下线"){params.status=1}
            if(params.giveMethod=="注册发放"){params.giveMethod=1}else if(params.giveMethod=="手工"){params.giveMethod=2}
            updateCoupon(params).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            // console.log(that.isSubmit)
            if(!this.isSubmit){
              this.isSubmit = true
              console.log('313'+this.isSubmit)
              addCoupon(this.form).then(response => {
                if (response.code === 200) {
                 console.log('执行了几次')
                  this.msgSuccess("新增成功");
                  this.open = false;
                  setTimeout(()=>{
                    this.isSubmit=false;
                  },500)
                  this.getList();
                }
              }); 
             }
            }
          }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm(this.ids.length===0?'确定删除此代金券吗？':'确定删除'+this.ids.length+'条代金券吗？', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delCoupon(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有优惠券和代金券数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportCoupon(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
<style>
.coupon.el-form-item__label{

}
</style>>
