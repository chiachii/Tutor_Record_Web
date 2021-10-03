import {
  Container,
  Row,
  Col,
  ListGroup,
  ListGroupItem,
  Form,
  FormRadio,
  FormGroup,
  FormInput,
  Progress,
  Button
} from "shards-react";

import { useState } from "react";
import axios from "axios";

import LoginRedirector from "../auth";

const VerificationPhone = () => {
  const [form, setForm] = useState({
    a: "",
    phone_number: ""
  });
  const setFormData = (key) => (e) => {
    const newForm = { ...form, [key]: e.target.value }; // let a = {}; a[key] = e.target.value;
    setForm(newForm);
  };

  const sendVerifyRequest = async () => {
    const data = { phone_number: form.phone_number };

    const result = await axios.post(
      "http://localhost:8080/request_phone_numer_verification",
      {
        ...data
      },
      {
        headers: {
          Authorization: localStorage.getItem("Authorization")
        }
      }
    );

    console.log(result);

    if (result.data.success) {
      setFormData("request_id")({ target: { value: result.data.request_id } });
    } else {
      alert("驗證手機失敗:", result.data.reason);
    }
  };

  const sendVerifyCodeRequest = async () => {
    console.log(form);
    const data = {
      request_id: form.request_id,
      code: form.code
    };

    const result = await axios.post(
      "http://localhost:8080/verify_phone_number",
      {
        ...data
      },
      {
        headers: {
          Authorization: localStorage.getItem("Authorization")
        }
      }
    );

    if (result.data.success) {
      alert("驗證成功!");
      // redirect
    } else {
      alert("驗證手機失敗:", result.data.reason);
      setRequestVerify(false);
    }
  };

  // python -m pip install vonage
  // pip install flask_jwt
  /**

    python:

    import vonage
    client = vonage.Client(key="26772eda", secret="mkPxXOtAVjCkY552")
    verify = vonage.Verify(client)
    verify.cancel(輸入你的 ID)
  */

  return (
    <LoginRedirector path="/verification-phone">
      <Container fluid className="main-content-container px-4">
        <Row noGutters className="page-header py-4"></Row>
        <ListGroup flush>
          <ListGroupItem className="p-3">
            <Row>
              <Col>
                <Form>
                  <br />
                  <br />
                  請輸入需要驗證的手機:
                  <br />
                  <input
                    type="text"
                    name="phone_number"
                    onChange={setFormData("phone_number")}
                  />
                  <br />
                  <br />
                  <Button onClick={sendVerifyRequest}>開始進行驗證</Button>
                </Form>

                <hr />
                <Form>
                  <br />
                  <br />
                  驗證碼:
                  <br />
                  <input
                    type="text"
                    name="code"
                    onChange={setFormData("code")}
                  />
                  <br />
                  <br />
                  <Button onClick={sendVerifyCodeRequest}>驗證</Button>
                </Form>
              </Col>
            </Row>
          </ListGroupItem>
        </ListGroup>
      </Container>
    </LoginRedirector>
  );
};
export default VerificationPhone;
