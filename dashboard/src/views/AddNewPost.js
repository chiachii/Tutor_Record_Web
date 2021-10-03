import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "shards-react";

import PageTitle from "../components/common/PageTitle";
import Editor from "../components/add-new-post/Editor";
import SidebarActions from "../components/add-new-post/SidebarActions";
import SidebarCategories from "../components/add-new-post/SidebarCategories";
import axios from "axios";

import Cookies from "js-cookie";
import LoginRedirector from "../auth";

import { Redirect } from "react-router";

const AddNewPost = (props) => {
  const [config, setConfig] = useState({
    title: "",
    content: "",
    category: 0
  });

  const [submitState = { notLoaded: true }, setSubmitState] = useState(null);

  const publish = async (title, content) => {
    try {
      const resp = await axios.post(
        "http://localhost:8080/api/create_order",
        {
          ...config
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("Authorization")
          }
        }
      );

      setSubmitState(resp);
    } catch (e) {
      alert("API Invoke Error!");
    }
  };

  console.log(submitState);
  if (!!submitState) {
    return <Redirect to={"/my-created-order"} />;
  }

  const onFormChange = (key) => (e) => {
    console.log(key, e);
    if (key === "title") {
      setConfig({
        ...config,
        title: e.target.value
      });
    }

    if (key === "content") {
      setConfig({
        ...config,
        content: e
      });
    }
  };

  return (
    <LoginRedirector path="/add-new-post">
      <Container fluid className="main-content-container px-4 pb-4">
        {/* Page Header */}
        <Row noGutters className="page-header py-4">
          <PageTitle
            sm="4"
            title="張貼家教資訊"
            subtitle="Blog Posts"
            className="text-sm-left"
          />
        </Row>

        <Row>
          {/* Editor */}
          <Col lg="9" md="12">
            <Editor onChange={onFormChange} />
          </Col>

          {/* Sidebar Widgets */}
          <Col lg="3" md="12">
            <SidebarActions onPublish={publish} />
            <SidebarCategories title="徵求授課類別" />
          </Col>
        </Row>
      </Container>
    </LoginRedirector>
  );
};

export default AddNewPost;
