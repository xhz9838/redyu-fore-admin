<template>
  <div class="app-container">
    <el-card class="postListCard">
      <el-form :inline="true" :model="commentQuery" class="demo-form-inline">
        <el-form-item label="关键词">
          <el-input v-model="commentQuery.keyword" placeholder="关键词"></el-input>
        </el-form-item>
        <el-form-item label="评论状态">
          <el-select v-model="commentQuery.status" placeholder="评论">
            <el-option label="待审核" value="2"></el-option>
            <el-option label="已发布" value="1"></el-option>

            <el-option label="回收站" value="0"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
          <el-button @click="reset">重置</el-button>
          <el-button @click="delManyComment">批量删除</el-button>
        </el-form-item>
      </el-form>

      <el-table
        @selection-change="handleSelectionChange"
        v-loading="loading"
        :data="commentPageInfo.list"
        style="width: 100%"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="author" label="昵称"></el-table-column>
        <el-table-column label="内容" width="350">
          <template slot-scope="scope">
            <div v-html="fomartContent(scope.row.content)"></div>
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.status=='1'">已发布</el-tag>
            <el-tag type="danger" v-if="scope.row.status=='0'">回收站</el-tag>
            <el-tag type="warning" v-if="scope.row.status=='2'">待审核</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="评论文章">
          <template slot-scope="scope">
            <el-link
              target="_blank"
              :href="deskUrl+'/archives/'+scope.row.post.url"
              type="primary"
            >{{scope.row.post.title}}</el-link>
          </template>
        </el-table-column>
        <el-table-column label="日期">
          <template slot-scope="scope">{{formatTime(scope.row.createTime)}}</template>
        </el-table-column>

        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button v-if="scope.row.status==1" type="text">回复</el-button>
            <el-button v-else-if="scope.row.status==2" type="text">通过</el-button>
            <el-popconfirm
              v-if="scope.row.status==0"
              @onConfirm="returnStatus(scope.row.id)"
              title="确定还原该评论吗？"
            >
              <el-button type="text" slot="reference">还原</el-button>
            </el-popconfirm>

            <el-popconfirm
              @onConfirm="deleteComment(scope.row.id)"
              v-if="scope.row.status==0"
              title="确定永久删除此评论吗？"
            >
              <el-button type="text" slot="reference">删除</el-button>
            </el-popconfirm>
            <el-popconfirm @onConfirm="toRecycle(scope.row.id)" v-else title="确定将此评论移到回收站吗？">
              <el-button type="text" slot="reference">回收站</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="postPagination"
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="commentPageInfo.pageNum"
        :page-sizes="[1, 2, 5, 10, 20, 50]"
        :page-size="commentPageInfo.pageSize"
        layout="total, sizes, prev, pager, next"
        :total="commentPageInfo.total"
        :pager-count="5"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
import { formatTime } from "@/utils/index";
import {
  commentForPage,
  updateStatusByCid,
  deleteComment,
  delManyComment
} from "@/api/comment";
export default {
  data() {
    return {
      loading: true,
      commentQuery: {
        pageNum: 1,
        pageSize: 10
      },
      commentPageInfo: {},
      delIds: []
    };
  },

  computed: {
    deskUrl() {
      return process.env.VUE_APP_DESK_URL;
    }
  },
  methods: {
    delManyComment() {
      this.$confirm("此操作将永久删除这些评论, 请谨慎操作?", "批量删除评论", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.loading = true;

          delManyComment(this.delIds).then(response => {
            if (response.status == 200) {
              this.$notify({
                title: "评论操作提示",
                message: "批量删除评论成功",
                type: "success"
              });
              this.commentForPage();
              this.loading = true;
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    handleSelectionChange(val) {
      let ids = val.map(item => {
        return item.id;
      });
      this.delIds = ids;
    },
    deleteComment(id) {
      this.loading = true;
      deleteComment(id).then(response => {
        if (response.status == 200) {
          this.$notify({
            title: "评论操作提示",
            message: "永久删除评论成功",
            type: "success"
          });
          this.commentForPage();
          this.loading = false;
        }
      });
    },
    fomartContent(content) {
      if (content.length > 80) {
        return content.substring(0, 80);
      }
      return content;
    },
    returnStatus(id) {
      this.loading = true;
      updateStatusByCid(id, 1).then(response => {
        this.$notify({
          title: "评论操作提示",
          message: "还原评论成功",
          type: "success"
        });
        this.commentForPage();
        this.loading = false;
      });
    },

    toRecycle(id) {
      this.loading = true;
      updateStatusByCid(id, 0).then(response => {
        this.$notify({
          title: "成功",
          message: "移动到回收站成功",
          type: "success"
        });
        this.commentForPage();
        this.loading = false;
      });
    },
    reset() {
      this.loading = true;
      this.commentQuery = {
        pageNum: 1,
        pageSize: 10
      };
      this.commentForPage();
      this.loading = false;
    },
    onSubmit() {
      this.loading = true;
      this.commentForPage();
      this.loading = false;
    },
    handleSizeChange(val) {
      this.loading = true;
      this.commentQuery.pageSize = val;
      this.commentForPage();
      this.loading = false;
    },
    handleCurrentChange(val) {
      this.loading = true;
      this.commentQuery.pageNum = val;
      this.commentForPage();
      this.loading = false;
    },
    formatTime(time) {
      return formatTime(new Date(time));
    },
    commentForPage() {
      this.loading = true;
      commentForPage(this.commentQuery).then(response => {
        this.commentPageInfo = response.data;
        if (response.status == 200) {
          this.loading = false;
        }
      });
    }
  },
  created() {
    this.commentForPage();
    this.loading = false;
  }
};
</script>

<style>
</style>