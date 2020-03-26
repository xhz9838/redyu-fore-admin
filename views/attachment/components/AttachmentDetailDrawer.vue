<template>
  <div>
    <el-drawer
      :append-to-body="appendToBody"
      :size="isMobile()?'100%':'28%'"
      title="附件详情"
      :visible.sync="drawerVisible"
      :direction="direction"
      :before-close="handleClose"
    >
      <span>
        <div>
          <div v-show="nonsupportPreviewVisible" class="list-item-meta-title">此文件不支持预览</div>
          <a :href="attachment.path" target="_blank">
            <img :src="attachment.path" v-show="photoPreviewVisible" style="width: 100%;" />
          </a>
        </div>
        <el-divider></el-divider>
        <div>
          <span class="list-item-meta-title">附件名:</span>
          <el-button type="text" @click="editName" icon="el-icon-edit"></el-button>
          <div v-show="!isEdit" class="detailList">{{attachment.name}}</div>
          <el-input
            size="small"
            @blur="doUpdateAttachment"
            v-show="isEdit"
            v-model="attachment.name"
            placeholder="请输入附件名"
          ></el-input>
        </div>
        <el-divider></el-divider>
        <div>
          <span class="list-item-meta-title">附件类型:</span>
          <div class="detailList">{{attachment.mediaType}}</div>
        </div>
        <el-divider></el-divider>
        <div>
          <span class="list-item-meta-title">储存位置:</span>
          <div class="detailList">{{attachment.type | typeProperty}}</div>
        </div>
        <el-divider></el-divider>
        <div>
          <span class="list-item-meta-title">附件大小:</span>
          <div class="detailList">{{ attachment.size | fileSizeFormat }}</div>
        </div>
        <el-divider></el-divider>
        <div v-if="photoPreviewVisible">
          <span class="list-item-meta-title">图片尺寸:</span>
          <div class="detailList">{{attachment.height+'x'+attachment.width}}</div>
          <el-divider></el-divider>
        </div>
        <div>
          <span class="list-item-meta-title">上传日期:</span>
          <div class="detailList">{{$moment(attachment.createTime).format('YYYY-MM-DD HH:mm')}}</div>
          <el-divider></el-divider>
        </div>
        <div>
          <span class="list-item-meta-title">
            普通链接:
            <a href="javascript:void(0);" @click="handleCopyNormalLink">
              <i class="el-icon-document-copy"></i>
            </a>
          </span>
          <div class="detailList">{{attachment.path}}</div>
          <el-divider></el-divider>
        </div>
        <div>
          <span class="list-item-meta-title">
            Markdown 格式:
            <a href="javascript:void(0);" @click="handleCopyMarkdownLink">
              <i class="el-icon-document-copy"></i>
            </a>
          </span>
          <div class="detailList">![{{attachment.name}}]({{attachment.path}})</div>
          <el-divider></el-divider>
        </div>
      </span>
    </el-drawer>
  </div>
</template>

<script>
import { mixin, mixinDevice } from "@/utils/mixin.js";
import { update } from "../../../api/attachment";
export default {
  name: "AttachmentDetailDrawer",
  mixins: [mixin, mixinDevice],
  data() {
    return {
      drawer: false,
      direction: "rtl",
      name: "",
      isEdit: false,
      photoPreviewVisible: false,
      videoPreviewVisible: false,
      nonsupportPreviewVisible: false
    };
  },
  watch: {
    attachment: function(newValue, oldValue) {
      if (newValue) {
        var attachment = newValue;
        this.handleJudgeMediaType(attachment);
      }
    }
  },
  methods: {
    handleCopyNormalLink() {
      const text = `${encodeURI(this.attachment.path)}`;
      this.$copyText(text)
        .then(message => {
          console.log("copy", message);
          this.$message.success("复制成功！");
        })
        .catch(err => {
          console.log("copy.err", err);
          this.$message.error("复制失败！");
        });
    },
    handleCopyMarkdownLink() {
      const text = `![${this.attachment.name}](${encodeURI(
        this.attachment.path
      )})`;
      this.$copyText(text)
        .then(message => {
          console.log("copy", message);
          this.$message.success("复制成功！");
        })
        .catch(err => {
          console.log("copy.err", err);
          this.$message.error("复制失败！");
        });
    },
    handleJudgeMediaType(attachment) {
      var mediaType = attachment.mediaType;
      // 判断文件类型
      if (mediaType) {
        var prefix = mediaType.split("/")[0];

        if (prefix === "video" || prefix === "flv") {
          this.videoPreviewVisible = true;
          this.photoPreviewVisible = false;
          this.nonsupportPreviewVisible = false;
          // 设置视频地址
          this.$set(this.playerOptions.sources, 0, {
            type: mediaType,
            src: attachment.path
          });
          console.log(this.playerOptions.sources);
        } else if (prefix === "image") {
          this.photoPreviewVisible = true;
          this.videoPreviewVisible = false;
          this.nonsupportPreviewVisible = false;
        } else {
          this.nonsupportPreviewVisible = true;
          this.videoPreviewVisible = false;
          this.photoPreviewVisible = false;
        }
      }
    },
    doUpdateAttachment() {
      if (!this.attachment.name) {
        this.$notify.error({
          title: "错误",
          message: "附件名不能为空"
        });
        return;
      }

      update(this.attachment.id, this.attachment).then(response => {
        this.$message.success("附件修改成功！");
      });
      this.isEdit = false;
    },
    editName() {
      this.isEdit = !this.isEdit;
    },
    handleClose() {
      this.$emit("close", false);
    }
  },
  props: {
    attachment: {
      type: Object,
      require: true
    },
    drawerVisible: {
      type: Boolean,
      required: false,
      default: true
    },
    appendToBody: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  filters: {
    typeProperty(type) {
      let allType = ["本地", "七牛云", "阿里云"];
      return allType[type];
      // if(type==0){
      //   return "本地"
      // }else if(type==1){
      //   return "七牛云"
      // }else if(type==2){
      //   return "阿里云"
      // }
    }
  }
};
</script>


<style>
.el-divider--horizontal {
  margin: 15px 0px 15px 0px;
}
.el-drawer__body {
  padding: 0px 20px 20px 20px;
}
.detailList {
  color: rgba(0, 0, 0, 0.45);
  font-size: 14px;
  line-height: 22px;
}
.list-item-meta-title {
  margin-bottom: 4px;
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
  line-height: 22px;
}
a {
  color: #1890ff;
}
</style>