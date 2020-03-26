<template>
  <div>
    <el-drawer
      :size="isMobile()?'100%':'32%'"
      :show-close="true"
      title="文章设置"
      :visible.sync="postSettingDrawer"
      :before-close="handleClose"
    >
     
      <div style="margin:0px 20px 20px 20px">
        <!-- <div>基本设置</div> -->
        <el-form label-position="top" size="small" :model="post" label-width="80px">
          <el-form-item label="文章路径">
            <el-input v-model="post.url" autocomplete="off"></el-input>
            {{exampleUrl}}
          </el-form-item>
          <el-form-item label="是否置顶">
            <el-radio-group v-model="post.topPriority">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-divider></el-divider>
          <el-form-item label="文章分类">
            <el-tree
              ref="category"
              :data="categoryList"
              show-checkbox
              node-key="id"
              :default-expand-all="true"
              :props="defaultProps"
              @check-change="changeCategory"
              :default-checked-keys="post.categoryIds"
            ></el-tree>
          </el-form-item>

          <el-form-item v-if="!editCategory">
            <el-button @click="editCategory=true">新增分类</el-button>
          </el-form-item>
          <el-form-item v-if="editCategory" label="请选择父分类">
            <el-cascader
              :options="categoryList"
              v-model="category.parentId"
              placeholder="默认为父分类"
              :props="props"
              :show-all-levels="false"
            ></el-cascader>
          </el-form-item>

          <el-form-item label="分类名称" v-if="editCategory">
            <el-input v-model="category.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="分类路径" v-if="editCategory">
            <el-input v-model="category.slugName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item v-if="editCategory">
            <el-button @click="addCategory">确定</el-button>
            <el-button type="primary" @click="editCategory=false">取消</el-button>
          </el-form-item>

          <el-divider></el-divider>
          <el-form-item label="标签">
            <el-select
              v-if="isRouterAlive"
              v-model="post.tagIds"
              multiple
              :filterable="true"
              allow-create
              default-first-option
              placeholder="请选择文章标签"
              clearable
              name="tag"
              @change="changTag"
            >
              <el-option v-for="item in tags" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="摘要">
            <el-input type="textarea" v-model="post.summary"></el-input>
          </el-form-item>

          <el-form-item label="缩略图">
            <img @click="handleOpen" :src="imgUrl" alt width="70%" />
          </el-form-item>
          <el-form-item>
            <el-button @click="remove">移除</el-button>
          </el-form-item>
          <br />
          <br />

          <div
            class="footer-toolbar"
            :style="{ width: isSideMenu() && isDesktop() ? '32%' : '100%'}"
          >
            <el-button type="primary" style="float:right" @click="createPost">发 布</el-button>
            <el-button @click="save" style="float:right;margin-right:10px">保存草稿</el-button>
          </div>
        </el-form>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { mixin, mixinDevice } from "@/utils/mixin.js";
import { categoryListTree, addCategory } from "@/api/category.js";
import { createPost, postById } from "@/api/post.js";
import { tagList, createTag } from "@/api/tag.js";
export default {
  mixins: [mixin, mixinDevice],
  name: "PostSettingDrawer",
  provide() {
    return {
      reload: this.reload
    };
  },
  data() {
    return {
      categoryList: [],
      defaultProps: {
        children: "children",
        label: "name"
      },
      editCategory: false,
      isRouterAlive: true,
      tags: [],
      createTag: {},
      props: {
        children: "children",
        label: "name",
        value: "id",
        emitPath: false,
        checkStrictly: true
      },
      category: {
        name: "",
        slugNames: "",
        parentId: "0"
      }
    };
  },
  props: {
    postSettingDrawer: {
      type: Boolean,
      default: false
    },
    imgUrl: {
      type: String,
      default: "http://img.redyu.run/placeholder.jpg"
    },
    post: {
      type: Object,
      default: {
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
      }
    },
    // innerDrawer:{
    //     type:Boolean,
    //     default:false
    // }
  },
  computed: {
    exampleUrl() {
      return process.env.VUE_APP_BASE_API + "/" + "archives/" + this.post.url;
    },
    tagNameMap() {
      const tagNameMap = {};
      this.tags.forEach(tag => {
        tagNameMap[tag.name] = tag;
      });
      return tagNameMap;
    }
  },
  methods: {
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(function() {
        this.isRouterAlive = true;
      });
    },
    handleOpen() {
        // this.innerDrawer=true;
      this.$emit("innerDrawer", true);
    },
    handleClose() {
      this.$emit("postDrawerClose", false);
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
    createPost() {
      if (!this.post.title) {
        this.$notify.error({
          title: "错误",
          message: "文章标题不能为空"
        });
        return;
      }
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
    remove() {
      this.post.thumbnail = ""; 
        this.$emit("imgUrlChange", "http://img.redyu.run/placeholder.jpg");
        this.$emit("thumbnailChange", "");
    },
    changTag(checkTagIds) {
      let checkNames = checkTagIds.filter(item => {
        return typeof item !== "number";
      });
      const tagNamesToCreate = checkNames.filter(
        tagName => !this.tagNameMap[tagName]
      );
      if (tagNamesToCreate.length > 0) {
        this.createTag.name = tagNamesToCreate[0];
        createTag(this.createTag).then(response => {
          if (response.status == 200) {
            this.$message.success("添加成功");
            this.post.tagIds.pop();
            console.info(this.post.tagIds);
            this.post.tagIds.push(response.data.id);
            console.info(this.post.tagIds);
            this.reload();
          }
          this.getAllTag();
        });
      }
    },
    addCategory() {
      addCategory(this.category).then(response => {
        if (response.status == 200) {
          this.$message.success("添加成功");
          this.getAllCategory();
          this.editCategory = false;
        }
      });
    },
    changeCategory() {
      if (this.$refs.category.getCheckedNodes()) {
        var ids = this.$refs.category.getCheckedNodes().map(item => {
          return item.id;
        });
        this.post.categoryIds = ids;
      }
    },

    getAllTag() {
      tagList().then(response => {
        this.tags = response.data;
      });
    },
    getAllCategory() {
      categoryListTree().then(response => {
        this.categoryList = response.data;
      });
    }
  },
  created() {
    var timestamp = new Date().getTime();
    this.post.url = timestamp;
    this.getAllCategory();
    this.getAllTag();
  }
};
</script>

<style>
</style>