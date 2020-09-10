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
      <el-form-item label="箱子分组" style="white-space:nowrap">
        <el-select v-model="queryParams.groupId" placeholder="请选择">
          <el-option
            v-for="item in groupList"
            :key="item.index"
            :label="item.groupName"
            :value="item.groupId">
          </el-option>
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
          v-hasPermi="['obcase:box:add']"
        >新增</el-button>
      </el-col>
     <!-- <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['obcase:box:edit']"
        >修改</el-button>
      </el-col>-->
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['obcase:box:remove']"
        >删除</el-button>
      </el-col>
      <!--<el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['obcase:box:export']"
        >导出</el-button>
      </el-col>-->
    </el-row>

    <el-table v-loading="loading" :data="boxList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="箱子名称" align="center" prop="boxName" />
      <el-table-column label="箱子图片" align="center" prop="boxPicture">
        <template slot-scope="scope">
          <img class="scope_img" :src="scope.row.boxPicture" alt="">
        </template>
      </el-table-column>
      <el-table-column label="商品图片" align="center" prop="goodsPicture">
        <template slot-scope="scope">
          <img class="scope_img" :src="scope.row.goodsPicture" alt="">
        </template>
      </el-table-column>
      <el-table-column label="箱子分组" align="center" prop="groupName" />
      <el-table-column label="箱子价格；美元" align="center" prop="boxPrice" />
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
            v-hasPermi="['obcase:box:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['obcase:box:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="totalChaXun>0"
      :total="totalChaXun"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改箱子对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body class="addBoxes" @close="handleClose" v-if="open"> 
      <el-form ref="form" :model="form" :rules="rules" id="addCsgoBox">
        <div style="margin-left: 25px;">
          <el-form-item label="箱子分组" style="white-space:nowrap" prop="groupId">
            <el-select v-model="form.groupId" placeholder="请选择">
              <el-option
                v-for="item in groupList"
                :key="item.index"
                :label="item.groupName"
                :value="item.groupId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="箱子的类型" prop="boxType">
            <el-select v-model="form.boxType" placeholder="请选择箱子的类型">
              <!--<el-option label="请选择" value="请选择" />-->
              <el-option label="抽奖箱子" value="0" />
              <!--<el-option label="满额赠送" value="1" />-->
            </el-select>
          </el-form-item>
          <el-form-item label="算法类型" prop="algoType">
            <el-select v-model="form.algoType" placeholder="请选择算法">
              <!--<el-option label="请选择" value="请选择" />-->
              <el-option label="商品管控算法" value="1" />
              <!--<el-option label="奖池算法" value="0" />-->
            </el-select>
          </el-form-item>
          <el-form-item label="箱子名称" prop="boxName">
            <el-input v-model="form.boxName" placeholder="请输入箱子名称" maxlength="10"/>
          </el-form-item>
          <el-form-item label="商品图片" prop="goodsPicture">
            <el-input v-model="form.goodsPicture" placeholder="请输入商品图片" />
            <uploadImg :fileList="form.goodsPicture?[{url:form.goodsPicture}]:[]" @getShopProfileFn="(url)=>{form.goodsPicture=url}"/>
          </el-form-item>
          <el-form-item label="箱子图片" prop="boxPicture">
            <el-input v-model="form.boxPicture" placeholder="请输入箱子图片" />
            <uploadImg :fileList="form.boxPicture?[{url:form.boxPicture}]:[]" @getShopProfileFn="(url)=>{form.boxPicture=url}"/>
          </el-form-item>
          <el-form-item label="箱子背景图片" prop="boxBgPicture">
            <el-input v-model="form.boxBgPicture" placeholder="请输入箱子背景图片" />
            <uploadImg  :fileList="form.boxBgPicture?[{url:form.boxBgPicture}]:[]" @getShopProfileFn="(url)=>{form.boxBgPicture=url}"/>
          </el-form-item>

       </div>
       <div style="margin-left: 40px;">
          <el-form-item label="箱子悬浮背景色" prop="boxHoverColor">
            <el-input v-model="form.boxHoverColor" placeholder="请输入箱子悬浮背景色"/>
            <uploadImg :fileList="form.boxHoverColor?[{url:form.boxHoverColor}]:[]" @getShopProfileFn="(url)=>{form.boxHoverColor=url}"/>
          </el-form-item>
          <!-- 增加箱子新增选项 -->
          <el-form-item label="箱子价格；美元" prop="boxPrice">
            <el-input v-model="form.boxPrice" placeholder="请输入箱子价格；美元"  maxlength="4"/>
          </el-form-item>
          <el-form-item label="游戏组id外键" prop="groupId">
            <el-input v-model="form.groupId" placeholder="请输入游戏组id外键" readonly="true" />
          </el-form-item>
          <!--<el-form-item label="排序" prop="orderIndex">
            <el-input v-model="form.orderIndex" placeholder="请输入排序" />
          </el-form-item>-->
          <el-form-item label="成本价格" prop="boxCost">
            <el-input v-model="form.boxCost" placeholder="请输入成本价格"  maxlength="4"/>
          </el-form-item>
          <el-form-item label="推广号成本价格" prop="boxCostExtension">
            <el-input v-model="form.boxCostExtension" placeholder="请输入推广号成本价格"  maxlength="4"/>
          </el-form-item>
          <el-form-item label="管控上限阈值" prop="threshold">
            <el-input v-model="form.threshold" placeholder="请输入管控上限阈值"  maxlength="10"/>
          </el-form-item>
          <el-form-item label="管控下限阈值" prop="lowerThreshold">
            <el-input v-model="form.lowerThreshold" placeholder="请输入管控下限阈值"  maxlength="10"/>
          </el-form-item>
          <el-form-item label="高价值物品爆率" prop="highProbability">
            <el-input v-model="form.highProbability" placeholder="请输入高价值物品爆率" maxlength="10" />
          </el-form-item>
       </div>

      
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
import { listBox, getBox, delBox, addBox, updateBox, exportBox ,addGoods,getBoxGoods} from "@/api/box/box";
import { listGroup } from "@/api/box/group";
import { listGoods } from "@/api/remote";

export default {
  name: "Box",
  data() {
    return {
      isSubmit:false,
      totalChaXun:0,
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
      // 箱子表格数据
      boxList: [],
      // 弹出层标题
      title: "",
      // 弹出层标题1
      title1: "",
      // 弹出层标题2
      title2: "",
      // 是否显示弹出层
      open: false,
      //是否显示公用商品库弹出层
      openGoods:false,
      //是否显示存放商品弹出层
      chooseGoods:false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        boxName: undefined,
        groupId: undefined,
      },
      // 查询参数
      boxGroupParams: {
        pageNum: 1,
        pageSize: 10,
      },
      // 商品查询参数
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
        groupId: [
          { required: true, message: "箱子分组不能为空", trigger: "blur" }
        ],
        boxType:[
          { required: true, message: "箱子类型不能为空", trigger: "blur" }
        ],
        algoType: [
          { required: true, message: "算法类型不能为空",trigger:'blur'}
        ],
        boxName: [
          { required: true, message: "箱子名称不能为空", trigger: "blur" }
        ],
        goodsPicture: [
          { required: true, message: "商品图片不能为空", trigger: "blur" }
        ],
        boxPicture:[
          { required: true, message: "箱子图片不能为空", trigger: "blur" }
        ],
        boxPrice: [
          { required: true, message: "箱子价格不能为空",trigger:'blur'}
        ],
        groupId: [
          { required: true, message: "游戏组id外键不能为空", trigger: "blur" }
        ],
        boxCost: [
          { required: true, message: "成本价格不能为空", trigger: "blur" }
        ],
        boxCostExtension:[
          { required: true, message: "推广号成本价格不能为空", trigger: "blur" }
        ],
        threshold: [
          { required: true, message: "管控上限阈值不能为空",trigger:'blur'}
        ],
        lowerThreshold:[
          { required: true, message: "管控下限阈值不能为空", trigger: "blur" }
        ],
        highProbability: [
          { required: true, message: "高价值物品爆率不能为空",trigger:'blur'}
        ],
      },
      groupList: [],
      //公用商品库中的商品
      goodsList:[],
      // 总条数
      totalGoods: 0,
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
      totalChooseGoods: 0,
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
      ]
    };
  },
  beforeMount(){
    this.getList();
  },
  created() {
    this.getBoxGroup();
    this.getListGoods();
  },
  methods: {
    changeGroupId(id){
      console.log(id)
      this.from.groupId = id;
    },
    //将调接口添加商品
    addGoodsListUpdate(){
      this.boxGoodsJson1=[];
      this.addGoodsId="";
      var goodsWeightTotal = 0;
      var goodsWeightExtensionTotal = 0;
      this.goodsListUpdate.forEach((value,index)=>{
        if(value.checkControl===true){
          value.checkControl=1;
        }else{
          value.checkControl=0;
        }
        if(value.checkIgnore===true){
          value.checkIgnore=1;
        }else{
          value.checkIgnore=0;
        }
        this.boxGoodsJson1.push({
          goodsId:value.goodsId,
          object1:{
            "goodsWeight": value.goodsWeight,
            "goodsWeightExtension": value.goodsWeightExtension,
            "checkControl": value.checkControl,
            "checkIgnore": value.checkIgnore
          }
        })
        goodsWeightTotal += parseInt(value.goodsWeight,10);
        goodsWeightExtensionTotal += parseInt(value.goodsWeightExtension,10);
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
      if(!this.isSubmit){
        if(goodsWeightTotal===100&&goodsWeightExtensionTotal===100){
          this.isSubmit = true;
          addGoods(params).then(res => {
            // if(res.code===200){
              this.msgSuccess("添加成功！");
              this.chooseGoods = false;
              setTimeout(()=>{
                this.isSubmit=false;
              },500)
          });
        }else{
          this.msgError("请按照规则填写权重或！");
        }
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
    //从商品库选择商品添加到添加商品
    goodsChoose(row){
      const isAdd = this.goodsListUpdate.some((value,index) => row.goodsId===this.goodsListUpdate[index].goodsId)
      if(!isAdd){
        this.goodsListUpdate.push(row);
        this.goodsList.forEach((value,index)=>{
          if(row.goodsId===this.goodsList[index].goodsId){
            this.goodsList.splice(index,1);
          }
        })
      }else{
        this.msgError("请勿重复添加相同商品！");
      }
    },

    /**关闭dialog**/
    handleClose(done) {
      // this.$refs.secondFzref.handleRemove();
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
    getBoxGroup() {
      this.loading = true;
      listGroup(this.boxGroupParams).then(response => {
        this.groupList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 查询箱子列表 */
    getList() {
      this.loading = true;
      listBox(this.queryParams).then(response => {
        this.boxList = response.rows;
        console.log(this.boxList)
        this.totalChaXun = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.openGoods = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        lowerThreshold:undefined,
        upperThreshold:undefined,
        tgCostPrise:undefined,
        costPrice:undefined,
        boxId: undefined,
        boxType: undefined,
        boxPrice:undefined,
        algoType: undefined,
        boxName: undefined,
        boxTitle: undefined,
        boxTitleTwo: undefined,
        goodsPicture: undefined,
        boxPicture: undefined,
        boxBgPicture: undefined,
        boxHoverColor: undefined,
        boxLiveIcon: undefined,
        boxAnchorName: undefined,
        boxAnchorAvatar: undefined,
        gameId: undefined,
        groupId: undefined,
        groupName: undefined,
        createDate: undefined,
        orderIndex: undefined,
        openBoxImgClass: undefined,
        drainageHerf: undefined,
        delFlag: undefined,
        fullTenGiveOne: undefined,
        loopFlag: undefined,
        openNum: undefined,
        goodsValue:undefined
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
      this.queryParams.groupId=undefined
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 搜索按钮操作 */
    handleQueryGoods() {
      this.queryParamsGoods.pageNum = 1;
      this.getListGoods();
    },
    /** 重置按钮操作 */
    resetQueryGoods() {
      // this.resetForm("queryGoodsForm");
      this.queryParamsGoods.goodsName = undefined;
      this.queryParamsGoods.hellcaseItem = undefined;
      this.queryParamsGoods.goodsTitle = undefined;
      this.queryParamsGoods.minPrice = undefined;
      this.queryParamsGoods.maxPrice = undefined;
      this.handleQueryGoods();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {

      this.ids = selection.map(item => item.boxId)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加箱子";
    },
    /**显示要上传的弹出层**/
    showUpdateGoods(row){
      this.addBoxId = row.boxId;
      this.chooseGoods = true;
      this.title1 = "添加商品";
      this.goodsListUpdate=[];
      getBoxGoods(row.boxId).then(res => {
        res.data.forEach((value,index)=>{
          if(value.checkControl===1){
            value.checkControl=true;
          }else{
            value.checkControl=false;
          }
          if(value.checkIgnore===1){
            value.checkIgnore=true;
          }else{
            value.checkIgnore=false;
          }
          
          this.goodsListUpdate.push(value)

        });
      });
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
      const boxId = row.boxId || this.ids
      getBox(boxId).then(response => {
        console.log("------------------修改箱子")
        console.log(response)
        this.form= Object.assign(response.data.boxOpenInfo,response.data.box)
        if(this.form.boxType===0){this.form.boxType="抽奖箱子"}
        if(this.form.algoType===1){this.form.algoType="商品管控算法"}
        this.form.boxType
        this.open = true;
        this.title = "修改箱子";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.boxId != undefined) {
            var params = this.form;
            if(params.boxType=="抽奖箱子"){params.boxType=0}
            if(params.algoType=="商品管控算法"){params.algoType=1}
            updateBox(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else { 
            addBox(this.form).then(response => {
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
      console.log(row)
      const boxIds = row.boxId || this.ids;
      const boxNames = row.boxName;
      this.$confirm(this.ids.length===0?'确定删除此商品吗？':'确定删除'+this.ids.length+'个商品吗？', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delBox(boxIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有箱子数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportBox(queryParams);
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
  width: 100px;
}
.dialogDiv{
  min-height: 700px!important;
}
button.el-button.addGoods.el-button--text.el-button--mini{
  position: absolute;
  top: 54px;
  right: 50px;
}
.addBoxes div.el-form-item__content{
  display: inline-block;
  float:right;
}
.addBoxes div.el-select.el-select--medium{
  width: 185px;
}

</style>
