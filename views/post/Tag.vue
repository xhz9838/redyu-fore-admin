<template>
  <div class="app-container">
    <el-row :gutter="10">
      <el-col :xs="24" :sm="24" :md="10" :lg="10" :xl="10" :style="{ 'padding-bottom': '12px' }">
        <el-card>
          <div slot="header" class="clearfix">
            <span>添加标签</span>
          </div>
          <el-form label-position="top" ref="form" :model="tag" label-width="80px">
            <el-form-item label="名称:">
              <el-input v-model="tag.name" placeholder="* 页面上所显示的名称" size="small"></el-input>
            </el-form-item>
            <el-form-item label="别名:">
              <el-input v-model="tag.slugName" placeholder="* 一般为单个标签页面的标识，最好为英文" size="small"></el-input>
            </el-form-item>

            <el-form-item>
              <el-button v-if="isAdd" type="primary" @click="createTag" size="medium">保存</el-button>
              <el-button v-if="!isAdd" type="primary" @click="updateTag" size="medium">更新</el-button>
              <el-button v-if="!isAdd" type="primary" @click="backAdd" size="medium">返回添加</el-button>
              <el-popconfirm @onConfirm="deleteTag" v-if="!isAdd" icon="el-icon-info" iconColor="red" title="确定删除吗？">
                <el-button slot="reference" size="medium">删除</el-button>
              </el-popconfirm>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="14" :lg="14" :xl="14">
        <el-card>
          <div slot="header" class="clearfix">
            <span>所有标签</span>
          </div>
          <el-tooltip
          style="cursor:pointer;"
            v-for="(tag, index) in tagList"
            :key="index"
            class="tagTooltip"
            effect="dark"
            :content="tag.postCount+'篇文章'"
            placement="top"
          >
            <el-tag size="medium" @click="editTag(tag)">{{tag.name}}</el-tag>
          </el-tooltip>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { tagListAndCount, updateTag, deleteTag ,createTag} from "../../api/tag.js";
export default {
  data() {
    return {
      isAdd: true,
      tag: {},
      tagList: []
    };
  },
  methods: {
    updateTag() {
      updateTag(this.tag).then(response => {
        if (response.status == 200) {
          this.$message.success("修改成功");
          this.getTagList();
        }
      });
    },
    editTag(tag) {
      this.isAdd = false;
      this.tag = tag;
    },
    getTagList() {
      tagListAndCount().then(response => {
        this.tagList = response.data;
      });
    },
    backAdd() {
      this.tag = {};
      this.isAdd = true;
    },
    createTag() {
      createTag(this.tag).then(response=>{
        if(response.status==200){
          this.$message.success("添加成功");
          this.tag={};
          this.getTagList()

        }
      })
    },
    deleteTag() {
      deleteTag(this.tag.id).then(response => {
        if (response.status == 200) {
          this.$message.success("删除成功");
          this.getTagList();
          this.tag={};
          this.isAdd=true;
        }
      });
    }
  },
  created() {
    this.getTagList();
  }
};
</script>

<style>
.tagTooltip {
  margin: 0px 8px 8px 0px;
}
</style>