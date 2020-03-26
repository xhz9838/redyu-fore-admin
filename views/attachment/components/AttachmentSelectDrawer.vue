<template>
  <div>
    <el-drawer
      title="选择附件"
      :size="isMobile()?'100%':'30%'"
      :append-to-body="true"
      :visible.sync="AttachmentSelectDrawer"
       :before-close="handleClose"
    >
      <el-divider></el-divider>
      <div style="padding:20px">
        <div class="demo-fit">
          <span
            class="block"
            v-for="(item, index) in attachmentPageInfo.list"
            :key="index"
            @click="selectAttachment(item.path)"
          >
            <el-avatar
              shape="square"
              :size="150"
              v-show="!handleJudgeMediaType(item)"
              src="http://img.redyu.run/placeholder.jpg"
            ></el-avatar>
            <el-avatar
              shape="square"
              :size="150"
              v-show="handleJudgeMediaType(item)"
              :src="item.thumbPath"
            ></el-avatar>
          </span>
        </div>

        <el-divider></el-divider>
        <el-pagination
          background
          layout="prev, pager, next"
          :total="attachmentPageInfo.total"
          :page-size="attachmentPageInfo.pageSize"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </div>
      <br />
      <br />
      <br />
      <div class="footer-toolbar" :style="{ width: isSideMenu() && isDesktop() ? '30%' : '100%'}">
        <el-button @click="dialogVisible = true" style="float:right;margin-right:10px">上传附件</el-button>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { mixin, mixinDevice } from "@/utils/mixin.js";
import { uploads, AttachmentForPage } from "@/api/attachment.js";
export default {
  mixins: [mixin, mixinDevice],
  name: "AttachmentSelectDrawer",
  data() {
    return {
      // innerDrawer: false,
      attachmentPageInfo: {},
      attachmentQuery: {
        pageSize: 6,
        pageNum: 1,
        name: "",
        suffix: "",
        type: ""
      }
    };
  },
  props: {
    AttachmentSelectDrawer: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleClose(){
        this.$emit("innerDrawerClose", false);
    },
    handleCurrentChange(val) {
      this.attachmentQuery.pageNum = val;
      this.getAllAttachment();
    },
    handleJudgeMediaType(attachment) {
      var mediaType = attachment.mediaType;
      // 判断文件类型
      if (mediaType) {
        var prefix = mediaType.split("/")[0];

        if (prefix === "image") {
          // 是图片
          return true;
        } else {
          // 非图片
          return false;
        }
      }
      // 没有获取到文件返回false
      return false;
    },
    getAllAttachment() {
      AttachmentForPage(this.attachmentQuery).then(response => {
        this.attachmentPageInfo = response.data;
      });
    },
    selectAttachment(url) {
      // this.imgUrl = url;
      
      this.$emit("postThumbnail", url);
      this.$emit("attachmentSelectDrawerClose", false);
     
    }
  },
  created() {
    this.getAllAttachment();
  }
};
</script>

<style>
</style>