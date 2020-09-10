<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <!--<el-form-item label="中奖情况" prop="status">
        <el-select v-model="queryParams.isWin" placeholder="请选择中奖情况" clearable size="small">
            <el-option label="中奖" value="0" />
            <el-option label="未中奖" value="1" />
        </el-select>
      </el-form-item>-->
      <el-form-item label="用户昵称" prop="nickName">
        <el-input
          v-model="queryParams.nickName"
          placeholder="请输入用户昵称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="开启时间"> 
        <el-date-picker
          v-model="daterange"
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
    <el-table v-loading="loading" :data="recordList">
      <el-table-column type="text" width="55" align="center" />
      <el-table-column label="头像" align="center" prop="avatar">
        <template slot-scope="scope">
          <img :src="(scope.row.avatar===null||scope.row.avatar===''||scope.row.avatar==='img')?imgAvatar:scope.row.avatar" alt="" class="imgAvatar"> 
        </template>
      </el-table-column>
      <el-table-column label="昵称" align="center" prop="nickName" />
      <el-table-column label="奖品" align="center" >
        <template slot-scope="scope">
          <img class="scope_img" :src="scope.row.goodsPicture" alt="" v-show="scope.row.goodsName">
          <p>{{scope.row.goodsName}}</p>
        </template>
      </el-table-column>
      <el-table-column label="奖金" align="center" prop="money" />
      <el-table-column label="参与时间" align="center" prop="createDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createDate, '{y}-{m}-{d}') }}</span>
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
  </div>
</template>

<script>
import { listRecord, getRecord, delRecord, addRecord, updateRecord, exportRecord } from "@/api/everyRecord";

export default {
  name: "Record",
  data() {
    return {
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
      // 每日免费参与记录表格数据
      recordList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      //日期范围
      daterange:"",
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        edId: undefined,
        goodsId: undefined,
        money: undefined,
        userId: undefined,
        openDay: undefined,
        createDate: undefined,
        status:undefined,
        nikeName:undefined,
        isWin:undefined,
        beginTime:undefined,
        endTime:undefined,
      },

      // 表单参数
      form: {},
      // 表单校验
      rules: {}
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询每日免费参与记录列表 */
    getList() {
      this.loading = true;
      if(this.daterange===undefined){
          this.queryParams.beginTime=undefined;
          this.queryParams.endTime=undefined;
      }else{
          this.queryParams.beginTime=this.daterange[0];
          this.queryParams.endTime=this.daterange[1];
      }

      listRecord(this.queryParams).then(response => {
        this.recordList = response.rows;
        console.log(response.rows)
        // this.recordList.forEach((value,index)=>{
        //   if(value.goodsName!=null){
        //     this.recordList[index].money="参与奖";
        //     this.recordList[index].goodsName="参与奖"
        //   }
        // })
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
        nickName: undefined,
        id: undefined,
        edId: undefined,
        goodsId: undefined,
        money: undefined,
        userId: undefined,
        openDay: undefined,
        createDate: undefined,
        status:undefined,
        nikeName:undefined,
        isWin:undefined,
        beginTime:undefined,
        endTime:undefined,
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
      this.daterange=undefined;
      this.queryParams.isWin=undefined;
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
      this.title = "添加每日免费参与记录";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getRecord(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改每日免费参与记录";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateRecord(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addRecord(this.form).then(response => {
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
      this.$confirm('是否确认删除每日免费参与记录编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delRecord(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有每日免费参与记录数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportRecord(queryParams);
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
}
.imgAvatar{
  display: inline-block;
  width: 80px;
}
</style>
