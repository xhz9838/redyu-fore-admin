<template>
  <div class="login">
    <!--  卡片 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-link type="primary" icon="el-icon-s-home">登录</el-link>
      </div>
      <!-- 表单 -->
      <el-form :model="ruleForm" status-icon label-width="100px" class="demo-ruleForm">
        <el-form-item label="用户名" prop="pass">
          <el-input type="username" v-model="ruleForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="checkPass">
          <el-input type="password" v-model="ruleForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm()">登录</el-button>
        </el-form-item>
      </el-form>
      <!-- 表单 -->
    </el-card>
    <!--  卡片 -->
  </div>
</template>

<script>
import { UserLogin } from "../api";
export default {
  data() {
    return {
      ruleForm: {}
    };
  },
  // created() {},
  methods: {
    async submitForm() {
      let { data: user } = await UserLogin(this.ruleForm);

      if (user.message == "登录成功") {
        this.$message.success("登录成功");
      } else {
        this.message.error("用户名和密码错误");
      }
    }
  }
};
</script>

<style>
.text {
  font-size: 14px;
}

.item {
  padding: 18px 0;
}

.box-card {
  width: 480px;
}
.login {
  height: 100%;
  display: flex; /* css3 新取值，允许居中 */
  align-items: center; /* 上下居中*/
  justify-content: center; /* 左右居中 */
}
</style>