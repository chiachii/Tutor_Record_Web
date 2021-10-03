import React, { useEffect, useState } from "react";
import {
  ListGroup,
  ListGroupItem,
  Row,
  Col,
  Form,
  FormInput,
  FormGroup,
  FormCheckbox,
  FormSelect,
  Button,
  Container,
  FormRadio
} from "shards-react";

import Cookies from "js-cookie";

import LoginForm from "./../components/custom/Login";

const Login = () => {
  const [registerInfo, setRegisterInfo] = useState({
    fullname: "",
    username: "",
    password: "",
    repassword: null,
    age: "",
    phone: "",
    email: "",
    account_type: "",
    current_grading_level: "",
    professional: ""
  });

  const setFormData = (keyname) => (e) => {
    setRegisterInfo({ ...registerInfo, [keyname]: e.target.value });
  };

  const validation = (vals) => {
    // is password and repassword match
    if (vals.password !== vals.repassword) {
      alert("密碼不一致");
      return false;
    }

    if (vals.username === "") {
      alert("請填入您的使用者名稱");
      return false;
    }

    if (vals.fullname === "") {
      alert("請輸入您的姓名");
      return false;
    }

    if (vals.age === "") {
      alert("請輸入您的年齡");
      return false;
    }

    if (vals.phone === "") {
      alert("請輸入正確的手機號碼");
      return false;
    }

    if (vals.email === "") {
      alert("請確實填寫 Email");
      return false;
    }

    if (vals.account_type === "") {
      alert("請至少選擇一種身分");
      return false;
    }

    if (vals.account_type === "student" && vals.current_grading_level === "") {
      alert("請填寫您目前幾年級");
      return false;
    }

    if (vals.account_type === "teacher" && vals.professional === "") {
      alert("請填寫您的專業科目");
      return false;
    }

    return true;
  };

  const goRegister = async (e) => {
    e.preventDefault();
    if (validation(registerInfo)) {
      /*
      
        "fullname"
        "age"
        "phone"
        "email"
        "username"
        "password"

      */
      const resp = await fetch("http://localhost:8080/register", {
        method: "POST", // POST
        headers: {
          "Content-Type": "application/json"
        },

        // (username`, `password`)
        body: JSON.stringify({
          fullname: registerInfo.fullname,
          age: registerInfo.age,
          phone: registerInfo.phone,
          email: registerInfo.email,
          username: registerInfo.username,
          password: registerInfo.password,
          account_type: registerInfo.account_type,
          professional: registerInfo.professional,
          current_grading_level: registerInfo.current_grading_level
        })
      });

      // 判斷他有沒有正常的登入
      const { success } = await resp.json();
      if (success) {
        // register role
        alert("註冊成功");

        window.location.href = "/login";
      } else {
        alert("註冊失敗");
      }
    } else {
      //...
      alert("註冊失敗 2");
    }
  };

  return (
    <Container fluid className="main-content-container px-4">
      <Row noGutters className="page-header py-4"></Row>
      <ListGroup flush>
        <ListGroupItem className="p-3">
          <Row>
            <Col>
              <Form>
                <FormGroup>
                  <label htmlFor="feUsername">使用者帳號</label>
                  <FormInput
                    id="feUsername"
                    type="text"
                    placeholder="Username"
                    onChange={setFormData("username")}
                  />
                </FormGroup>
                <FormGroup>
                  <label htmlFor="password">密碼</label>
                  <FormInput
                    id="password"
                    type="password"
                    placeholder="Password"
                    onChange={setFormData("password")}
                  />
                </FormGroup>
                <FormGroup>
                  <label htmlFor="rePassword">再次輸入密碼</label>
                  <FormInput
                    id="rePassword"
                    type="password"
                    placeholder="Password Repeat"
                    onChange={setFormData("repassword")}
                  />
                </FormGroup>
                <FormGroup>
                  <label htmlFor="fullname">姓名</label>
                  <FormInput
                    id="fullname"
                    type="text"
                    placeholder="Fullname"
                    onChange={setFormData("fullname")}
                  />
                </FormGroup>
                <FormGroup>
                  <label htmlFor="age">年齡</label>
                  <FormInput
                    id="age"
                    type="number"
                    placeholder="Age Number"
                    onChange={setFormData("age")}
                  />
                </FormGroup>

                <FormGroup>
                  <label htmlFor="phone">行動電話</label>
                  <FormInput
                    id="phone"
                    type="text"
                    placeholder="Phone Number"
                    onChange={setFormData("phone")}
                  />
                </FormGroup>

                <FormGroup>
                  <label htmlFor="email">Email</label>
                  <FormInput
                    id="email"
                    type="text"
                    placeholder="Email Address"
                    onChange={setFormData("email")}
                  />
                </FormGroup>

                <hr />
                <FormGroup>
                  <label htmlFor="account_type">身分別</label>
                  <FormRadio
                    name="account_type"
                    className="mb-1"
                    value="teacher"
                    onChange={setFormData("account_type")}
                  >
                    教師
                  </FormRadio>
                  <FormRadio
                    name="account_type"
                    className="mb-1"
                    value="student"
                    onChange={setFormData("account_type")}
                  >
                    學生
                  </FormRadio>
                </FormGroup>
                {registerInfo.account_type === "teacher" ? (
                  <FormGroup>
                    <label htmlFor="professional">請輸入專業科目</label>
                    <FormInput
                      id="professional"
                      type="text"
                      placeholder="數學科、國文科、英文科"
                      onChange={setFormData("professional")}
                    />
                  </FormGroup>
                ) : (
                  <FormGroup>
                    <label htmlFor="current_grading_level">目前幾年級</label>
                    <FormInput
                      id="current_grading_level"
                      type="text"
                      placeholder="國中二年級"
                      onChange={setFormData("current_grading_level")}
                    />
                  </FormGroup>
                )}
                <Button onClick={goRegister}>註冊</Button>
              </Form>
            </Col>
          </Row>
        </ListGroupItem>
      </ListGroup>
    </Container>
  );
};
export default Login;
