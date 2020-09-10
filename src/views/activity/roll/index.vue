<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="86px">
      <el-form-item label="roll房名称" prop="rollTitle">
        <el-input
          v-model="queryParams.rollTitle"
          placeholder="请输入roll房名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="参与方式" style="white-space:nowrap">
        <el-select v-model="queryParams.joinWay" placeholder="请选择">
            <el-option label="免费参与" value="免费参与" />
            <el-option label="密码参与" value="密码参与" />
            <el-option label="金额参与" value="金额参与" />
            <el-option label="推广参与" value="推广参与" />
        </el-select>
      </el-form-item>
      <el-form-item label="开奖时间">
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
      <el-form-item label="是否结束" style="white-space:nowrap">
        <el-select v-model="queryParams.status" placeholder="请选择">
            <el-option label="已结束" value="0" />
            <el-option label="进行中" value="1" />
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
          v-hasPermi="['activity:roll:add']"
        >新增</el-button>
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
    </el-row>

    <el-table v-loading="loading" :data="rollList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="roll房名称" align="center" prop="rollTitle" />
      <el-table-column label="roll房图片" align="center" prop="rollImg" width="180">
        <template slot-scope="scope">
          <img :src="scope.row.rollImg" alt="" class="rollImg">
        </template>
      </el-table-column>
      <el-table-column label="开奖时间" align="center" prop="rollDate" width="180">
        <template slot-scope="scope">
          <!--<span>{{ parseTime(scope.row.rollDate, '{y}-{m}-{d}') }}</span>-->
          <span>{{scope.row.rollDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="参与方式" align="center" prop="joinWay" />
      <el-table-column label="是否结束" align="center" prop="status" />
      <el-table-column label="创建时间" align="center" prop="createDate" width="180">
        <template slot-scope="scope">
          <span>{{scope.row.createDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="修改时间" align="center" prop="updateDate" width="180">
        <template slot-scope="scope">
          <span>{{scope.row.updateDate }}</span>
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

    <!-- 添加roll房-->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body @close="cancel" v-if="open">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="活动标题" prop="rollTitle">
          <el-input v-model="form.rollTitle" placeholder="请输入活动标题" maxlength="50" />
        </el-form-item>
        <el-form-item label="活动描述" prop="rollTips">
          <el-input v-model="form.rollTips" placeholder="请输入活动描述" maxlength="50" />
        </el-form-item>
        <el-form-item label="提示信息" prop="rollDesc">
          <el-input v-model="form.rollDesc" placeholder="请输入提示信息" maxlength="50" />
        </el-form-item>
        <el-form-item label="活动图片路径" prop="rollImg">
          <el-input v-model="form.rollImg" placeholder="请输入活动图片路径"/>
          <uploadImg :fileList="form.rollImg?[{url:form.rollImg}]:[]" @getShopProfileFn="(url)=>{form.rollImg=url}"/>
          <!--<secondFz  ref='secondFzref' :fileList="form.rollImg?[{url:form.rollImg}]:[]"   @showImgUrl="(url)=>{form.rollImg=url}" @removeImg="()=>{form.rollImg=''}" />-->
        </el-form-item>
        <el-form-item label="背景图片" prop="rollBgImg">
          <el-input v-model="form.rollBgImg" placeholder="请输入背景图片" />
            <uploadImg  :fileList="form.rollBgImg?[{url:form.rollBgImg}]:[]" @getShopProfileFn="(url)=>{form.rollBgImg=url}"/>
            <!--<secondFz  ref='secondFzref' :fileList="form.rollBgImg?[{url:form.rollBgImg}]:[]"  @showImgUrl="(url)=>{form.rollBgImg=url}" @removeImg="()=>{form.rollBgImg=''}" />-->
        </el-form-item>
      <el-form-item label="开奖时间" prop="rollDate">
        <el-date-picker
          v-model="form.rollDate"
          type="datetime"
          placeholder="请选择开奖时间">
        </el-date-picker>
      </el-form-item>
        <el-form-item label="参与方式" prop="joinWay">
          <el-select v-model="form.joinWay" placeholder="请选择">
              <el-option label="免费参与" value="免费参与" />
              <el-option label="密码参与" value="密码参与" />
              <el-option label="金额参与" value="金额参与" />
              <el-option label="推广参与" value="推广参与" />
          </el-select>
        </el-form-item>
        <el-form-item label="参与条件" prop="joinMoney" v-if="form.joinWay=='金额参与'">
          <el-input v-model="form.joinMoney" placeholder="请输入金额" maxlength="10" oninput="this.value= this.value.match(/\d+(\.\d{0,4})?/) ? this.value.match(/\d+(\.\d{0,4})?/)[0] : ''"/>
        </el-form-item>
        <el-form-item label="参与条件" prop="joinCondition" v-if="form.joinWay=='密码参与'">
          <el-input v-model="form.joinCondition" placeholder="请输入密码" maxlength="10" />
        </el-form-item>
        <!--<el-form-item label="参与条件" prop="joinMoney" v-if="form.joinWay=='金额参与'">
          <el-input v-model="form.joinMoney" placeholder="请输入金额" maxlength="50" />
        </el-form-item>
        <el-form-item label="参与条件" prop="joinCondition" v-if="form.joinWay='密码参与'">
          <el-input v-model="form.joinCondition" placeholder="请输入密码" maxlength="50" />
        </el-form-item>-->
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
        <!--<el-form-item label="价格筛选">
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
        </el-form-item>-->
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
            <el-table-column label="商品图片" align="center" prop="goodsPicture">
              <template slot-scope="scope">
                <img class="scope_img" :src="scope.row.goodsPicture" alt="">
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
import { listRoll, getRoll, delRoll, addRoll, updateRoll, exportRoll ,getRollGoods,addGoods} from "@/api/activity/roll";
import { listGoods } from "@/api/remote";

export default {
  name: "Roll",
  data() {
    return {
      //参与条件判断
      join:{
        joinMoney:"金额参与",
        joinCondition:"密码参与"
      },
      //上传图片
      formImg:undefined,
      //日期范围
      daterange:undefined,
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
        beginTime:undefined,
        endTime:undefined
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
        rollTitle: [
          { required: true, message: "活动标题不能为空", trigger: "blur" }
        ],
        rollTips:[
          { required: true, message: "活动描述不能为空", trigger: "blur" }
        ],
        rollImg: [
          { required: true, message: "活动图片不能为空",trigger:'blur'}
        ],
        rollDate: [
          { required: true, message: "开奖时间不能为空", trigger: "blur" }
        ],
        joinWay: [
          { required: true, message: "参与方式不能为空", trigger: "blur" }
        ],
        joinCondition: [
          { required: true, message: "参与条件不能为空", trigger: "blur" }
        ],
        joinMoney: [
          { required: true, message: "参与条件不能为空", trigger: "blur" }
        ]
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
          goodsType:'印花及武器箱'
        },
        {
          goodsType:'匕首'
        },
        {
          goodsType:'手枪'
        },
        {
          goodsType:'步枪'
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
      ],
      
    };
  },
  mounted() {
    this.getList();
    this.getListGoods();
  },
  methods: {
    addGoodsListUpdate(){
      this.addGoodsId="";
      this.goodsListUpdate.forEach((value,index)=>{
        this.addGoodsId += value.goodsId + ","
      })
      const params = {
        "rollId":this.addBoxId,
        "goodsId": this.addGoodsId,
      }
      addGoods(params).then(res => {
        if(res.code===200){
          this.msgSuccess("添加成功")
          this.chooseGoods = false;
        }
      });
    },
    //从商品库选择商品添加到添加商品
    goodsChoose(row){
      const isAdd = this.goodsListUpdate.some((value,index) => row.goodsId===this.goodsListUpdate[index].goodsId)
      if(!isAdd){
        this.goodsListUpdate.push(row);
        this.goodsList.forEach((value,index)=>{
          if(row.goodsId===this.goodsList[index].goodsId){
            this.goodsList.splice(index,1)
          }
        })
      }else{

        this.msgError("请勿重复添加相同商品！");
      }
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
      // this.$refs.uploadImgRef.handleRemove();
      this.dialogVisible = false;
     
    },
    /** 查询商品列表 */
    getListGoods() {
      this.loading = true;
      listGoods(this.queryParamsGoods).then(response => {
        this.goodsList = response.data.itemList;
        this.totalGoods = response.data.total;
        this.loading = false;
      });
    },
    /** 查询ROLL 房活动列表 */
    getList() {
      this.rollList=[];
      this.loading = true;
      if(this.daterange===undefined||this.daterange===null){
          this.queryParams.beginTime=undefined;
          this.queryParams.endTime=undefined;
      }else{
          this.queryParams.beginTime=this.daterange[0];
          this.queryParams.endTime=this.daterange[1];
      }
      listRoll(this.queryParams).then(response => {
        response.rows.forEach((value,index)=>{
          if(value.status===0){value.status="已结束"}else if(value.status===1){value.status="进行中"}
          if(value.joinWay===1){value.joinWay="免费参与"}else if(value.joinWay===2){value.joinWay="密码参与"}else if(value.joinWay===3){value.joinWay="金额参与"}else if(value.joinWay===4){value.joinWay="推广参与"}
          this.rollList.push(value);
        })
        this.rollList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.reset();
      this.open = false;
      this.openGoods = false;
      // this.$refs.uploadImgRef.handleRemove();
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
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.daterange=undefined;
      this.queryParams.joinWay=undefined;
      this.queryParams.status=undefined;
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
      this.goodsListUpdate=[];
      this.addBoxId = row.rollId;
      this.chooseGoods = true;
      this.title1 = "添加商品";
      let data={
        "rollId":this.addBoxId
      }
      getRollGoods(data).then((res)=>{
          if(res.code==200){
            this.goodsListUpdate=res.data
          }
      })  
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
        let value = response.data;
        if(value.joinWay===1){value.joinWay="免费参与"}else if(value.joinWay===2){value.joinWay="密码参与"}else if(value.joinWay===3){value.joinWay="金额参与"}else if(value.joinWay===4){value.joinWay="推广参与"}
        this.form = value;
        console.log(this.form)
        this.open = true;
        this.title = "修改ROLL 房活动";
      });
    },
    //验证时间是标准时间还是格式化后的时间
    isDatetime(date){
      var regex=/^(?:19|20)[0-9][0-9]-(?:(?:0[1-9])|(?:1[0-2]))-(?:(?:[0-2][1-9])|(?:[1-3][0-1])) (?:(?:[0-2][0-3])|(?:[0-1][0-9])):[0-5][0-9]:[0-5][0-9]$/;
      if(!regex.test(date)){
        return false;
      }
      return true;
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          const isTrue=this.isDatetime(this.form.rollDate)
          if(!this.isDatetime(this.form.rollDate)){
              const dictTime = this.form.rollDate;
              this.form.rollDate = dictTime.getFullYear() + '-' + (dictTime.getMonth() + 1) + '-' + dictTime.getDate() + ' ' + dictTime.getHours() + ':' + dictTime.getMinutes() + ':' + dictTime.getSeconds()
          }
          var params = this.form;
          if(params.joinWay=="免费参与"){params.joinWay=1}else if(params.joinWay=="密码参与"){params.joinWay=2}else if(params.joinWay=="金额参与"){params.joinWay=3}else if(params.joinWay=="推广参与"){params.joinWay=4}
          if (this.form.rollId != undefined) {
            updateRoll(params).then(response => {
              if (response.code === 200) {
                this.open = false;
                this.getList();
                this.msgSuccess("修改成功");
              }
            });
          } else {
            
            addRoll(this.form).then(response => {
              if (response.code === 200) {
                this.open = false;
                this.getList();
                this.msgSuccess("新增成功");
              }
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const rollIds = row.rollId || this.ids;
      this.$confirm('是否确认删除此ROLL 房活动的数据项?', "警告", {
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
  .rollImg{
    width: 80px;
  }
</style>
<style>
.scope_img{
  width: 100px;
}
.dialogDiv{
  /*min-height: 700px!important;*/
  max-height: 700px!important;
  overflow-y: scroll;
}
button.el-button.addGoods.el-button--text.el-button--mini{
  position: absolute;
  top: 54px;
  right: 50px;
}
</style>