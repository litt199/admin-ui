<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="昵称" prop="nickName">
        <el-input
          v-model="queryParams.nickName"
          placeholder="请输入昵称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="注册时间">
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
    <el-table v-loading="loading" :data="userList">
      <el-table-column type="text" width="55" align="center" />
      <el-table-column label="头像" align="center" width="200">
        <template slot-scope="scope">
          <img :src="(scope.row.avatar===null||scope.row.avatar===''||scope.row.avatar==='img')?imgAvatar:scope.row.avatar" alt="" class="imgAvatar">
        </template>
      </el-table-column>
      <el-table-column label="昵称" align="center" prop="nickName" width="200" />
      <el-table-column label="总金额" align="center" prop="moneyFirstAll"  width="200"/>
      <el-table-column label="剩余金额" align="center" prop="moneyFirstLeft" width="200" />
      <el-table-column label="创建时间" align="center" prop="createDate" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="500">
        <template slot-scope="scope">
          <el-button
            @click="viewPackage(scope.row)"
          >查看包裹</el-button>
          <el-button
            @click="viewCound(scope.row)"
          >查看优惠券</el-button>
          <el-button
            type="success"
            @click="modifyMoney(scope.row)"
            v-hasPermi="['user:user:edit']"
          >修改金额</el-button>
          <el-button
            type="danger"
            @click="enableUser(scope.row)"
            v-show="scope.row.delFlag===0"
          >禁用</el-button>
          <el-button
            type="warning"
            @click="enableUser(scope.row)"
            v-show="scope.row.delFlag===1"
          >启用</el-button>
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
    <!-- 查看包裹-->
    <el-dialog :title="title" :visible.sync="openPackage" width="1200px" append-to-body class="viewPackage">
      <el-form ref="packageFrom" :model="packageQuery" :rules="rules" label-width="68px" >
        <!--<el-form-item label="商品名称" prop="goodsName">
          <el-input
            v-model="packageQuery.goodsName"
            placeholder="请输入商品名称"
            clearable
            size="small"
            @keyup.enter.native="handleQueryPackage"
          />
        </el-form-item>-->
        <el-form-item label="商品状态" style="white-space:nowrap">
          <el-select v-model="packageQuery.goodsState" placeholder="请选择">
            <el-option
              v-for="item in packageStatus"
              :key="item.index"
              :label="item.goodsState"
              :value="item.status">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item  class="viewPackageSearch">
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQueryPackage(1)">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQueryPackage(1)">重置</el-button>
        </el-form-item>
      </el-form>
     <el-table v-loading="loading" :data="packageList">
      <el-table-column type="text" width="55" align="center" />
        <el-table-column label="商品名称" align="center" prop="goodsName" />
        <el-table-column label="商品图片" align="center" prop="goodsPicture">
          <template slot-scope="scope">
            <img class="scope_img" :src="scope.row.goodsPicture" alt="">
          </template>
        </el-table-column>
        <el-table-column label="商品价格" align="center" prop="goodsPrice" />
        <el-table-column label="商品状态" align="center" prop="goodsState" />
      </el-table>
      <pagination
        v-show="totalPackage>0"
        :total="totalPackage"
        :pageSize="packageQuery.pageSize"
        :page.sync="packageQuery.pageNum"
        :limit.sync="packageQuery.pageSize"
        @pagination="viewPackage(1)"
      />
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="closePackage">确 定</el-button>
      </div>
    </el-dialog>



    <!-- 查看优惠券-->
    <el-dialog :title="title" :visible.sync="openCound" width="1200px" append-to-body class="viewCound">
      <el-form ref="coundFrom" :model="coundQuery" :rules="rules" label-width="68px" >
        <el-form-item label="使用状态" style="white-space:nowrap">
        <el-select v-model="coundQuery.usedFlag" placeholder="请选择使用状态" clearable size="small">
            <el-option label="未使用" value="0" />
            <el-option label="已使用" value="1" />
        </el-select>
        </el-form-item>
        <el-form-item  class="viewPackageSearch">
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQueryCound(1)">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQueryCound(1)">重置</el-button>
        </el-form-item>
      </el-form>
      <div class="coundListAll">
          <div class="coundList" v-for="(item,index) in coundList" :key="index">
            <p>名称：{{item.coupon.name}}</p>
            <p>价格：{{item.coupon.faceValue}}</p>
            <p>{{item.usedFlag===0?"未使用":"已使用"}}</p>
            <p>过期时间：{{item.expireDate}}</p>
          </div>
      </div>
      <pagination
        v-show="totalCound>0"
        :total="totalCound"
        :pageSizes="pageSizes"
        :page.sync="coundQuery.pageNum"
        :limit.sync="coundQuery.pageSize"
        @pagination="viewCound(1)"
      />
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="closeCound">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 修改金额 -->
  <el-dialog :visible.sync="dialogVisible" :before-close="handleClose" width="20%" style="top: 200px;">
    <span>剩余金额：</span><el-input class="modify" v-model="editMoney.lastMoney" placeholder="请输入商品数量"/>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="modifyMoney(1)">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </span>
  </el-dialog>
    <!-- 禁用用户 -->
  <el-dialog title="警告" :visible.sync="forbidden" :before-close="handleClose" width="20%" style="top: 200px;">
    <span>确定{{enableUse.userState}}用户吗？</span>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="enableUser(1)">确 定</el-button>
      <el-button @click="forbidden = false">取 消</el-button>
    </span>
  </el-dialog>
  </div>
</template>

<script>
import { listUser, getUser, delUser, addUser, updateUser, exportUser,getPackage,editMoney,enableUse,getCound } from "@/api/user/user";

export default {
  name: "User",
  data() {
    return {
      //时间范围
      daterange:undefined,
      pageSizes:[12,24,36,48],
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
      // 用户表格数据
      userList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      //查看包裹
      openPackage:false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        nickName: undefined,
        beginTime:undefined,
        endTime:undefined,
      },
      //包裹查询
      packageQuery:{
        pageNum: 1,
        pageSize: 10,
        userId:undefined,
        goodsState:undefined,
        goodsName:undefined
      },
      //优惠券查询
      coundQuery:{
        pageNum: 1,
        pageSize: 12,
        userId:undefined,
        usedFlag:undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      },
      packageStatus:[
        {
          "goodsState":"背包中",
          "status":0
        },
        {
          "goodsState":"等待发货",
          "status":1
        },
        {
          "goodsState":"已发货",
          "status":2
        },
        {
          "goodsState":"已出售",
          "status":3
        },
      ],
      //背包列表
      packageList:[],
      totalPackage:0,
      //金额弹窗
      dialogVisible:false,
      //剩余金额
      editMoney:{
        lastMoney:0,
        userId:null
      },
      //禁用弹窗
      enableUse:{
        userId:null,
        delFlag:0,
        userState:null
      },
      forbidden:false,
      userState:null,
      openCound:false,
      coundList:[],
      totalCound:0
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 优惠券搜索按钮操作 */
    handleQueryCound(row) {
      this.coundQuery.pageNum = 1;
      this.viewCound(row);
    },
    /** 优惠券重置按钮操作 */
    resetQueryCound(row) {
      this.coundQuery.usedFlag=undefined
      // this.resetForm("packageFrom");
      this.handleQueryCound(row);
    },
    //查看优惠券
    viewCound(row){
      this.openCound=true;
      if(row==1){
        this.coundQuery.userId = this.coundQuery.userId;
      }else{
        this.coundQuery.userId = row.userId;
      }
      getCound(this.coundQuery).then(res=>{
        this.coundList=res.rows
        this.totalCound=res.total;
        console.log("-----------优惠券")
        console.log(res)
      })
    },
    closeCound(){
      this.openCound=false;
    },
    //禁用启用用户
    enableUser(row){
      if(row===1){
        let data={
          "userId":this.enableUse.userId,
          "delFlag":this.enableUse.delFlag===0?1:0
        }
        enableUse(data).then(res=>{
          if(res.code===0){
            this.forbidden=false;
            this.getList();
          }
        })
      }else{
        this.forbidden=true;
        this.enableUse.userId=row.userId;
        this.enableUse.delFlag=row.delFlag;
        if(row.delFlag===0){
          this.enableUse.userState="禁用"
        }else{
          this.enableUse.userState="启用"
        }
      }
    },
    /**关闭dialog**/
    handleClose(done) {
        this.dialogVisible = false;
        this.forbidden=false;
    },
    //修改金额
    modifyMoney(row){
      if(row===1){//确定按钮
        let data={
          "moneyFirstLeft":this.editMoney.lastMoney,
          "userId":this.editMoney.userId
        }
        editMoney(data).then(res=>{
          if(res.code===0){
            this.dialogVisible=false;
            this.getList();
          }
        })
      }else{
        this.dialogVisible=true;
        this.editMoney.lastMoney=row.moneyFirstLeft;
        this.editMoney.userId=row.userId;
      }

    },
    /** 包裹搜索按钮操作 */
    handleQueryPackage(row) {
      this.packageQuery.pageNum = 1;
      this.viewPackage(row);
    },
    /** 包裹重置按钮操作 */
    resetQueryPackage(row) {
      this.packageQuery.goodsState=undefined
      // this.resetForm("packageFrom");
      this.handleQueryPackage(row);
    },
    //查看包裹
    viewPackage(row){
      if(row==1){
        this.packageQuery.userId = this.packageQuery.userId;
      }else{
        this.packageQuery.userId = row.userId;
      }
      getPackage(this.packageQuery).then(res=>{
        this.openPackage=true;
        res.rows.forEach((value,index)=>{
          if(value.goodsState===0){value.goodsState="背包中"}else if(value.goodsState===1){value.goodsState="等待发货"}else if(value.goodsState===2){value.goodsState="已发货"}else if(value.goodsState===3){value.goodsState="已售出"}
          this.packageList.push(value);
        })
        this.packageList=res.rows;

        this.totalPackage=res.total;
      })
    },
    closePackage(){
      this.openPackage=false;
    },
    /** 查询用户列表 */
    getList() {
      this.loading = true;
      if(this.daterange===undefined){
          this.queryParams.beginTime=undefined;
          this.queryParams.endTime=undefined;
      }else{
          this.queryParams.beginTime=this.daterange[0];
          this.queryParams.endTime=this.daterange[1];
      }
      listUser(this.queryParams).then(response => {
        console.log("查询列表")
        console.log(response.rows)
        this.userList = response.rows;
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
        userId: undefined,
        nickName: undefined,
        sex: undefined,
        avatar: undefined,
        openId: undefined,
        createDate: undefined,
        delFlag: undefined,
        transactionUrl: undefined,
        loginName: undefined,
        loginPassword: undefined,
        mobile: undefined,
        extensioncode: undefined,
        rechargenumber: undefined,
        userType: undefined,
        registerType: undefined,
        extensionSource: undefined,
        steamId: undefined,
        goodsState:undefined,
        goodsName:undefined,
        usedFlag:undefined,
        beginTime:undefined,
        endTime:undefined,
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
      this.daterange=undefined;
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.userId)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加用户";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const userId = row.userId || this.ids
      getUser(userId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改用户";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.userId != undefined) {
            updateUser(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addUser(this.form).then(response => {
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
      const userIds = row.userId || this.ids;
      this.$confirm('是否确认删除用户编号为"' + userIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delUser(userIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有用户数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportUser(queryParams);
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
.scope_img{
  width: 100px;
}
</style>
<style>
.viewPackage .el-form-item.el-form-item--medium{
  width: 270px;
  display: inline-block;
}
.viewPackage .viewPackageSearch .el-form-item__content{
  margin-left: 0px!important;
}
.viewPackage .el-table__body-wrapper.is-scrolling-none{
  max-height: 560px!important;
  min-height: 560px!important;
  overflow-y: auto
}
.modify.el-input.el-input--medium{
  width: 274px;
}
.viewCound .el-table__body-wrapper.is-scrolling-none{
  max-height: 560px!important;
  min-height: 560px!important;
  overflow-y: auto
}
.viewCound .el-form-item.el-form-item--medium{
  width: 270px;
  display: inline-block;
}
.viewCound .el-form-item__content{
  margin-left: 0px!important;
}
.coundList{
  width: 280px;
  height: 150px;
  background-color: rgb(245, 245, 245);
  display: flex;
  flex-direction: column;
  align-items: center;
  align-content: flex-start;
  margin-right: 10px;
  margin-bottom: 10px;
  padding: 30px 0;
}
.coundList p{
  margin: 4px 0;
}
.coundListAll{
  max-height: 520px!important;
  min-height: 520px!important;
  overflow-y: auto;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  align-content: flex-start;
}

</style>