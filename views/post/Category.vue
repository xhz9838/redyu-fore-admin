<template>
  <div class="app-container">
    <el-row :gutter="10">
      <el-col :xs="24" :sm="24" :md="10" :lg="10" :xl="10" :style="{ 'padding-bottom': '12px' }">
        <el-card>
          <div slot="header" class="clearfix">
            <span>添加分类</span>
          </div>
          <el-form label-position="top" ref="form" :model="category" label-width="80px">
            <el-form-item label="名称:">
              <el-input v-model="category.name" size="small"></el-input>
            </el-form-item>
            <el-form-item label="别名:">
              <el-input v-model="category.slugName" size="small"></el-input>
            </el-form-item>
            <el-form-item label="上级目录:">
              <el-cascader
                v-model="catrgoryIdList"
                :props="props"
                size="small"
                style="width:100%"
                @change="handleChange"
                placeholder="0"
                :clearable="true"
                :options="categoryListTree"
                :show-all-levels="false"
              ></el-cascader>
            </el-form-item>
            <el-form-item label="描述:">
              <el-input type="textarea" v-model="category.description"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button v-if="isAdd" type="primary" @click="createCategory" size="medium">保存</el-button>
              <el-button v-if="!isAdd" type="primary" @click="updateCategory" size="medium">更新</el-button>
              <el-button v-if="!isAdd" type="primary" @click="backAdd" size="medium">返回添加</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="14" :lg="14" :xl="14">
        <el-card>
          <div slot="header" class="clearfix">
            <span>分类列表</span>
          </div>
          <el-table v-loading="loading" :data="categoryListPageInfo.list" style="width: 100%">
            <el-table-column prop="name" label="名称"></el-table-column>
            <el-table-column prop="slugName" label="别称"></el-table-column>
            <el-table-column prop="description" label="描述"></el-table-column>
            <el-table-column prop="postCount" label="文章数"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click="editCategory(scope.row)" size="small">编辑</el-button>

                <el-popover placement="top" width="160" :value="visible">
                  <div style="text-align: right; margin: 0">
                    <el-button size="mini" type="text" @click="visible = false">添加到菜单</el-button>
                    <el-button type="primary" size="mini" @click="deleteCategory(scope.row.id)">删除</el-button>
                  </div>
                  <el-button slot="reference" type="text" @click="moreAnd" size="small">更多</el-button>
                </el-popover>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="categoryPageParam.pageNum"
            :page-sizes="[5, 10, 15, 20]"
            :page-size="categoryPageParam.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="categoryListPageInfo.total"
          ></el-pagination>
        </el-card>
      </el-col>
    </el-row>
    {{category}}
    {{catrgoryIdList}}
  </div>
</template>

<script>
import {
  categoryListTree,
  categoryListForPage,
  addCategory,
  updateCategory,
  findParentId,
  deleteCategory
} from "@/api/category.js";

export default {
  data() {
    return {
  visible:false,
      props: {
        value: "id",
        label: "name",
        children: "children",
        checkStrictly: true
      },
      category: {
        parentId: "0"
      },
      categoryListTree: [],
      categoryListPageInfo: [],
      categoryPageParam: {
        pageNum: 1,
        pageSize: 10
      },
      loading: true,
      isAdd: true,
      catrgoryIdList: []
    };
  },

  methods: {
   moreAnd(){
     this.visible=true;
   },
    deleteCategory(id) {
      deleteCategory(id).then(response => {
        if (response.status == 200) {
          this.$message.success("删除成功");
        }
        this.getAllCategoryForPage();
      });
    },
    updateCategory() {
      updateCategory(this.category).then(response => {
        if (response.status == 200) {
          this.$message.success("更新成功");
        }
      });
    },
    backAdd() {
      this.category = { parentId: "0" };
      this.catrgoryIdList=[]
      this.getAllCategoryForPage();
      this.isAdd = true;
    },
    editCategory(category) {
      findParentId(category.parentId).then(response => {
        this.catrgoryIdList = response.data;
      });

      this.isAdd = false;
      this.category = category;
    },
    createCategory() {
      addCategory(this.category).then(response => {
        if (response.status == 200) {
          this.$message.success("保存成功");
          
          this.category = {
            parentId: "0"
          };
          this.catrgoryIdList=[]
        }
        this.getAllCategoryForPage();
      });
    },
    handleCurrentChange(val) {
      this.categoryPageParam.pageNum = val;
      this.getAllCategoryForPage();
    },
    handleSizeChange(val) {
      this.categoryPageParam.pageSize = val;
      this.getAllCategoryForPage();
    },
    handleChange(value) {
      this.category.parentId = value[value.length - 1];
    },
    getAllCategoryTree() {
      categoryListTree().then(response => {
        this.categoryListTree = response.data;
      });
    },
    getAllCategoryForPage() {
      categoryListForPage(this.categoryPageParam).then(response => {
        this.categoryListPageInfo = response.data;
        this.loading = false;
      });
    }
  },

  created() {
    this.getAllCategoryForPage();
    this.getAllCategoryTree();
  }
};
</script>

<style>
</style>