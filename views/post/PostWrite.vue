<template>
  <div class="app-container">
    <el-form :label-position="'left'" :rules="rules" :model="post" label-width="60px">
      <el-form-item label="标题" prop="title">
        <el-input v-model="post.title"></el-input>
      </el-form-item>
    </el-form>
    <div id="main">
      <mavon-editor height="400px" ref="md" @imgAdd="$imgAdd" v-model="post.originalContent" />
    </div>
    <div style="margin:30px">
      <el-tooltip placement="top" content="返回顶部" style="z-index: 9999;right:5px;bottom:100px">
        <back-to-top
          :custom-style="myBackToTopStyle"
          :visibility-height="300"
          :back-position="50"
          transition-name="fade"
        />
      </el-tooltip>
    </div>
    <div
      class="footer-toolbar"
      :style="{ width: isSideMenu() && isDesktop() ? `calc(100% - ${$store.state.app.sidebar.opened ? 210 : 56}px)` : '100%'}"
    >
      <el-button
        style="float:right;margin-right:10px"
        @click="()=>this.attachmentDrawerVisible = true"
      >附件库</el-button>
      <el-button style="float:right;margin-right:10px" @click="postSetting" type="primary">发 布</el-button>
      <el-button style="float:right" @click="save" plain type="danger">保存草稿</el-button>
    </div>
    <AttachmentDrawer @drawerClose="drawerCloseFn" :visible="attachmentDrawerVisible" />
    <PostSettingDrawer
      :postSettingDrawer="postSettingDrawer"
      :imgUrl="imgUrl"
      :post="post"
      @postDrawerClose="postSettingFn"
      @innerDrawer="innerDrawerFn"
      @imgUrlChange="imgUrlChangeFn"
      :innerDrawer="innerDrawer"
      @thumbnailChange="thumbnailChangeFn"
    />
    <AttachmentSelectDrawer
      :AttachmentSelectDrawer="innerDrawer"
      @postThumbnail="postThumbnailFn"
      @attachmentSelectDrawerClose="attachmentSelectDrawerCloseFn"
      @innerDrawerClose="innerDrawerCloseFn"
    />
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
    <!-- <el-dialog
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
    </el-dialog> -->
    <br />
    <br />
  </div>
</template>

<script>
import { mixin, mixinDevice } from "@/utils/mixin.js";
import BackToTop from "@/components/BackToTop";
import { uploads, AttachmentForPage } from "@/api/attachment.js";
import { createPost, postById } from "@/api/post.js";
import AttachmentDrawer from "../attachment/components/AttachmentDrawer";
import PostSettingDrawer from "../post/components/PostSetting";
import AttachmentSelectDrawer from "../attachment/components/AttachmentSelectDrawer";
let id = 0;
export default {
  mixins: [mixin, mixinDevice],
  components: {
    BackToTop,
    AttachmentDrawer,
    PostSettingDrawer,
    AttachmentSelectDrawer
  },
  data() {
    return {
      attachmentDrawerVisible: false,
      dialogVisible: false,
      isRouterAlive: true,
      attachmentPageInfo: {},
      tags: [],
      tagIds: [],
      imgUrl: "http://img.redyu.run/placeholder.jpg",
     
      innerDrawer: false,
      // customizable button style, show/hide critical point, return position
      myBackToTopStyle: {
        right: "50px",
        bottom: "50px",
        width: "40px",
        height: "40px",
        "border-radius": "4px",
        "line-height": "45px", // 请保持与高度一致以垂直居中 Please keep consistent with height to center vertically
        background: "#e7eaf1" // 按钮的背景颜色 The background color of the button
      },

      editCategory: false,

      defaultProps: {
        children: "children",
        label: "name"
      },
      props: {
        children: "children",
        label: "name",
        value: "id",
        emitPath: false,
        checkStrictly: true
      },
      post: {
        title: "",
        status: "",
        url: "",
        originalContent: "",
        formatContent: "",
        summary: "",
        thumbnail: "",
        topPriority: 0,
        tagIds: [],
        categoryIds: []
      },

      checkTags: [],
      rules: {
        title: [
          { required: true, message: "请输入标题", trigger: "blur" },
          { min: 1, max: 80, message: "长度在1到80个字符", trigger: "blur" }
        ]
      },
      postSettingDrawer: false
    };
  },

  methods: {
      // 绑定@imgAdd event
        $imgAdd(pos, $file){
            // 第一步.将图片上传到服务器.
           var formdata = new FormData();
           formdata.append('files', $file);
            uploads(formdata)
        .then(response => {
          console.info(response)
            this.$refs.md.$img2Url(pos, response.data[0].path);
        })
          //  axios({
          //      url: process.env.VUE_APP_BASE_API+'/admin/attachment/uploads',
          //      method: 'post',
          //      data: formdata,
          //      headers: { 'Content-Type': 'multipart/form-data' },
          //  }).then((url) => {
          //      // 第二步.将返回的url替换到文本原位置![...](0) -> ![...](url)
          //      /**
          //      * $vm 指为mavonEditor实例，可以通过如下两种方式获取
          //      * 1. 通过引入对象获取: `import {mavonEditor} from ...` 等方式引入后，`$vm`为`mavonEditor`
          //      * 2. 通过$refs获取: html声明ref : `<mavon-editor ref=md ></mavon-editor>，`$vm`为 `this.$refs.md`
          //      */
          //      $vm.$img2Url(pos, url);
          //  })
        },
    thumbnailChangeFn(thumbnailChange){
      this.post.thumbnail=thumbnailChange;
    },
    imgUrlChangeFn(imgUrl) {
      this.imgUrl = imgUrl;
    },
    innerDrawerCloseFn(innerDrawerClose) {
      this.innerDrawer = innerDrawerClose;
    },
    attachmentSelectDrawerCloseFn(attachmentSelectDrawerClose) {
      this.innerDrawer = attachmentSelectDrawerClose;
    },
    postThumbnailFn(postThumbnail) {
      this.imgUrl = postThumbnail;
      this.post.thumbnail = postThumbnail;
    },
    innerDrawerFn(innerDrawer) {
      this.innerDrawer = innerDrawer;
    },
    postSettingFn(drawerClose) {
      this.postSettingDrawer = drawerClose;
    },
    handleClose() {
      this.dialogVisible = false;
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
    createPost() {
      this.post.status = "PUBLISHED";
      createPost(this.post).then(response => {
        if (response.status == 200) {
          this.$notify({
            title: "成功",
            message: "发布成功",
            type: "success"
          });
          this.$router.push({ name: "PostList" });
        }
      });
    },

    postSetting() {
      this.postSettingDrawer = true;
    },
    remove() {
      this.post.thumbnail = "";
      this.imgUrl = "http://img.redyu.run/placeholder.jpg";
    },
    selectAttachment(url) {
      this.imgUrl = url;
      this.post.thumbnail = url;
      this.innerDrawer = false;
    },
    save() {
      this.post.status = "DRAFT";
      createPost(this.post).then(response => {
        if (response.status == 200) {
          this.$notify({
            title: "成功",
            message: "保存草稿成功",
            type: "success"
          });
        }
      });
    },

    drawerCloseFn(val) {
      this.attachmentDrawerVisible = val;
    }
  },
  //   beforeRouteEnter(to, from, next) {
  //   // Get post id from query
  //   const postId = to.query.postId
  //   next(vm => {
  //     if (postId) {
  //      postById(postId).then(response=>{
  //        vm.post=response.data
  //      })
  //     }
  //   })
  // },
  // beforeRouteLeave(to, from, next) {
  //   this.$confirm(
  //     "当前页面数据未保存，确定要离开吗？如果离开当面页面，你的数据很可能会丢失！, 是否继续?",
  //     "提示",
  //     {
  //       confirmButtonText: "确定",
  //       cancelButtonText: "取消",
  //       type: "warning"
  //     }
  //   )
  //     .then(() => {
  //       next();
  //     })
  //     .catch(() => {});
  // },
  created() {
    const postId = this.$route.query.postId;
    if (postId) {
      postById(postId).then(response => {
        this.post = response.data;
        this.imgUrl = response.data.thumbnail;
      });
    }
  }
};
</script>


<style>
.v-note-panel {
  min-height: 600px;
}
.el-form--label-top .el-form-item__label {
  padding: 0px;
}
.el-upload-dragger {
  width: 325px;
}
.upload-demo {
  text-align: center;
}
</style>