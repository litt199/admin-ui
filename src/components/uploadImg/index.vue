<template>
  <div>
      <uploadImg
        :on-preview="handlePictureCardPreview"
        :on-success="handleSuccess"
        :on-error="handleError"
        :on-remove='handleRemove'
        :headers="headers"
        :file-list="fileList"
        :action="imagesUploadApi"
        list-type="picture-card"
        ref="dsdsdsd"
      >
        <i class="el-icon-plus" />
      </uploadImg>
      <el-dialog append-to-body :visible.sync="dialogVisible">
        <img :src="dialogImageUrl" width="100%" alt="">
      </el-dialog>
  
  </div>
</template>

<script>
import uploadImg from '../upload'

import { getToken } from '@/utils/auth'
export default {
  name: '',
  props:{
    fileList:Array,
  },
  components: {
    uploadImg
  },
  data() {
    return {
       headers: {   Authorization: 'Bearer ' + getToken()},
       imagesUploadApi: process.env.VUE_APP_BASE_API + "upload/img", // 上传的图片服务器地址,
       dialogImageUrl:"",
       dialogVisible:false
    } 
  },
  mounted(){
    // console.log(this.fileList)
  },
  methods:{
     handleSuccess(response, file, fileList) {
       this.$emit('showImgUrl',file.response.url)
      //  console.log(file.response.url)
    },
    // 监听上传失败
    handleError(e, file, fileList) {
      const msg = JSON.parse(e.message)
      this.$notify({
        title: msg.message,
        type: 'error',
        duration: 2500
      })
      this.$emit('removeImg')
    },
    //放大图片
     handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    //删除图片
    handleRemove(){
      this.$refs.dsdsdsd.$refs["upload-inner"].showOrhide=1;
      this.$emit('removeImg')
    }
  }
}
</script>

<style scoped>


</style>
