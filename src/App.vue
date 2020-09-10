<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default  {
  name:  'App'
}
</script>
<style>
.el-dialog__wrapper .el-upload.el-upload--picture-card,.el-dialog__wrapper  .el-upload-list__item.is-ready,.el-dialog__wrapper .el-upload-list--picture-card .el-upload-list__item{
    width: 100px;
    height: 100px;
    line-height: 104px;
    margin-top: 14px;
  }
  .el-dialog__wrapper  .el-upload-list{
    overflow: hidden;
    height: 100px;

  }
  .el-dialog__wrapper  .el-upload-list__item{
    position: absolute;
    z-index:1000 ;
  }
.el-dialog__wrapper  .el-upload-list--picture-card{
    display: inline-block;
  }
 .el-dialog__wrapper  .el-icon-upload-success.el-icon-check{
    position: absolute;
    right: 14px;
    top: 0px;  
  }
</style>