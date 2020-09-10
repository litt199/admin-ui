<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="箱子名称" prop="boxName">
        <el-input
          v-model="queryParams.boxName"
          placeholder="请输入箱子名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>


    <el-table v-loading="loading" :data="profitList">
      <el-table-column type="text" width="55" align="center" />
      <el-table-column label="箱子名称" align="center" prop="boxName" />
      <el-table-column label="箱子图片" align="center" prop="boxPicture">
          <template slot-scope="scope">
            <img class="scope_img1" :src="scope.row.boxPicture" alt="">
          </template>
        </el-table-column>
      <el-table-column label="开箱次数" align="center" prop="openCount" />
      <el-table-column label="箱子价格" align="center" prop="boxPrice" />
      <el-table-column label="箱子成本" align="center" prop="boxCost" />
      <el-table-column label="装备总价值($)" align="center" prop="prizeGoodsMoney" />
      <el-table-column label="盈利金额($)" align="center" prop="actualProfit" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            @click="handleUpdate(scope.row)"
          >详情</el-button>
          <el-button
            size="mini"
            type="text"
            @click="handleDelete(scope.row)"
          >盈利归零</el-button>
          <el-button
            size="mini"
            type="text"
            @click="getOpenBoxRecordPage(scope.row)"
          >开箱统计</el-button>

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

    <!-- 详情对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1700px" append-to-body>
      <div class="dialogDiv">
        <div>箱子盈利信息</div>
        <p><img :src="this.personDetail.boxPicture" alt="" class="touxiang"></p>
        <p>名称：{{this.personDetail.boxName}}</p>
        <p>箱子价格：{{this.profitDetail.boxPrice}}</p>
        <p>箱子成本：{{this.profitDetail.boxCost}}</p>
        <p>公众号成本价格：{{this.profitDetail.boxCostExtension}}</p>
        <p>开箱次数：{{this.profitDetail.openCount}}</p>
        <p>预期盈利：{{this.profitDetail.expectProfit}}<span>箱子的价格 - 箱子的成本</span></p>
        <p>实际盈利：{{this.profitDetail.actualProfit}}<span>箱子的价格 - 开出装备的价格</span></p>
        <p>超出预期盈利：{{this.profitDetail.exceedValue}}<span>实际盈利 - 预期盈利</span></p>
        <p>开出装备总值：{{this.profitDetail.prizeGoodsMoney}}</p>
        <p>管控上限阈值：{{this.profitDetail.threshold}}</p>
        <p>管控下限阈值：{{this.profitDetail.lowerThreshold}}</p>
        <p>高价值物品爆率：{{this.profitDetail.highProbability}}</p>
      </div>
      <div class="dialogDiv1">
        <div class="title">箱子商品信息</div>
        <el-table v-loading="loading" :data="boxGoodsDetail" max-height="635" >
            <el-table-column label="名称" align="center" prop="goodsName" width="300" />
            <el-table-column label="磨损度" align="center" prop="goodsTitle" />
            <el-table-column label="商品图片" align="center" prop="goodsPicture">
              <template slot-scope="scope">
                <img class="scope_img" :src="scope.row.goodsPicture" alt="">
              </template>
            </el-table-column>
            <el-table-column label="商品价格" align="center" prop="goodsPrice" />
            <el-table-column label="管控" align="center" prop="checkControl">
              <template slot-scope="scope">
                <i class="el-icon-check" v-show="scope.row.checkControl"></i>
              </template>
            </el-table-column>
            <el-table-column label="忽略" align="center" prop="checkIgnore">
              <template slot-scope="scope">
                <i class="el-icon-check" v-show="scope.row.checkIgnore"></i>
              </template>
            </el-table-column>
            <el-table-column label="中奖次数" align="center" prop="prizeCount" />
          </el-table>
      </div>
    </el-dialog>
    <!--开箱统计弹窗-->
    <el-dialog :title="title" :visible.sync="openBox" width="1500px" append-to-body>
      <el-form :model="queryOpenParams" ref="openParamsFrom" :inline="true" label-width="68px">
        <el-form-item label="用户昵称" prop="nickName" >
          <el-input
            v-model="queryOpenParams.nickName"
            placeholder="请输入用户昵称"
            clearable
            size="small"
            @keyup.enter.native="handleQueryOpen"
          />
        </el-form-item>
        <!--<el-form-item label="商品名称" prop="goodsName" >
          <el-input
            v-model="queryOpenParams.goodsName"
            placeholder="请输入商品名称"
            clearable
            size="small"
            @keyup.enter.native="handleQueryOpen"
          />
        </el-form-item>-->
        <el-form-item label="开箱时间" prop="dateRange" >
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
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQueryOpen">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQueryOpen">重置</el-button>
        </el-form-item>
      </el-form>
        <div class="openDialog">
          <el-table v-loading="loading" :data="OpenBoxRecordPage" max-height="635" >
          <el-table-column label="头像" align="center" width="200">
            <template slot-scope="scope">
              <img :src="(scope.row.avatar===null||scope.row.avatar===''||scope.row.avatar==='img')?imgAvatar:scope.row.avatar" alt="" class="imgAvatar">
            </template>
          </el-table-column>
            <el-table-column label="昵称" align="center" prop="nickName" />
            <el-table-column label="箱子价格" align="center" prop="goodsPrice" />
            <el-table-column label="商品" align="center">
              <template slot-scope="scope">
                <img class="scope_img" :src="scope.row.goodsPicture" alt="">
                <span>{{scope.row.goodsName}}</span>
              </template>
            </el-table-column>
            <el-table-column label="商品价格" align="center" prop="goodsPrice"/>
            <el-table-column label="开箱时间" align="center" prop="createTime" />
          </el-table>
        </div>

          <pagination
            v-show="totalOpenGoods>0"
            :total="totalOpenGoods"
            :page.sync="queryOpenParams.pageNum"
            :limit.sync="queryOpenParams.pageSize"
            @pagination="getOpenBoxRecordPage"
          />
    </el-dialog>



  </div>
</template>

<script>
import { listProfit, getProfit, delProfit, addProfit, updateProfit, exportProfit,getOpenBoxRecordPage,resetProfitZero } from "@/api/box/profit";

export default {
  name: "Profit",
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
      totalOpenGoods:0,
      // 箱子盈利表格数据
      profitList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      openBox:false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        boxName:undefined
      },
      //开箱查询参数
      queryOpenParams: {
        pageNum: 1,
        pageSize: 10,
        boxId:undefined,
        searchTime:undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      },
      //箱子详情
      personDetail:{},
      profitDetail:{},
      boxGoodsDetail:[],
      //开箱统计
      OpenBoxRecordPage:[],
      //开箱统计时间查询
      searchTime:"",
      dateRange:""
      
    };
  },
  created() {
    this.getList();
  },
  methods: {
    handleQueryOpen(){
      this.queryOpenParams.pageNum = 1;
      this.getOpenBoxRecordPage(1);
    },
    resetQueryOpen() {
      this.dateRange="";
      this.resetForm("openParamsFrom");
      this.handleQueryOpen();
    },
    /**获取开箱统计**/
    getOpenBoxRecordPage(row){
      this.reset();
      if(row==1){
        this.queryOpenParams.boxId = this.queryOpenParams.boxId;
      }else{
        this.queryOpenParams.boxId = row.boxId;
      }
      if(this.dateRange){
        this.searchTime = this.dateRange[0] +' 00:00:00'+' - ' + this.dateRange[1] + ' 00:00:00'
      }else{
        this.searchTime=""
      }
      this.queryOpenParams.searchTime=this.searchTime;
      getOpenBoxRecordPage(this.queryOpenParams).then(response => {
        console.log("------------------------开箱统计")
        console.log(response)
        this.OpenBoxRecordPage = response.rows;
        this.totalOpenGoods = response.total;
        this.openBox = true;
        this.title = "开箱统计";
        this.resetForm("openParamsFrom");
      });
    },
    /** 查询箱子盈利列表 */
    getList() {
      this.loading = true;
      console.log(this.queryParams)
      listProfit(this.queryParams).then(response => {
        this.profitList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.openBox = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        boxId: undefined,
        openCount: undefined,
        expectProfit: undefined,
        actualProfit: undefined,
        exceedValue: undefined,
        prizeGoodsMoney: undefined,
        operationUser: undefined,
        createTime: undefined
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
      this.title = "盈利详情";
    },
    /**箱子详情 */
    handleUpdate(row) {
      this.reset();
      const id = row.boxId || this.ids
      console.log(id)
      getProfit(id).then(response => {
        console.log("请求成功")
        this.personDetail = response.data.box;
        this.profitDetail = response.data.boxOpenInfo;
        console.log("------------------profitDetail")
        console.log(this.profitDetail)
        this.boxGoodsDetail=response.data.boxGoods;
        this.open = true;
        this.title = "盈利详情";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateProfit(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addProfit(this.form).then(response => {
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
      const ids = row.boxId || this.ids;
      this.$confirm('确定要将该箱子盈利归零吗？', "信息", {

          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          const params = {
            boxId:ids
          }
          return resetProfitZero(params);
        }).then(() => {
          this.getList();
          this.msgSuccess("盈利归零成功！");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有箱子盈利数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportProfit(queryParams);
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
.scope_img1{
  width: 100px;
}
.scope_img{
  width: 100px;
  display: block;
}
.dialogDiv{
  width: 500px;
  height: 700px;
  display: inline-block;
  border:12px solid #f8f8f9;
}
.dialogDiv div{
  text-indent: 10px;
  line-height: 40px;
  height: 40px;
  border-bottom:1px solid #f8f8f9;
}
.dialogDiv .touxiang{
  width: 100px;
  border-radius: 50%;
}
.dialogDiv p{
  text-indent: 100px;
}
.dialogDiv p span{
  color:#999;
  padding: 9px;
}
.dialogDiv1{
    width: 1134px;
    height: 700px;
    border:12px solid #f8f8f9;
    display: inline-block;
    position: absolute;
    margin-left: 22px;
}
.dialogDiv1 .title{
  text-indent: 10px;
  line-height: 40px;
  margin: 0;
  height: 40px;
  border-bottom:1px solid #f8f8f9;
}
.openDialog{
  min-height: 650px!important;
}
</style>
