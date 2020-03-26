<template>
  <div>
    <el-drawer
      title="选择附件"
      :size="isMobile()?'100%':'30%'"
      :append-to-body="true"
      :visible.sync="visible"
      :before-close="handleClose"
    >
      <div>
        <el-row type="flex" align="middle">
          <el-col :span="24">
            <div>
              <el-input size="small" placeholder="搜索附件" v-model="attachmentQuery.name">
                <el-button @click="attachmentList" slot="append" icon="el-icon-search"></el-button>
              </el-input>
            </div>
            <el-divider></el-divider>
            <div
              v-loading="loadAttachmentList"
              class="attach-item"
              v-for="(attachment,index) in attachmentPageInfo.list"
              :key="index"
               @click="handAttachmentDetail(attachment)"
            >
              <span v-show="!handleJudgeMediaType(attachment)">当前格式不支持预览</span>
              <img
                :src="attachment.path"
                loading="lazy"
                v-show="handleJudgeMediaType(attachment)"
               
              />
            </div>
          </el-col>
        </el-row>

        <!--  -->
        <el-divider></el-divider>
        <div style="padding-bottom:40px;float: right;">
          <el-pagination
            background
            layout="prev, pager, next"
            :total="attachmentPageInfo.total"
            :page-size="attachmentPageInfo.pageSize"
            @current-change="handleCurrentChange"
          ></el-pagination>
        </div>

        <div class="footer-toolbar" :style="{ width: isSideMenu() && isDesktop() ? '30%' : '100%'}">
          <el-button @click="dialogVisible = true" style="float:right;margin-right:10px">上传附件</el-button>
        </div>

        <AttachmentDetailDrawer
          :appendToBody="appendToBody"
          :drawerVisible="drawerVisible"
          :attachment="attachmentDetailToChild"
          @close="drawerVisible=false"
        />
      </div>
    </el-drawer>
    <el-dialog title="提示" :visible.sync="dialogVisible">
      <span>
        <el-upload class="upload1" drag action multiple>
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">
            将文件拖到此处，或
            <em>点击上传</em>
          </div>
          <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mixin, mixinDevice } from "@/utils/mixin.js";
import AttachmentDetailDrawer from "./AttachmentDetailDrawer";
import { AttachmentForPage } from "@/api/attachment";
export default {
  name: "AttachmentDrawer",
  mixins: [mixin, mixinDevice],
  components: {
    AttachmentDetailDrawer
  },
  data() {
    return {
      attachmentDetailToChild:{},
      drawerVisible:false,
      appendToBody:false,
      loadAttachmentList: false,
      attachmentPageInfo: {},
      dialogVisible: false,
      attachmentQuery: {
        pageSize: 10,
        pageNum: 1,
        name: "",
        suffix: "",
        type: ""
      }
    };
  },
  methods: {
    handAttachmentDetail(attachment){
      this.attachmentDetailToChild=attachment;
      this.appendToBody=true;
      this.drawerVisible=true;

    },
    handleCurrentChange(val) {
      this.attachmentQuery.pageNum = val;
      this.attachmentList();
    },
    attachmentList() {
      this.loadAttachmentList = true;
      AttachmentForPage(this.attachmentQuery).then(response => {
        this.attachmentPageInfo = response.data;
        this.loadAttachmentList = false;
      });
    },
    handleClose() {
      this.$emit("drawerClose", false);
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
    }
  },
  props: {
    visible: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  created() {
    this.attachmentList();
  }
};
</script>

<style>
.attach-item,
.attach-thumb,
.photo-thumb {
  margin: 0 auto;
  position: relative;
  overflow: hidden;
  cursor: pointer;
}
.attach-item {
  width: 50%;
  padding-bottom: 28%;
  float: left;
}
.attach-item span,
.attach-thumb span,
.photo-thumb span {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  font-size: 12px;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  color: #9b9ea0;
}
.attach-item img,
.attach-item span,
.attach-thumb img,
.attach-thumb span,
.photo-thumb img,
.photo-thumb span {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}
</style>