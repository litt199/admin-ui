<template>
  <div>
    <el-upload
      ref="uploadImg"
      list-type="picture-card"
      :action="imagesUploadApi"
      :headers="headers"
      :auto-upload="true"
      :data="uploadData"
      :show-file-list="true"
      :on-success="handleSuccess"
      :before-upload="beforeUpload"
      :on-exceed="handleExceed"
      :file-list="fileList"
    >
      <i slot="default" class="el-icon-plus"></i>
      <div slot="file" slot-scope="{file}">
        <img class="el-upload-list__item-thumbnail" :src="file.url" alt />
        <span class="el-upload-list__item-actions">
          <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
            <i class="el-icon-zoom-in"></i>
          </span>
          <span class="el-upload-list__item-delete" @click="handleRemove(file)">
            <i class="el-icon-delete"></i>
          </span>
        </span>
      </div>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt />
    </el-dialog>
  </div>
</template>
<script>
import { getToken } from '@/utils/auth'
export default {
  props: {
    fileList:Array
  },
  data() {
    return {
      disabled: false,
      uploadData: {
        file: "",
        project: ""
      },
      imageUrl: "",
      dialogImageUrl: "",
      dialogVisible: false,
      headers: {   Authorization: 'Bearer ' + getToken()},
      imagesUploadApi: process.env.VUE_APP_BASE_API + "/upload/img", // 上传的图片服务器地址,
    };
  },
  created(){},
  methods: {
    handleRemove(file) {
      console.log(file)
      this.$emit("getShopProfileFn", "");
      console.log(this.$refs.uploadImg)
      this.$refs.uploadImg.clearFiles();
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    beforeUpload(file) {
      this.uploadData.file = file;
      console.log(file)
      const isLt2M = file.size / 1024 / 1024 < 1000;
      console.log(file.size / 1024 / 1024)
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 1000MB!");
        return isLt2M;
      }
    },
    // 上传成功后，但存在不保存情况
    handleSuccess(res, file) {
      if (res.code === 0) {
        this.imageUrl = res.url;
        this.$emit("getShopProfileFn", this.imageUrl);
        console.log("上传成功")
      } else {
        this.$message.error("图片上传失败");
      }
    },
    handleExceed(files, fileList) {
      this.$message.error("只能上传一张图片");
    }
  },
};
</script>