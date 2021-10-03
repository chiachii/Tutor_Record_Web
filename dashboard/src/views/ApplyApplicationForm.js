import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Form,
  FormInput,
  FormTextarea,
  Button
} from "shards-react";

import PageTitle from "../components/common/PageTitle";
import Editor from "../components/add-new-post/Editor";
import SidebarActions from "../components/add-new-post/SidebarActions";
import SidebarCategories from "../components/add-new-post/SidebarCategories";
import axios from "axios";

import Cookies from "js-cookie";
import LoginRedirector from "../auth";

import { Redirect } from "react-router";

const AddNewPost = (props) => {
  const [orderDetail, setOrderDetail] = useState({
    id: 0,
    expire: null,
    title: "載入中",
    description: "載入中",
    current_grading_level: 0
  });

  //console.log(props.match.params.order_id.id)
  const {
    match: {
      params: { order_id: id }
    }
  } = props;

  useEffect(() => {
    (async () => {
      const resp = await axios.get(
        `http://localhost:8080/api/order_detail?id=${id}`
      );
      const data = resp.data[0];
      setOrderDetail(data);
    })();
  }, []);

  const [config, setConfig] = useState({
    order_id: id,
    description: "",
    contact_method: ""
  });

  const [submitState = { notLoaded: true }, setSubmitState] = useState(null);

  const publish = async () => {
    try {
      const resp = await axios.post(
        "http://localhost:8080/api/request_application",
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

  if (!!submitState) {
    return <Redirect to={"/my-created-order"} />;
  }

  const onChange = (key) => (e) => {
    console.log(key, e);
    if (key === "description") {
      setConfig({
        ...config,
        description: e.target.value
      });
    }

    if (key === "contact_method") {
      setConfig({
        ...config,
        contact_method: e.target.value
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
            title="應徵家教"
            subtitle="Apply Application"
            className="text-sm-left"
          />
        </Row>
        <Row>
          <Col lg="9" md="12">
            <h3>家教主題: {orderDetail.title}</h3>
            <p>{orderDetail.description}</p>
          </Col>
        </Row>
        <Row>
          {/* Editor */}
          <Col lg="9" md="12">
            <h5>應徵個人介紹</h5>
            <Card small className="mb-3">
              <CardBody>
                <Form className="add-new-post">
                  <FormTextarea
                    size="lg"
                    className="mb-3"
                    placeholder="應徵個人介紹"
                    onChange={onChange("description")}
                  />
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <br />
        <br />
        <br />
        <Row>
          <Col lg="9" md="12">
            <h5>個人聯絡方式</h5>
            <Card small className="mb-3">
              <CardBody>
                <Form className="add-new-post">
                  <FormTextarea
                    size="lg"
                    className="mb-3"
                    placeholder="請輸入個人聯絡方式"
                    onChange={onChange("contact_method")}
                  />
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <br />
        <br />
        <Button theme="accent" onClick={publish}>
          <i className="material-icons">save</i> 送出家教應徵
        </Button>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <Button outline theme="accent">
          取消
        </Button>
      </Container>
    </LoginRedirector>
  );
};

export default AddNewPost;
