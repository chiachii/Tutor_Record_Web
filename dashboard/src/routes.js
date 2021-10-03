import React from "react";
import { Redirect } from "react-router-dom";

// Layout Types
import { DefaultLayout } from "./layouts";

// Route Views
import BlogOverview from "./views/BlogOverview";
import UserProfileLite from "./views/UserProfileLite";
import AddNewPost from "./views/AddNewPost";
import Errors from "./views/Errors";
import ComponentsOverview from "./views/ComponentsOverview";
import MyCreatedOrder from "./views/MyCreatedOrder";
import BlogPosts from "./views/BlogPosts";

import Login from "./views/Login";
import MyApplication from "./views/MyApplication";
import ApplyApplicationForm from "./views/ApplyApplicationForm";
import MyClass from "./views/MyClass";
import ListApplicationByOrder from "./views/ListApplicationByOrder";
import Verification from "./views/Verification";
import VerificationPhone from "./views/VerificationPhone";
import Register from "./views/Register";

export default [
  {
    path: "/",
    exact: true,
    layout: DefaultLayout,
    component: () => <Redirect to="/blog-overview" />
  },
  {
    path: "/login",
    layout: Login,
    component: Login
  },
  {
    path: "/register",
    layout: Register,
    component: Login
  },
  {
    path: "/blog-overview",
    layout: DefaultLayout,
    component: BlogOverview
  },
  {
    path: "/user-profile-lite",
    layout: DefaultLayout,
    component: UserProfileLite
  },
  {
    path: "/add-new-post",
    layout: DefaultLayout,
    component: AddNewPost
  },
  {
    path: "/apply-application-form/:order_id",
    layout: DefaultLayout,
    component: ApplyApplicationForm
  },
  {
    path: "/errors",
    layout: DefaultLayout,
    component: Errors
  },
  {
    path: "/components-overview",
    layout: DefaultLayout,
    component: ComponentsOverview
  },
  {
    path: "/my-created-order",
    layout: DefaultLayout,
    component: MyCreatedOrder
  },
  {
    path: "/myclass",
    layout: DefaultLayout,
    component: MyClass
  },

  {
    path: "/myapplication",
    layout: DefaultLayout,
    component: MyApplication
  },
  {
    path: "/blog-posts",
    layout: DefaultLayout,
    component: BlogPosts
  },
  {
    path: "/list-application-by-order/:order_id",
    layout: DefaultLayout,
    component: ListApplicationByOrder
  },
  {
    path: "/verification",
    layout: Verification,
    component: Login
  },
  {
    path: "/verification-phone",
    layout: VerificationPhone,
    component: Login
  }
];
