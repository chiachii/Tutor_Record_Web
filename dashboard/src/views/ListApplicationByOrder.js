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

const ListApplicationByOrder = (props) => {
  // react hook
  const [applicant, setApplicant] = useState([
    {
      id: 1,
      order_id: 1,
      teacher_user_id: 1,
      description: "fdsfsdfds",
      contact_method: "LINE: DSADA0SIDAIS0DI0"
    }
  ]);

  const {
    match: {
      params: { order_id: order_id }
    }
  } = props;

  const fetchOrderList = async () => {
    const resp = await fetch(
      `http://localhost:8080/api/list_application_by_order_id?order_id=${order_id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("Authorization")
        }
      }
    );

    const data = await resp.json();

    setApplicant(data);
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
                        Description
                      </th>
                      <th scope="col" className="border-0">
                        Contact Method
                      </th>
                      <th>是否接受應徵</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applicant.map((e) => (
                      <tr>
                        <td>{e.id}</td>
                        <td
                          dangerouslySetInnerHTML={{ __html: e.description }}
                        ></td>
                        <td>{e.contact_method}</td>
                        <td>
                          <button class="mb-2 mr-1 btn btn-primary btn-sm">
                            接受應徵者
                          </button>
                        </td>
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

export default ListApplicationByOrder;
