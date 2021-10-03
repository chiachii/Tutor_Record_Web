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
  Button
} from "shards-react";

import Cookies from "js-cookie";

const getQueryVariable = (variable) => {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (decodeURIComponent(pair[0]) == variable) {
      return decodeURIComponent(pair[1]);
    }
  }
  return null;
};

const LoginForm = () => {
  // React Hook
  const [loginInfo, setLoginInfo] = useState({
    username: "",
    password: ""
  });

  //loginInfo -> loginInfo.email, loginInfo.password
  // setLoginInfo({ email: "XX" })

  const onLineLogin = () => {
    //
    window.location.href = "http://localhost:8080/line/auth";
  };

  const onClickLogin = async () => {
    //alert(JSON.stringify(loginInfo));

    const resp = await fetch("http://localhost:8080/auth", {
      method: "POST", // POST
      headers: {
        "Content-Type": "application/json"
        // mime-type
        // media/mp4, media/mp3, plain/text, javascript/text
        // image/jpeg
      },

      // (username`, `password`)
      body: JSON.stringify({
        username: loginInfo.username,
        password: loginInfo.password
      })
    });

    // 判斷他有沒有正常的登入
    const { access_token, error } = await resp.json();

    // alert(isLogin ? "已登入" : "帳號密碼輸入錯誤");

    // 你沒有登入錯誤
    if (!error) {
      // alert(access_token);
      // Legacy Code
      /*Cookies.set("Authorization", `JWT ${access_token}`, {
        expires: 7
      });*/
      // document.cookie = `access_token=${access_token}`;

      // https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage

      // The newest way to set authorization in browser.
      localStorage.setItem("Authorization", `JWT ${access_token}`);

      // alert(localStorage.getItem("Authorization"));

      setTimeout(() => {
        // 注意資安問題
        const redirect = getQueryVariable("redirect");
        if (!!redirect) {
          window.location.href = redirect;
        } else {
          window.location.href = "/blog-overview";
        }
      }, 100);
      //alert(Cookies.get("authorization"));
      //alert(Cookies.get("authorization"));
    } else {
      alert("登入失敗，請檢查帳號密碼");
    }
  };

  return (
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
                  onChange={(e) =>
                    setLoginInfo({ ...loginInfo, username: e.target.value })
                  }
                />
              </FormGroup>
              {/*
                

                password: 自己寫的

                ...loginInfo:

                email
                password <- 複寫掉
                */}
              <FormGroup>
                <label htmlFor="fePassword">密碼</label>
                <FormInput
                  id="fePassword"
                  type="password"
                  placeholder="Password"
                  onChange={(e) =>
                    setLoginInfo({ ...loginInfo, password: e.target.value })
                  }
                />
              </FormGroup>
              <Button onClick={onClickLogin}>登入網站</Button>
              &nbsp;&nbsp;&nbsp;&nbsp;
              <Button onClick={onLineLogin}>使用 Line 登入</Button>
            </Form>
          </Col>
        </Row>
      </ListGroupItem>
    </ListGroup>
  );
};

export default LoginForm;
