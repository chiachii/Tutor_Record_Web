import { Container, Row, Col } from "shards-react";

import LoginForm from "./../components/custom/Login";

const Login = () => (
  <Container fluid className="main-content-container px-4">
    <Row noGutters className="page-header py-4"></Row>
    <LoginForm />
  </Container>
);
export default Login;
