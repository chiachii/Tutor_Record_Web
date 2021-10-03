export default function () {
  return [
    {
      title: "首頁儀錶板",
      to: "/blog-overview",
      htmlBefore: '<i class="material-icons">edit</i>',
      htmlAfter: ""
    },
    {
      title: "家教列表",
      htmlBefore: '<i class="material-icons">vertical_split</i>',
      to: "/blog-posts"
    },
    {
      title: "張貼家教",
      htmlBefore: '<i class="material-icons">note_add</i>',
      to: "/add-new-post"
    },
    {
      title: "Forms & Components",
      htmlBefore: '<i class="material-icons">view_module</i>',
      to: "/components-overview"
    },
    {
      title: "我的家教清單",
      htmlBefore: '<i class="material-icons">table_chart</i>',
      to: "/my-created-order"
    },
    {
      title: "我的應徵",
      htmlBefore: '<i class="material-icons">table_chart</i>',
      to: "/myapplication"
    },
    {
      title: "我的課程紀錄",
      htmlBefore: '<i class="material-icons">table_chart</i>',
      to: "/myclass"
    },
    {
      title: "User Profile",
      htmlBefore: '<i class="material-icons">person</i>',
      to: "/user-profile-lite"
    },
    {
      title: "Errors",
      htmlBefore: '<i class="material-icons">error</i>',
      to: "/errors"
    }
  ];
}
