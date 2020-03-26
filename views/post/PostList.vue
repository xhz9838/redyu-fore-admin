<template>
  <div class="app-container">
    <el-card class="postListCard">
      <el-form :inline="true" :model="postQuery" class="demo-form-inline">
        <el-form-item label="关键词">
          <el-input v-model="postQuery.keyword" placeholder="关键词"></el-input>
        </el-form-item>
        <el-form-item label="文章状态">
          <el-select v-model="postQuery.status" placeholder="文章状态">
            <el-option label="已发布" value="PUBLISHED"></el-option>
            <el-option label="草稿" value="DRAFT"></el-option>
            <el-option label="回收站" value="RECYCLE"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分类目录">
          <el-select v-model="postQuery.categoryId" placeholder="分类目录">
            <el-option
              v-for="(category, index) in categoryList"
              :key="index"
              :label="category.name"
              :value="category.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
      <el-button type="primary" icon="el-icon-plus" @click="$router.push('/posts/write')">写文章</el-button>
      <el-table v-loading="loading" :data="postPageInfo.list" style="width: 100%">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="title" label="标题" width="180"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.status=='PUBLISHED'">已发布</el-tag>
            <el-tag type="warning" v-if="scope.row.status=='DRAFT'">草稿</el-tag>
            <el-tag type="danger" v-if="scope.row.status=='RECYCLE'">回收站</el-tag>
            <el-tag v-if="scope.row.status=='INTIMATE'">私密</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="分类">
          <template slot-scope="scope">
            <el-tag v-for="(category,index) in scope.row.categories" :key="index">{{category.name}} </el-tag> 
          </template>
        </el-table-column>
        <el-table-column label="标签">
          <template slot-scope="scope">
            <el-tag v-for="(tag,index) in scope.row.tags" :key="index">{{tag.name}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="commentCount" label="评论" width="100"></el-table-column>
        <el-table-column prop="visits" label="访问" width="100"></el-table-column>
        <el-table-column label="发布时间">
          <template slot-scope="scope">{{$moment(scope.row.createTime).format('YYYY-MM-DD HH:mm')}}</template>
        </el-table-column>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="editPost(scope.row.id)">编辑</el-button>
            <el-popconfirm @onConfirm="toRecycle(scope.row.id)" title="确定删除此文章吗？">
              <el-button type="text" slot="reference">回收站</el-button>
            </el-popconfirm>

            <el-button type="text">设置</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="postPagination"
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="postPageInfo.pageNum"
        :page-sizes="[1, 2, 5, 10, 20, 50]"
        :page-size="postPageInfo.pageSize"
        layout="total, sizes, prev, pager, next"
        :total="postPageInfo.total"
        :pager-count="5"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
import { categoryList } from "../../api/category.js";
import { postForPage, updateStatus } from "../../api/post.js";
export default {
  data() {
    return {
      loading: true,
      postQuery: {
        pageNum: 1,
        pageSize: 5
      },
      categoryList: [],
      postPageInfo: {}
    };
  },

  methods: {
    editPost(id) {
      this.$router.push({ name: "PostWrite", query: { postId: id } });
    },
    toRecycle(id) {
      updateStatus(id, "RECYCLE").then(response => {
        if (response.status == 200) {
          this.$notify({
            title: "成功",
            message: "移动回收站成功",
            type: "success"
          });
        }
        this.postForPage()
      });
    },
    reset() {
      this.postQuery = {
        pageNum: 1,
        pageSize: 5
      };
      this.postForPage();
    },
    handleSizeChange(val) {
      this.postQuery.pageSize = val;
      this.postForPage();
    },
    handleCurrentChange(val) {
      this.postQuery.pageNum = val;
      this.postForPage();
    },
    onSubmit() {
      this.postForPage();
    },
    findAllCategory() {
      categoryList().then(response => {
        this.categoryList = response.data;
      });
    },
    postForPage() {
      postForPage(this.postQuery).then(response => {
        this.postPageInfo = response.data;
        this.loading = false;
      });
    }
  },
  created() {
    this.findAllCategory();
    this.postForPage();
  }
};
</script>

<style>
</style>