import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, CardHeader, CardBody } from "shards-react";

import PageTitle from "../components/common/PageTitle";
import LoginRedirector from "../auth";

const MyClass = () => {
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
    }
  ]);

  const fetchOrderList = async () => {
    const resp = await fetch("http://localhost:8080/api/my_class_record", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("Authorization")
      }
    });

    const orders = await resp.json();

    setOrders(orders);
  };

  // 偵測變動
  useEffect(() => {
    fetchOrderList();
  }, []);

  return (
    <LoginRedirector path="/myclass">
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
                <h6 className="m-0">近期上課紀錄</h6>
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

export default MyClass;
