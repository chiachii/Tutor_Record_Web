import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, CardHeader, CardBody } from "shards-react";

import PageTitle from "../components/common/PageTitle";

import Cookies from "js-cookie";
import LoginRedirector from "../auth";

/*
function (){}  <=> ()=>{}

function() { return (<p>2</p>) } <=> 
()=>{ return (<p>2</p>) }        <=> 
()=>(<p>2</p>)
*/

const Tables = () => {
  // react hook
  const [orders, setOrders] = useState([
    {
      id: 1,
      student_user_id: 2,
      teacher_user_id: null,
      expire: null,
      title: "goooood",
      description: "coooooool",
      user_id: null,
      current_grading_level: null,
      fullname: null,
      age: null,
      phone: null,
      email: null,
      username: null,
      password: null,
      gender: null
    },
    {
      id: 2,
      student_user_id: 2,
      teacher_user_id: null,
      expire: null,
      title: "",
      description: "",
      user_id: null,
      current_grading_level: null,
      fullname: null,
      age: null,
      phone: null,
      email: null,
      username: null,
      password: null,
      gender: null
    },
    {
      id: 3,
      student_user_id: 2,
      teacher_user_id: null,
      expire: null,
      title: "dsffdsfdsfds",
      description: "<p>fdsfdsfdsfdsdsf</p>",
      user_id: null,
      current_grading_level: null,
      fullname: null,
      age: null,
      phone: null,
      email: null,
      username: null,
      password: null,
      gender: null
    },
    {
      id: 4,
      student_user_id: 2,
      teacher_user_id: null,
      expire: null,
      title: "tets",
      description: "<p>test</p>",
      user_id: null,
      current_grading_level: null,
      fullname: null,
      age: null,
      phone: null,
      email: null,
      username: null,
      password: null,
      gender: null
    }
  ]);

  const fetchOrderList = async () => {
    const resp = await fetch(
      "http://localhost:8080/api/my_created_order_list",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("Authorization")
        }
      }
    );

    const orders = await resp.json();

    setOrders(orders);
  };

  // 偵測變動
  useEffect(() => {
    fetchOrderList();
  }, []);

  return (
    <LoginRedirector path="/my-created-order">
      <Container fluid className="main-content-container px-4">
        {/* Page Header */}
        <Row noGutters className="page-header py-4">
          <PageTitle
            sm="4"
            title="Add New Post"
            subtitle="Blog Posts"
            className="text-sm-left"
          />
        </Row>

        {/* Default Light Table */}
        <Row>
          <Col>
            <Card small className="mb-4">
              <CardHeader className="border-bottom">
                <h6 className="m-0">Active Users</h6>
              </CardHeader>
              <CardBody className="p-0 pb-3">
                <table className="table mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th scope="col" className="border-0">
                        #
                      </th>
                      <th scope="col" className="border-0">
                        Expire
                      </th>
                      <th scope="col" className="border-0">
                        Title
                      </th>
                      <th scope="col" className="border-0">
                        Description
                      </th>
                      <th scope="col" className="border-0">
                        Fullname
                      </th>
                      <th scope="col" className="border-0">
                        Gender
                      </th>
                      <th scope="col" className="border-0">
                        Age
                      </th>
                      <th scope="col" className="border-0">
                        Phone
                      </th>
                      <th scope="col" className="border-0">
                        Email
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((e) => (
                      <tr>
                        <td>{e.id}</td>
                        <td>{e.expire}</td>
                        <td>{e.title}</td>
                        <td
                          dangerouslySetInnerHTML={{ __html: e.description }}
                        ></td>
                        <td>{e.fullname}</td>
                        <td>{e.gender}</td>
                        <td>{e.age}</td>
                        <td>{e.phone}</td>
                        <td>{e.email}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </LoginRedirector>
  );
};

export default Tables;
