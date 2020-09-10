<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['prize:prize:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="setMoney(0)"
          v-hasPermi="['prize:prize:add']"
        >设置奖金</el-button>
      </el-col>
      <!--<el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="setThank"
          v-hasPermi="['prize:prize:add']"
        >设置谢谢参与</el-button>
      </el-col>-->
    </el-row>

    <el-table v-loading="loading" :data="prizeList" >
      <el-table-column type="text" width="55" align="center" />
      <el-table-column label="奖品" align="center">
        <template slot-scope="scope" align="center">
          <img class="scope_img" :src="scope.row.goodsPicture" alt="" v-show="scope.row.goodsPicture">
          <p>{{scope.row.goodsName}}</p>
        </template>
      </el-table-column>
      <el-table-column label="奖金" align="center" prop="money" />
      <el-table-column label="概率" align="center" prop="money">
        <template slot-scope="scope">
          <el-input class="probility" v-model="scope.row.proprite" placeholder="请输入概率" @blur="setProprite(scope.row)" oninput="this.value= this.value.match(/\d+(\.\d{0,10})?/) ? this.value.match(/\d+(\.\d{0,10})?/)[0] : ''"/>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createDate" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['prize:prize:remove']"
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
    <!-- 设置奖金 -->
    <el-dialog :visible.sync="setMoneyShow" :before-close="cancleClose" width="20%" style="top: 200px;">
      <span>奖金：</span><el-input class="modify" v-model="setMoneyLast" placeholder="请输入奖金" oninput="value=value.replace(/[^\d.]/g,'')"  maxlength="4"/>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="setMoney(1)">确 定</el-button>
        <el-button @click="setMoneyShow = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 新增 -->
    <el-dialog :title="title2" :visible.sync="open" width="1330px" append-to-body>
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
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQueryGoods">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQueryGoods">重置</el-button>
        </el-form-item>
      </el-form>
     <el-table v-loading="loading" :data="goodsList">
      <el-table-column type="text" width="55" align="center" />
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
              @click="chooseGoods(scope.row)"
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

    <!--修改商品库存对话框-->
    <el-dialog :visible.sync="confirmOpen" :before-close="cancleClose" width="20%" style="top: 200px;">
      <span>确定要选择此商品吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmClick()">确 定</el-button>
        <el-button @click="cancleClose">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { listPrize, getPrize, delPrize, addPrize, updatePrize, exportPrize,setPrizeMoney,setProprit } from "@/api/prize";
import { listGoods } from "@/api/remote";
  export default {
    name: "Prize",
    data() {
      return {
        //设置金额弹窗
        setMoneyShow:false,
        setMoneyLast:null,
        changeNum:0,
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
        title2: "",
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
        // 每日免费新商品表格数据
        prizeList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        //确认弹窗
        confirmOpen:false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {
        },
        //要添加的商品的id
        addRowId:""
      };
    },
    created() {
      this.getList();
    },
    mounted(){
      this.getListGoods()
    },
    methods: {
      //设置概率
      setProprite(row){
        if(row.proprite){
          let data={
            "id":row.id,
            "proprite":row.proprite
          }
          setProprit(data).then(res=>{
            if(res.code===0){
              this.getList();
              this.msgSuccess("设置成功！");
            }
            
          })
        }
      },
      //设置奖金
      setMoney(num){
          if(num==0){//显示弹窗
            if(this.prizeList.length>7){
              this.msgError("每日奖池数量不能超过8个!");
            }else{
              this.setMoneyShow=true;
            }
          }else if(num==1){
            let data={
              "money":this.setMoneyLast
            }
            if(this.setMoneyLast){
              console.log("--------------data")
              console.log(data)
              setPrizeMoney(data).then(res=>{
                if(res.code===0){
                  this.setMoneyShow=false;
                  this.getList();
                  this.msgSuccess("新增成功");
                }
              })
            }else{
              this.msgError("请输入奖金!");
            }

        }

      },
      //设置谢谢参与
      setThank(){
        if(this.prizeList.length>7){
          this.msgError("每日奖池数量不能超过8个!");
        }else{
          setPrizeMoney({}).then(res=>{
            if(res.code===0){
              this.getList();
              this.msgSuccess("新增成功");
            }
          })
        }
      },
      /**新增商品确定按钮**/
      confirmClick(){
        this.confirmOpen = false;
        let data={
          "goodsId":this.addRowId
        }
        addPrize(data).then(res=>{
          this.getList();
          this.msgSuccess("新增成功");
        })
      },
      /**确认按钮取消**/
      cancleClose(){
        this.confirmOpen = false;
        this.setMoneyShow = false;
      },
      /**选择商品**/
      chooseGoods(row){
        console.log(row)
        this.confirmOpen = true;
        this.addRowId = row.goodsId;
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
      /** 搜索按钮操作 */
      handleQueryGoods() {
        this.queryParamsGoods.pageNum = 1;
        this.getListGoods();
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
      /** 搜索按钮操作 */
      handleQueryGoods() {
        this.queryParamsGoods.pageNum = 1;
        this.getListGoods();
      },
      /** 查询每日免费新商品列表 */
      getList() {
        this.loading = true;
        console.log(this.queryParams)
        listPrize(this.queryParams).then(response => {
          console.log("------------------------每日奖品")
          console.log(response.rows)
          this.prizeList = response.rows;
          this.prizeList.forEach((value,index)=>{
            if(value.goodsName===null&&value.money===null){
              this.prizeList[index].money="参与奖";
              this.prizeList[index].goodsName="参与奖"
            }
          })
          this.prizeList = response.rows;
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
          goodsId: undefined,
          money: undefined,
          proprite: undefined,
          createDate: undefined,
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
        this.title = "添加每日免费新商品";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const id = row.id || this.ids
        getPrize(id).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = "修改每日免费新商品";
        });
      },
      /** 提交按钮 */
      submitForm: function() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.id != undefined) {
              updatePrize(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess("修改成功");
                  this.open = false;
                  this.getList();
                }
              });
            } else {
              addPrize(this.form).then(response => {
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
        console.log(ids)
        this.$confirm('是否确认删除每日免费此数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delPrize(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
      },
      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams;
        this.$confirm('是否确认导出所有每日免费新商品数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportPrize(queryParams);
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
</style>
<style scoped>
.modify.el-input.el-input--medium{
  width: 300px;
}
.probility.el-input.el-input--medium{
  width: 150px;
}
</style>

