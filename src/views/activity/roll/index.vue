<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="活动标题" prop="rollTitle">
        <el-input
          v-model="queryParams.rollTitle"
          placeholder="请输入活动标题"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="参与方式" prop="joinWay">
        <el-input
          v-model="queryParams.joinWay"
          placeholder="请输入参与方式"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="Roll房状态" prop="status">
        <el-input
          v-model="queryParams.status"
          placeholder="请输入Roll房状态"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="创建时间" prop="createDate">
        <el-date-picker clearable size="small" style="width: 200px"
          v-model="queryParams.createDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择创建时间">
        </el-date-picker>
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
          v-hasPermi="['activity:roll:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['activity:roll:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['activity:roll:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['activity:roll:export']"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="rollList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="roll房id" align="center" prop="rollId" />
      <el-table-column label="活动标题" align="center" prop="rollTitle" />
      <el-table-column label="活动描述" align="center" prop="rollDesc" />
      <el-table-column label="提示" align="center" prop="rollTips" />
      <el-table-column label="活动图片路径" align="center" prop="rollImg" />
      <el-table-column label="背景图片" align="center" prop="rollBgImg">
        <template slot-scope="scope">
          <img class="scope_img" :src="scope.row.rollBgImg" alt="">
        </template>
      </el-table-column>

      <el-table-column label="开奖时间" align="center" prop="rollDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.rollDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="参与方式" align="center" prop="joinWay" />
      <el-table-column label="参与条件" align="center" prop="joinCondition" />
      <el-table-column label="参与条件(金额）" align="center" prop="joinMoney" />
      <el-table-column label="Roll房状态" align="center" prop="status" />
      <el-table-column label="创建时间" align="center" prop="createDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="showUpdateGoods(scope.row)"
          >添加商品</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['activity:roll:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['activity:roll:remove']"
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

    <!-- 添加或修改ROLL 房活动对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body @close="handleClose">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="活动标题" prop="rollTitle">
          <el-input v-model="form.rollTitle" placeholder="请输入活动标题" />
        </el-form-item>
        <el-form-item label="活动描述" prop="rollDesc">
          <el-input v-model="form.rollDesc" placeholder="请输入活动描述" />
        </el-form-item>
        <el-form-item label="活动图片路径" prop="rollImg">
          <el-input v-model="form.rollImg" placeholder="请输入活动图片路径" />
            <secondFz ref='secondFzref' :fileList="form.rollImg?[{url:form.rollImg}]:[]"   @showImgUrl="(url)=>{this.form.rollImg=url}" @removeImg="()=>{this.form.rollImg=''}" />

        </el-form-item>
        <el-form-item label="背景图片" prop="rollBgImg">
          <el-input v-model="form.rollBgImg" placeholder="请输入背景图片" />
            <secondFz :fileList="form.rollBgImg?[{url:form.rollBgImg}]:[]"  @showImgUrl="(url)=>{this.form.rollBgImg=url}" @removeImg="()=>{this.form.rollBgImg=''}" />
        </el-form-item>
        <el-form-item label="开奖时间" prop="rollDate">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.rollDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择开奖时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="参与方式" prop="joinWay">
          <el-input v-model="form.joinWay" placeholder="请输入参与方式" />
        </el-form-item>
        <el-form-item label="参与条件" prop="joinCondition">
           <el-select v-model="form.joinCondition" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
        </el-form-item>
        <el-form-item v-show="form.joinCondition=='金额参与'" label="参与条件(金额）" prop="joinMoney">
          <el-input v-model="form.joinMoney" placeholder="请输入参与条件(金额）" />
        </el-form-item>
        <el-form-item v-show="form.joinCondition=='密码参与'" label="参与密码" prop="joinMoney">
          <el-input v-model="form.joinMoney" placeholder="请输入参与密码）" />
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>


     <!-- 公用商品库弹出层 -->
    <el-dialog :title="title2" :visible.sync="openGoods" width="1330px" append-to-body>
      <el-form :model="queryParamsGoods" ref="queryGoodsForm" :inline="true" label-width="68px">
        <el-form-item label="商品名称" prop="goodsName" >
          <el-input
            v-model="queryParamsGoods.goodsName"
            placeholder="请输入商品名称"
            clearable
            size="small"
            @keyup.enter.native="handleQueryGoods"
          />
        </el-form-item>
        <el-form-item label="分类" style="white-space:nowrap">
          <el-select v-model="queryParamsGoods.hellcaseItem" placeholder="全部">
            <el-option
              v-for="item in typeList"
              :key="item.index"
              :label="item.goodsType"
              :value="item.goodsType">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="磨损度" style="white-space:nowrap">
          <el-select v-model="queryParamsGoods.goodsTitle" placeholder="全部">
            <el-option
              v-for="item in abraList"
              :key="item.index"
              :label="item.name"
              :value="item.name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="价格筛选">
          <el-input
            class="priceInput"
            v-model="queryParamsGoods.minPrice"
            placeholder="起始价格"
            oninput="value=value.replace(/[^\d.]/g,'')"
          />-
          <el-input
            class="priceInput"
            v-model="queryParamsGoods.maxPrice"
            placeholder="结束价格"
            oninput="value=value.replace(/[^\d.]/g,'')"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQueryGoods">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQueryGoods">重置</el-button>
        </el-form-item>
      </el-form>
     <el-table v-loading="loading" :data="goodsList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="商品名称" align="center" prop="goodsName" />
        <el-table-column label="磨损度" align="center" prop="goodsTitle" />
        <el-table-column label="商品图片" align="center" prop="goodsPicture">
          <template slot-scope="scope">
            <img class="scope_img" :src="scope.row.goodsPicture" alt="">
          </template>
        </el-table-column>
        <el-table-column label="商品价格" align="center" prop="goodsPrice" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              type="primary"
              @click="goodsChoose(scope.row)"
            >选择</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="totalGoods>0"
        :total="totalGoods"
        :page.sync="queryParamsGoods.pageNum"
        :limit.sync="queryParamsGoods.pageSize"
        @pagination="getListGoods"
      />
    </el-dialog>

    <!-- 要上传的弹出层 -->
    <el-dialog :title="title1" :visible.sync="chooseGoods" width="1500px" append-to-body>
      <el-button
        size="mini"
        type="text"
        icon="el-icon-plus"
        @click="showOpenGoods()"
        class="addGoods"
      >添加商品</el-button>
      <div class="dialogDiv">
        <el-table v-loading="loading" :data="goodsListUpdate">
          <el-table-column width="55" align="center" />
            <el-table-column label="商品名称" align="center" prop="goodsName" />
            <el-table-column label="磨损度" align="center" prop="goodsTitle" />
            <el-table-column label="商品图片" align="center" prop="goodsPicture">
              <template slot-scope="scope">
                <img class="scope_img" :src="scope.row.goodsPicture" alt="">
              </template>
            </el-table-column>
            <el-table-column label="商品价格" align="center" prop="goodsPrice" />

            <el-table-column label="权重%" align="center" prop="goodsWeight">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.goodsWeight"
                  clearable
                  size="small"
                />
              </template>
            </el-table-column>
            <el-table-column label="权重(推广号)%" align="center" prop="goodsWeightExtension">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.goodsWeightExtension"
                  clearable
                  size="small"
                />
              </template>
            </el-table-column>
            <el-table-column label="管控" align="center" prop="checkControl">
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.checkControl"></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column label="忽略" align="center" prop="checkIgnore">
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.checkIgnore"></el-checkbox>
              </template>
            </el-table-column>

            
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  @click="delGoods(scope.row)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
      </div>
      <div class="addGoodsBtn" @click="addGoodsListUpdate()">确定</div>
    </el-dialog>
  </div>
</template>

<script>
import { listRoll, getRoll, delRoll, addRoll, updateRoll, exportRoll } from "@/api/activity/roll";
import { listGoods } from "@/api/remote";

export default {
  name: "Roll",
  data() {
    return {
      //商场图片位置选择
       options: [{
          value: '免费参与',
          label: '免费参与'
        }, {
          value: '密码参与',
          label: '密码参与'
        }, {
          value: '金额参与',
          label: '金额参与'
        }, {
          value: '推广参与',
          label: '推广参与'
        }],
      dialogVisible:false,
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
      // ROLL 房活动表格数据
      rollList: [],
      // 弹出层标题
      title: "",
      // 弹出层标题1
      title1: "",
      // 弹出层标题2
      title2:"",                                                                                                               
      // 是否显示弹出层
      open: false,
      //是否显示添加商品弹出层
      openGoods:false,
      chooseGoods:false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        rollTitle: undefined,
        joinWay: undefined,
        status: undefined,
        createDate: undefined,
      },
      // 查询参数商品
      queryParamsGoods: {
        pageNum: 1,
        pageSize: 10,
        subordinate: undefined,
        goodsName: undefined,
        goodsHashName: undefined,
        goodsTitle: undefined,
        goodsPicture: undefined,
        goodsBgPicture: undefined,
        goodsPrice: undefined,
        createDate: undefined,
        orderIndex: undefined,
        delFlag: undefined,
        hellcaseId: undefined,
        hellcaseItem: undefined,
        goodsType: undefined,
        exchangeFrequency: undefined,
        stockNum: undefined,
        level: undefined,
        detailUrl: undefined,
        minPrice:undefined,
        maxPrice:undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      },
      goodsList:[],
      // 要上传的商品
      goodsListUpdate:[],
      boxGoodsJson:{
        "goodsWeight": "",
        "goodsWeightExtension": "",
        "checkControl": false,
        "checkIgnore": false
      },
      boxGoodsJson1:[],
      addBoxId:"",
      addGoodsId:'',
      // 总条数
      totalGoods: 0,
      typeList:[
        {
          goodsType:'全部'
        },
        {
          goodsType:'印花及武器箱'
        },
        {
          goodsType:'匕首'
        },
        {
          goodsType:'手枪'
        },
        {
          goodsType:'冲锋枪'
        },
        {
          goodsType:'微型冲锋枪'
        },
        {
          goodsType:'重型武器'
        },
        {
          goodsType:'手套'
        },
        {
          goodsType:'其他'
        },
        {
          goodsType:'探员'
        }
      ],
      abraList:[
        {
          name:'全部'
        },
        {
          name:'战痕累累'
        },
        {
          name:'崭新出厂'
        },
        {
          name:'久经沙场'
        },
        {
          name:'略有磨损'
        },
        {
          name:'破损不堪'
        }
      ]
    };
  },
  mounted() {
    this.getList();
    this.getListGoods();
  },
  methods: {
        //将调接口添加商品
    addGoodsListUpdate(){
      this.goodsListUpdate.forEach((value,index)=>{
        this.boxGoodsJson1.push({
          goodsId:value.goodsId,
          object1:{
            "goodsWeight": value.goodsWeight||"50",
            "goodsWeightExtension": value.goodsWeightExtension||"50",
            "checkControl": value.checkControl===true?1:0||0,
            "checkIgnore": value.checkIgnore===true?1:0||0
          }
        })
        this.addGoodsId += value.goodsId + ","
      })
      const obj = {}
        this.boxGoodsJson1.map((e) => {
          obj[e.goodsId] = e.object1;
        });
      const params = {
        "boxId":this.addBoxId,
        "goodsId": this.addGoodsId,
        "boxGoodsJson":obj
      }
      addGoods(params).then(res => {
        if(res.code===0){
          console.log("请求成功")
          this.chooseGoods = false;
        }
      });

    },
    //从商品库选择商品添加到添加商品
    goodsChoose(row){
      this.goodsListUpdate.push(row);
      this.goodsList.forEach((value,index)=>{
        if(row.goodsId===this.goodsList[index].goodsId){
          this.goodsList.splice(index,1)
        }
      })
    },
    //删除要删除的商品
    delGoods(row){
      this.goodsListUpdate.forEach((value,index) => {
        if(row.goodsId === value.goodsId){
          this.goodsListUpdate.splice(index,1)
        }
      });
    },
    /**关闭dialog**/
    handleClose() {
      this.$refs.secondFzref.handleRemove();
      this.dialogVisible = false;
     
    },
    /** 查询商品列表 */
    getListGoods() {
      this.loading = true;
      listGoods(this.queryParamsGoods).then(response => {
        console.log(response.data)
        this.goodsList = response.data.itemList;
        this.totalGoods = response.data.total;
        this.loading = false;
      });
    },
    /** 查询ROLL 房活动列表 */
    getList() {
      this.loading = true;
      listRoll(this.queryParams).then(response => {
        this.rollList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.openGoods = false;
      this.reset();
     
      this.$refs.secondFzref.handleRemove();
    },
    // 表单重置
    reset() {
      this.form = {
        rollId: undefined,
        rollTitle: undefined,
        rollDesc: undefined,
        rollTips: undefined,
        rollImg: undefined,
        rollBgImg: undefined,
        rollDate: undefined,
        joinWay: undefined,
        joinCondition: undefined,
        joinMoney: undefined,
        status: undefined,
        createDate: undefined,
        updateDate: undefined,
        delFlag: undefined
      };
      this.resetForm("form");
      
      // this.$refs.secondFzref.handleRemove();  //如果中间叉掉的话，就清空
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
    /**搜索添加商品操作**/
    handleQueryGoods() {
      this.queryParamsGoods.pageNum = 1;
      this.getListGoods();
    },
    /** 重置按钮操作 */
    resetQueryGoods() {
      // this.resetForm("queryFormGoods");
      this.queryParamsGoods.goodsName = undefined;
      this.queryParamsGoods.hellcaseItem = undefined;
      this.queryParamsGoods.goodsTitle = undefined;
      this.queryParamsGoods.minPrice = undefined;
      this.queryParamsGoods.maxPrice = undefined;
      this.handleQueryGoods();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.rollId)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加ROLL 房活动";
    },
    /**获取公用商品库**/
    toAddGoods(row){
      this.reset();
      this.chooseGoods = true;
      this.title = "添加商品";
    },
    /**显示要上传的弹出层**/
    showUpdateGoods(row){
      this.addBoxId = row.boxId;
      this.chooseGoods = true;
      this.title1 = "添加商品";
    },
    /**显示公用商品库弹出层并选择商品**/
    showOpenGoods(){
      this.resetForm("queryGoodsForm");
      this.openGoods = true;
      this.title2 = "选择商品";
    },



    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const rollId = row.rollId || this.ids
      getRoll(rollId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改ROLL 房活动";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.rollId != undefined) {
            updateRoll(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addRoll(this.form).then(response => {
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
      const rollIds = row.rollId || this.ids;
      this.$confirm('是否确认删除ROLL 房活动编号为"' + rollIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delRoll(rollIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有ROLL 房活动数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportRoll(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
<style scoped>
  .addGoodsBtn{
    width: 92px;
    height: 38px;
    line-height: 38px;
    background: #1E9FFF;
    border-radius: 2px;
    color: #fff;
    text-align: center;
    cursor:pointer;
    position: relative;
    left: 50%;
    transform: translateX(-50%);  
    margin-top: 20px;     
  }
</style>
<style>
.scope_img{
  height: 80px;
}
.dialogDiv{
  min-height: 700px!important;
}
button.el-button.addGoods.el-button--text.el-button--mini{
  position: absolute;
  top: 54px;
  right: 50px;
}
</style>