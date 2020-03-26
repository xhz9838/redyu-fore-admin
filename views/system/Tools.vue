<template>
  <div>
    <el-menu
      default-active="1"
      class="el-menu-demo"
      mode="horizontal"
      @open="handleClose"
      ref="menu"
    >
      <el-submenu
        :index="index+''"
        v-for="(c, index) in allCategory"
        :key="index"
        @click="demo1(c.id)"
      >
        <template slot="title"><div @click="demo1(c.id)">{{c.name}}</div></template>

        <div v-if="c.children==null">
          <el-menu-item
            v-for="(cc, index2) in c.children"
            :key="index2"
            :index="index+'-'+index2"
          >{{cc.name}}11</el-menu-item>
        </div>

        <div v-if="c.children!=null">
          <el-submenu :index="index+'-'+index2" v-for="(cc, index2) in c.children" :key="index2">
            <template slot="title">
              <div @click="demo1(cc.id)">{{cc.name}}</div>
            </template>
            <el-menu-item
              v-for="(ccc, index3) in cc.children"
              :key="index3"
              :index="index+'-'+index2+'-'+index3"
            >{{ccc.name}}</el-menu-item>
          </el-submenu>
        </div>
      </el-submenu>
    </el-menu>
    <div class="line"></div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      allCategory: [
        {
          id: 1,
          name: "java",
          is_parent: "1",
          children: [
            {
              id: 3,
              name: "spring",
              is_parent: "1",
              children: [
                { id: 3, name: "springmvc", is_parent: "0", children: null }
              ]
            }
          ]
        },
        {
          id: 2,
          name: "python",
          children: [{ id: 2, name: "爬虫", children: null }]
        },
        {
          id: 4,
          name: "前端",
          children: [
            {
              id: 5,
              name: "ce",
              children: [
                {
                  id: 3,
                  name: "spring",
                  is_parent: "0",
                  children: null
                }
              ]
            }
          ]
        }
      ]
    };
  },
  methods: {
    demo1(id) {
      console.info(id);
    },
    findAllParent() {},
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    }
  }
};
</script>

<style>
.el-menu--horizontal>.el-submenu .el-submenu__icon-arrow {
  display: none;
}
</style>