<template>
  <div>
    <el-card class="attachment-card">
      <el-form :inline="true" :model="attachmentQuery" class="demo-form-inline">
        <el-form-item label="关键词">
          <el-input v-model="attachmentQuery.keyword" placeholder="关键词"></el-input>
        </el-form-item>
        <el-form-item label="存储位置">
          <el-select v-model="attachmentQuery.type" @change="attachmentForPage" placeholder="存储位置">
            <el-option
              v-for="(type, index) in types"
              :key="index"
              :label="allTypes[type]"
              :value="type"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="文件类型">
          <el-select
            @change="attachmentForPage"
            v-model="attachmentQuery.suffix"
            placeholder="文件类型"
          >
            <el-option
              v-for="(suffix, index) in suffixs"
              :key="index"
              :label="suffix"
              :value="suffix"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="attachmentForPage" icon="el-icon-search">查询</el-button>
          <el-button @click="reset" icon="el-icon-refresh">重置</el-button>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="upload" icon="el-icon-upload">上传</el-button>
      <el-button plain v-if="!isDelete" @click="batchOperation" icon="el-icon-edit">批量操作</el-button>
      <el-button plain type="danger" v-if="isDelete" @click="batchDelete" icon="el-icon-delete">批量删除</el-button>
      <el-button plain v-if="isDelete" @click="cancelDelete" icon="el-icon-close">取消</el-button>
    </el-card>
    <el-card>
      <el-row>
        <el-checkbox-group v-model="checkList">
          <el-col
            :xs="12"
            :sm="6"
            :md="6"
            :lg="4"
            :xl="4"
            v-for="(attachment,index) in attachmentInfo.list"
            :key="index"
          >
            <el-card
              class="cardItem"
              :body-style="isMobile()?{ padding: '0px',height:'130px' }:{ padding: '0px',height:'160px' }"
              style="margin:5px"
            >
              <el-checkbox
                @change="handleCheckedChange($event,attachment)"
                v-if="isDelete"
                size="large"
                class="select-attachment-checkbox"
                :label="attachment.id"
              ></el-checkbox>

              <div :id="'attachment'+attachment.id">
                <div
                  v-loading="loadingImg"
                  @click="attachmentDetail(attachment)"
                  class="attach-thumb"
                >
                  <span v-show="!handleJudgeMediaType(attachment)">当前格式不支持预览</span>

                  <img v-show="handleJudgeMediaType(attachment)" :src="attachment.thumbPath" />
                </div>
                <div
                  @click="attachmentDetail(attachment)"
                  class="ant-card-meta"
                  style="padding: 0.8rem;"
                >
                  <div class="ant-card-meta-detail">
                    <div class="ant-card-meta-description">
                      <span>{{attachment.name | ellipsis}}</span>
                    </div>
                  </div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-checkbox-group>
      </el-row>

      <el-pagination
        background
        style="text-align:center"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="attachmentQuery.pageNum"
        :page-sizes="[12, 18, 24, 30]"
        :page-size="attachmentQuery.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="attachmentInfo.total"
      ></el-pagination>
          <!-- <FilePondUpload
        ref="upload"
        :uploadHandler="uploadHandler"
      ></FilePondUpload> -->
    </el-card>

    <el-dialog
      :width="isMobile()?'100%':'40%'"
      title="上传附件"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
    >
      <span>
        <el-upload
          class="upload-demo"
          drag
          action
          :limit="20"
          :before-upload="beforeUpload"
          show-file-list
          multiple
        >
          <i class="el-icon-upload"></i>
          <div style="width:300px" class="el-upload__text">
            将文件拖到此处，或
            <em>点击上传</em>
          </div>
        </el-upload>

          
      </span>
    </el-dialog>
    <AttachmentDetailDrawer
      :drawerVisible="drawerVisible"
      :attachment="attachmentDetailToChild"
      @close="drawerVisible=false"
    />
    {{checkList}}
  </div>
</template>

<script>
import {
  listSuffix,
  listTypes,
  type,
  AttachmentForPage
} from "../../api/attachment";

import { mixin, mixinDevice } from "@/utils/mixin.js";
import { uploads, deleteByIds } from "../../api/attachment";
import AttachmentDetailDrawer from "./components/AttachmentDetailDrawer";
import FilePondUpload from '../../components/Upload/FilePondUpload'
export default {
  components: {
    AttachmentDetailDrawer,
    FilePondUpload
  },
  mixins: [mixin, mixinDevice],
  data() {
    return {
 
      loadingImg: false,
      isSelection: [],
      checkList: [],
      isDelete: false,
      checked: false,
      drawerVisible: false,
      dialogVisible: false,
      types: [],
      suffixs: [],
      allTypes: ["本地", "七牛云", "阿里云"],
      attachmentInfo: {},
      attachment: {},
      attachmentDetailToChild: {},
      attachmentType: type,
      attachmentQuery: {
        pageSize: 18,
        pageNum: 1,
        name: "",
        suffix: "",
        type: ""
      }
    };
  },
  methods: {
         uploadHandler(){

         },
    cancelDelete() {
      this.checkList.forEach(item => {
        document.getElementById("attachment" + item).className = "";
      });
      this.checkList = [];
      this.isDelete = false;
    },
    handleCheckedChange(val, attachment) {
      if (val) {
        document.getElementById("attachment" + attachment.id).className =
          "cardAttachmentDetail";
      } else {
        document.getElementById("attachment" + attachment.id).className = "";
      }
    },

    batchDelete() {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
            var deleteLoading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
          deleteByIds(this.checkList).then(response => {
            deleteLoading.close()
            this.$message.success("删除成功");
            this.attachmentForPage();
            this.checkList.forEach(item => {
              document.getElementById("attachment" + item).className = "";
            });
            this.checkList = [];
          });
        })
        .catch(() => {
          deleteLoading.close();
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    batchOperation() {
      this.isDelete = true;
    },
    attachmentDetail(attachmentDetail) {
      if (this.isDelete == false) {
        this.drawerVisible = true;
        this.attachmentDetailToChild = attachmentDetail;
      } else {
        this.checked = !this.checked;
        if (this.checkList.indexOf(attachmentDetail.id) != -1) {
          //取消选择
          this.checkList = this.checkList.filter(item => {
            return item != attachmentDetail.id;
          });
          document.getElementById(
            "attachment" + attachmentDetail.id
          ).className = "";
        } else {
          //选择
          this.checkList.push(attachmentDetail.id);
          // document.getElementById("attachment" + attachmentDetail.id).style =
          //   "border: 2px solid rgb(24, 144, 255);box-sizing:border-box;";
          document.getElementById(
            "attachment" + attachmentDetail.id
          ).className = "cardAttachmentDetail";
        }
      }
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
    handleSizeChange(val) {
      this.attachmentQuery.pageSize = val;
      this.attachmentForPage();
    },
    handleCurrentChange(val) {
      this.attachmentQuery.pageNum = val;
      this.attachmentForPage();
    },
    beforeUpload(file, fileList) {
      const loading = this.$loading({
        lock: true,
        text: "上传中请稍等",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      var formdata = new FormData();
      formdata.append("files", file);
      uploads(formdata)
        .then(response => {
          if (response.status == 200) {
            this.$message.success("上传成功");
            loading.close();
            this.attachmentForPage();
          }
        })
        .catch(error => {
          this.$message.error("上传失败");
          loading.close();
        });
      return false;
    },
    // handleExceed() {
    //   this.$message.error("超出最大上传个数");
    // },
    handleClose() {
      this.dialogVisible = false;
    },
    upload() {
      this.dialogVisible = true;
    },
    reset() {
      this.attachmentQuery = {
        pageSize: 18,
        pageNum: 1,
        name: "",
        suffix: "",
        type: ""
      };
      this.attachmentForPage();
    },

    listSuffix() {
      listSuffix().then(response => {
        this.suffixs = response.data;
      });
    },
    listTypes() {
      listTypes().then(response => {
        this.types = response.data;
      });
    },
    attachmentForPage() {
      this.loadingImg = true;
      AttachmentForPage(this.attachmentQuery).then(response => {
        this.attachmentInfo = response.data;
        this.loadingImg = false;
      });
    }
  },
  filters: {
    ellipsis(value) {
      if (!value) return "";
      if (value.length > 12) {
        return value.slice(0, 12) + "...";
      }
      return value;
    }
  },
  created() {
    this.attachmentForPage();
    this.listSuffix();
    this.listTypes();
  }
};
</script>

<style>
.el-upload-dragger {
  width: 325px;
}
.upload-demo {
  text-align: center;
}
.attach-item span,
.attach-thumb span {
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
.attach-thumb {
  width: 100%;
  padding-bottom: 56%;
}
.attach-item,
.attach-thumb,
.attach-thumb span {
  margin: 0 auto;
  position: relative;
  overflow: hidden;
  cursor: pointer;
}

.attach-thumb img,
.attach-thumb span {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}
.ant-card-meta-description {
  color: rgba(0, 0, 0, 0.45);
}
.cardItem {
  cursor: pointer;
  font-size: 14px;
}

.select-attachment-checkbox {
  position: absolute;
}
.cardAttachmentDetail {
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  border: 3px solid rgb(24, 144, 255);
}
.el-checkbox__label {
  color: #fff;
}
</style>