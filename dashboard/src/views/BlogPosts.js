/* eslint jsx-a11y/anchor-is-valid: 0 */

import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardFooter,
  Button
} from "shards-react";

import PageTitle from "../components/common/PageTitle";
import LoginRedirector from "../auth";

// SQL: users table
/*
  PYTHON 會塞住 sql 連線
  ALTER TABLE users ADD COLUMN gender int(2) default 0;


  * LEFT JOIN: 合併兩張 EXCEL 表

  SELECT * FROM orders o
  LEFT JOIN student s ON o.student_user_id = s.id
  LEFT JOIN users u ON u.id = s.user_id;

  (o)
  student_id, teacher_id, expire, title, description
*/

const BlogPosts = () => {
  const [orderList, setOrderList] = useState({
    // Third list of posts.
    Orders: [
      {
        author: "彰化地方的媽媽 1",
        authorAvatar: require("../images/avatars/1.jpg"),
        title: "徵求家教 - 國中小屁孩",
        body:
          "In said to of poor full be post face snug. Introduced imprudence see say unpleasing devonshire acceptance son. Exeter longer wisdom work...",
        date: "29 February 2019"
      },
      {
        author: "彰化地方的媽媽 2",
        authorAvatar: require("../images/avatars/2.jpg"),
        title: "徵求家教 - 國中小屁孩",
        body:
          "It abode words began enjoy years no do no. Tried spoil as heart visit blush or. Boy possible blessing sensible set but margaret interest. Off tears...",
        date: "29 February 2019"
      },
      {
        author: "彰化地方的媽媽 3",
        authorAvatar: require("../images/avatars/3.jpg"),
        title: "徵求家教 - 國中小屁孩",
        body:
          "West room at sent if year. Numerous indulged distance old law you. Total state as merit court green decay he. Steepest merit checking railway...",
        date: "29 February 2019"
      }
    ]
  });

  const fetchOrderList = async () => {
    const resp = await fetch("http://localhost:8080/api/list_order", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });

    //alert(await resp.json());

    /*
    0 id
    1 student_user_id	
    2 teacher_user_id	
    3 expire
    4 title
    5 description
    6 id
    7 user_id
    8 current_grading_level
    9 id
    10 fullname
    11 age
    12 phone
    13 email
    14 username
    15 password
    16 gender

    */

    // 判斷他有沒有正常的登入
    const orders = await resp.json();

    // ({ user: "xx" })
    setOrderList({
      Orders: orders.map((info) => ({
        id: info.id,
        author: "家長",
        authorAvatar: require("../images/avatars/3.jpg"),
        title: info.title,
        body: info.description,
        date: "29 February 2019"
      }))
    });

    /*
      // id, student_user_id, teacher_user_id, expire, title, description
      [Array(6)]
      0: (6) [1, 1, 1, "2021-04-29T12:40:23", "徵求家教", "測試"]
      length: 1
      __proto__: Array(0)
    */
  };

  /*
  useEffect(() => {
    fetchOrderList();
  }, []);
  */

  // equvalent

  useEffect(function () {
    //
    fetchOrderList(); //A
    //fetchOrderList(); //B
    //fetchOrderList(); //C
    //fetchOrderList(); //D
  }, []);

  const { Orders } = orderList;

  const applyApplication = (post_id) => async(e) => {
    // redirect to target page
    window.location.href = `./apply-application-form/${post_id}`;
    

    /*const resp = await fetch("http://localhost:8080/api/request_application", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",

      }
    });*/
  }

  return (
    <LoginRedirector path="/blog-posts">
      <Container fluid className="main-content-container px-4">
        {/* Page Header */}
        <Row noGutters className="page-header py-4">
          <PageTitle
            sm="4"
            title="家教資訊看板"
            subtitle="NCUE Boards"
            className="text-sm-left"
          />
        </Row>

        {/* Third Row of Posts */}
        <Row>
          {Orders.map((post, idx) => (
            <Col lg="4" key={idx}>
              <Card small className="card-post mb-4">
                <CardBody>
                  <h5 className="card-title">{post.title}</h5>
                  <p className="card-text text-muted" dangerouslySetInnerHTML={{ __html: post.body }}></p>
                </CardBody>
                <CardFooter className="border-top d-flex">
                  <div className="card-post__author d-flex">
                    <a
                      href="#"
                      className="card-post__author-avatar card-post__author-avatar--small"
                      style={{ backgroundImage: `url('${post.authorAvatar}')` }}
                    >
                      Written by James Khan
                    </a>
                    <div className="d-flex flex-column justify-content-center ml-3">
                      <span className="card-post__author-name">
                        {post.author}
                      </span>
                      <small className="text-muted">張貼日期 {post.date}</small>
                    </div>
                  </div>
                  <div className="my-auto ml-auto">
                    <Button size="large" theme="primary" onClick={applyApplication(post.id)}>
                      {/* https://fontawesome.com/ */}
                      <i className="far fa-check-circle mr-1" /> 應徵
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </LoginRedirector>
  );
};

export default BlogPosts;
