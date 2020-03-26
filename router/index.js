import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

/* Layout */
import Layout from "@/layout";

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: "/login",
    component: () => import("@/views/login/index"),
    hidden: true
  },
  {
    path: "/404",
    component: () => import("@/views/404"),
    hidden: true
  },

  {
    path: "/",
    component: Layout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        component: () => import("@/views/dashboard/index"),
        meta: { title: "仪表盘", icon: "dashboard"}
      }
    ]
  },

  {
    path: "/posts",
    component: Layout,
    redirect: "/posts/list",
    name: "Posts",
    meta: { title: "文章", icon: "form" },
    children: [
      {
        path: "/posts/list",
        name: "PostList",
        component: () => import("@/views/post/PostList"),
        meta: { title: "所有文章", icon: "list" }
      },
      {
        path: "/posts/write",
        name: "PostWrite",
        component: () => import("@/views/post/PostWrite"),
        meta: { title: "写文章", icon: "edit" }
      },
      {
        path: "/posts/category",
        name: "Category",
        component: () => import("@/views/post/Category"),
        meta: { title: "分类目录", icon: "component" }
      },
      {
        path: "/posts/tag",
        name: "Tag",
        component: () => import("@/views/post/Tag"),
        meta: { title: "标签", icon: "clipboard" }
      }
    ]
  },

  {
    path: "/attachment",
    component: Layout,
    children: [
      {
        path: "index",
        name: "Attachments",
        component: () => import("@/views/attachment/index"),
        meta: { title: "附件", icon: "example" }
      }
    ]
  },
  {
    path: "/comment",
    component: Layout,
    children: [
      {
        path: "comment",
        name: "Comment",
        component: () => import("@/views/comment/index"),
        meta: { title: "评论", icon: "message" }
      }
    ]
  },
  {
    path: "/interface",
    component: Layout,
    redirect: "/interface/theme",
    name: "Interface",
    meta: { title: "外观", icon: "theme" },
    children: [
      {
        path: "/interface/theme",
        name: "Theme",
        component: () => import("@/views/interface/Theme"),
        meta: { title: "主题", icon: "theme" }
      },
      {
        path: "/interface/menu",
        name: "Menu",
        component: () => import("@/views/interface/Munu"),
        meta: { title: "菜单", icon: "nested" }
      }
    ]
  },
  {
    path: "/user",
    component: Layout,
    redirect: "/user/profile",
    name: "User",
    meta: { title: "用户", icon: "user" },
    alwaysShow: true,
    children: [
      {
        path: "/user/Profile",
        name: "Profile",
        component: () => import("@/views/user/Profile"),
        meta: { title: "个人资料", icon: "user" }
      }
    ]
  },
  {
    path: "/system",
    component: Layout,
    redirect: "/system/option",
    name: "System",
    meta: { title: "系统", icon: "setup" },
    children: [
      {
        path: "/system/option",
        name: "Option",
        component: () => import("@/views/system/Option"),
        meta: { title: "博客设置", icon: "tree" }
      },
      {
        path: "/system/tools",
        name: "Tools",
        component: () => import("@/views/system/Tools"),
        meta: { title: "小工具", icon: "drag" }
      },
      {
        path: "/system/about",
        name: "About",
        component: () => import("@/views/system/About"),
        meta: { title: "关于", icon: "eye-open" }
      }
    ]
  },
  // {
  //   path: '/nested',
  //   component: Layout,
  //   redirect: '/nested/menu1',
  //   name: 'Nested',
  //   meta: {
  //     title: 'Nested',
  //     icon: 'nested'
  //   },
  //   children: [
  //     {
  //       path: 'menu1',
  //       component: () => import('@/views/nested/menu1/index'), // Parent router-view
  //       name: 'Menu1',
  //       meta: { title: 'Menu1' },
  //       children: [
  //         {
  //           path: 'menu1-1',
  //           component: () => import('@/views/nested/menu1/menu1-1'),
  //           name: 'Menu1-1',
  //           meta: { title: 'Menu1-1' }
  //         },
  //         {
  //           path: 'menu1-2',
  //           component: () => import('@/views/nested/menu1/menu1-2'),
  //           name: 'Menu1-2',
  //           meta: { title: 'Menu1-2' },
  //           children: [
  //             {
  //               path: 'menu1-2-1',
  //               component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
  //               name: 'Menu1-2-1',
  //               meta: { title: 'Menu1-2-1' }
  //             },
  //             {
  //               path: 'menu1-2-2',
  //               component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
  //               name: 'Menu1-2-2',
  //               meta: { title: 'Menu1-2-2' }
  //             }
  //           ]
  //         },
  //         {
  //           path: 'menu1-3',
  //           component: () => import('@/views/nested/menu1/menu1-3'),
  //           name: 'Menu1-3',
  //           meta: { title: 'Menu1-3' }
  //         }
  //       ]
  //     },
  //     {
  //       path: 'menu2',
  //       component: () => import('@/views/nested/menu2/index'),
  //       meta: { title: 'menu2' }
  //     }
  //   ]
  // },

  // {
  //   path: 'external-link',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
  //       meta: { title: 'External Link', icon: 'link' }
  //     }
  //   ]
  // },

  // 404 page must be placed at the end !!!
  { path: "*", redirect: "/404", hidden: true }
];

const createRouter = () =>
  new Router({
    //mode: "history", // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  });

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
