<template>
  <div class="app-container">
    <!--<el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="商品名称" prop="goodsName" >
        <el-input
          v-model="queryParams.goodsName"
          placeholder="请输入商品名称"
          clearable
          size="small"
          @keyup.enter.native="handleQueryGoods"
        />
      </el-form-item>
      <el-form-item label="分类" style="white-space:nowrap">
        <el-select v-model="queryParams.hellcaseItem" placeholder="全部">
          <el-option
            v-for="item in typeList"
            :key="item.index"
            :label="item.goodsType"
            :value="item.goodsType">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="磨损度" style="white-space:nowrap">
        <el-select v-model="queryParams.goodsTitle" placeholder="全部">
          <el-option
            v-for="item in abraList"
            :key="item.index"
            :label="item.name"
            :value="item.name">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>-->

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['obcase:exchange:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['obcase:exchange:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['obcase:exchange:export']"
        >导出</el-button>
      </el-col>
    </el-row>


    <el-table v-loading="loading" :data="exchangeList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="商品名称" align="center" prop="goodsName" />
      <el-table-column label="磨损度" align="center" prop="goodsTitle" />
      <el-table-column label="商品图片" align="center" prop="goodsPicture">
        <template slot-scope="scope">
          <img class="scope_img" :src="scope.row.goodsPicture" alt="">
        </template>
      </el-table-column>
      <el-table-column label="商品价格" align="center" prop="goodsPrice" />
      <el-table-column label="库存数量" align="center" prop="stock" />
      <!-- <el-table-column label="创建用户" align="center" prop="createUser" /> -->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['obcase:exchange:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['obcase:exchange:remove']"
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

    <!--修改商品库存对话框-->
    <el-dialog :visible.sync="changeOpen" :before-close="cancleClose" width="20%" style="top: 200px;">
      <span>库存数量：</span><el-input class="exchangeChange" v-model="changeNum" placeholder="请输入商品数量"/>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmClick">确 定</el-button>
        <el-button @click="cancleCkick">取 消</el-button>
      </span>
    </el-dialog>

   <!-- 添加商品对话框 -->
   <el-dialog :title="title" :visible.sync="open" width="1330px" append-to-body>
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
  <el-dialog :visible.sync="dialogVisible" :before-close="handleClose" width="20%" style="top: 200px;">
    <span>库存数量：</span><el-input class="exchangeChange" v-model="goodNum" placeholder="请输入商品数量"/>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="addGoods(goodNum)">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </span>
  </el-dialog>

  </div>
</template>

<script>
import { listExchange, getExchange, delExchange, addExchange, updateExchange, exportExchange } from "@/api/exchange";
import { listGoods } from "@/api/remote";

export default {
  name: "Exchange",
  data() {
    return {
      changeOpen:false,
      dialogVisible:false,
      changeNum:"",
      addRow:{},
      changeId:null,
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
      // 总条数
      totalGoods: 0,
      // 兑换商品表格数据
      exchangeList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        goodsName:undefined,
        hellcaseItem:undefined,
        goodsTitle:undefined,
        goodsId: undefined,
        stock: undefined,
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
      //添加商品列表
      goodsList:[],
      //当前选择的商品库存
      goodNum: "",
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
  created() {
    this.getList();
    this.getListGoods();
  },
  methods: {
    /**修改库存确定按钮**/
    confirmClick(){
      this.changeOpen = false;
      var data = {
        "id":this.changeId,
        "stock":this.changeNum
      }
      updateExchange(data).then(response => {
        if (response.code === 200) {
          this.msgSuccess("修改成功");
          this.open = false;
          this.getList();
        }
      });
    },
    /**修改库存取消按钮**/
    cancleCkick(){
      this.changeOpen = false;
    },
    /**修改库存取消**/
    cancleClose(){
      this.changeOpen = false;
    },
    /**选择商品**/
    chooseGoods(row){
      this.dialogVisible = true;
      this.addRow = row;
    },
    addGoods(num){
      this.addRow.stock = num;
      addExchange(this.addRow).then(response => {
        if (response.code === 200) {
          this.msgSuccess("新增成功");
          this.open = false;
          this.dialogVisible = false;
          this.getList();
        }
      });

    },
    /**关闭dialog**/
    handleClose(done) {
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
    /** 查询兑换商品列表 */
    getList() {
      this.loading = true;
      listExchange(this.queryParams).then(response => {
        this.exchangeList = response.rows;
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
        stock: undefined,
        createTime: undefined,
        updateTime: undefined,
        createUser: undefined,
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
      this.ids = selection.map(item => item.id)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加兑换商品";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.changeOpen = true;
      this.changeNum = row.stock;
      this.changeId = row.id;
      this.reset();
      const id = row.id || this.ids
      getExchange(id).then(response => {
        this.form = response.data;
        this.title = "修改兑换商品";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateExchange(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addExchange(this.form).then(response => {
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
      this.$confirm('是否确认删除兑换商品编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delExchange(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有兑换商品数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportExchange(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
<style scoped>
  .scope_img{
    height: 80px;
  }
</style>
<style>
.exchangeChange.el-input.el-input--medium{
  width: 274px;
}
</style>>

