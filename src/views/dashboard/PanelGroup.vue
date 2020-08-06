<template>
  <el-row :gutter="40" class="panel-group">
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('newVisitis')">
        <div class="card-panel-icon-wrapper icon-people">
          <svg-icon icon-class="peoples" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            注册用户数
            <span>(日)</span>
          </div>
          <count-to :start-val="0" :end-val="data.todayRegister" :duration="2600" class="card-panel-num" />
          <div class="card-panel-num1"> 
             总用户数
          <count-to :start-val="0" :end-val="data.totalRegister" :duration="2600" class="" />
          </div>
          
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('messages')">
        <div class="card-panel-icon-wrapper icon-message">
          <svg-icon icon-class="message" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            登陆数
            <span>(日)</span>
          </div>
          <count-to :start-val="0" :end-val="data.todayRegister" :duration="2600" class="card-panel-num" />
          <div class="card-panel-num1"> 
             登录累计
          <count-to :start-val="0" :end-val="data.totalLogin" :duration="2600" class="" />
          </div>
          
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('purchases')">
        <div class="card-panel-icon-wrapper icon-money">
          <svg-icon icon-class="money" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            开箱数
            <span>(日)</span>
          </div>
          <count-to :start-val="0" :end-val="data.todayOpenBoxNum" :duration="2600" class="card-panel-num" />
          <div class="card-panel-num1"> 
             总开箱数
          <count-to :start-val="0" :end-val="data.totalOpenBoxNum" :duration="2600" class="" />
          </div>
          
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('shoppings')">
        <div class="card-panel-icon-wrapper icon-shopping">
          <svg-icon icon-class="shopping" class-name="card-panel-icon" />
        </div>
       <div class="card-panel-description">
          <div class="card-panel-text">
            充值金额
            <span>(日)</span>
          </div>
          <count-to :start-val="0" :end-val="data.todayMoney" :duration="2600" class="card-panel-num" />
          <div class="card-panel-num1"> 
             累计充值
          <count-to :start-val="0" :end-val="data.totalMoney" :duration="2600" class="" />
          </div>
          
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'
import {getHomeIndex} from '@/api/hpapi'
export default {
  components: {
    CountTo
  },
  data(){
    return{
      data:"",
    }
  },
  mounted(){
    getHomeIndex().then((res)=>{
      console.log(res)
      this.data=res.data;
    })
  },
  methods: {
    handleSetLineChartData(type) {
      this.$emit('handleSetLineChartData', type)
    }
  }
}
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #40c9c6;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shopping {
        background: #34bfa3
      }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 23px;
        margin-bottom: 12px;

      }
      .card-panel-text span{
        color: #ff5050;
      }

      .card-panel-num {
        font-size: 25px;
        text-align: right;
        display: block;
        margin-top: -10px;
        
      }
      .card-panel-num1{
        font-size: 16px;
         text-align: right;
         display: block;
         margin-top: 5px;
         color: rgba(0, 0, 0, 0.45);
      }
    }
  }
}

@media (max-width:550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
