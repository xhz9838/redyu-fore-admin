<template>
  <div class="app-container">
    <el-tabs type="border-card">
      <el-tab-pane>
        <span slot="label">
          <i class="el-icon-setting"></i> 常规设置
        </span>
        我的行程
      </el-tab-pane>
      <el-tab-pane>
        <span slot="label">
          <i class="el-icon-setting"></i> 附件设置
        </span>
        <el-row>
           <el-col :xs="20" :sm="12" :md="10" :lg="8" :xl="6">
             
             <el-form ref="form" size="small" label-position="top" :model="options" label-width="80px">
              <el-form-item label="上传图片时预览：">
                <el-switch
                  v-model="options.attachment_upload_image_preview_enable"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                ></el-switch>
              </el-form-item>
              <el-form-item label="最大上传文件数:">
                <el-input type="number" v-model="options.attachment_upload_max_files"></el-input>
              </el-form-item>
              <el-form-item label="同时上传文件数:">
                <el-input type="number" v-model="options.attachment_upload_max_parallel_uploads"></el-input>
              </el-form-item>
              <el-form-item label="存储位置:">
                <el-select v-model="options.region" style="width:100%"  placeholder="请选择存储位置">
                  <el-option label="本地" value="shanghai"></el-option>
                  <el-option label="阿里云" value="beijing"></el-option>
                  <el-option label="七牛云" value="beijing"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
           </el-col>

 
          <!-- <el-col :span="8">
            <el-form ref="form" size="small" label-position="top" :model="options" label-width="80px">
              <el-form-item label="上传图片时预览：">
                <el-switch
                  v-model="options.attachment_upload_image_preview_enable"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                ></el-switch>
              </el-form-item>
              <el-form-item label="最大上传文件数:" width="100px">
                <el-input type="number" v-model="options.attachment_upload_max_files"></el-input>
              </el-form-item>
              <el-form-item label="同时上传文件数:">
                <el-input type="number" v-model="options.attachment_upload_max_parallel_uploads"></el-input>
              </el-form-item>
              <el-form-item label="存储位置:">
                <el-select v-model="options.region"  placeholder="请选择存储位置">
                  <el-option label="区域一" value="shanghai"></el-option>
                  <el-option label="区域二" value="beijing"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="16">
            <div class="grid-content bg-purple-light"></div>
          </el-col> -->
        </el-row>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      options: {}
    };
  }
};
</script>

<style>
</style>