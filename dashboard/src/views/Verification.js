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
  
  const Verification = () => {
    const [值, 設定值函數] = useState(0); // hook, 狀態
    // 設定值函數( "你要的值" ) // 一呼叫完， 值中的 "初始值" 就會改成: "你要的值"
  
    const [selectedFile, setSelectedFile] = useState();
    const [loaded, setLoaded] = useState(0);
    const [uploadedFilenames, setUploadedFilenames] = useState([]);
  
    const onFileSelected = (event) => {
      setSelectedFile(event.target.files[0]);
      setLoaded(0);
    };
  
    const onUploadFile = () => {
      設定值函數(值 + 1);
  
      // how to upload multipart
      const data = new FormData();
      data.append("file", selectedFile);
  
      axios
        .post("http://localhost:8080/uploads", data, {
          headers: {
            Authorization: localStorage.getItem("Authorization")
          },
          onUploadProgress: (ProgressEvent) => {
            const progress = (ProgressEvent.loaded / ProgressEvent.total) * 100;
            setLoaded(progress);
          }
        })
        .then((res) => {
          console.log(res.data.filename);
          setUploadedFilenames([...uploadedFilenames, res.data.filename]);
        });
    };
  
    return (
      <LoginRedirector path="/verification">
        <Container fluid className="main-content-container px-4">
          <Row noGutters className="page-header py-4"></Row>
          <ListGroup flush>
            <ListGroupItem className="p-3">
              <Row>
                <Col>
                  <Form>
                    {值}
                    <br />
                    <br />
                    請上傳大學在學證明
                    <br />
                    <br />
                    <input type="file" name="file" onChange={onFileSelected} />
                    <br />
                    <br />
                    <Button theme="success" onClick={onUploadFile}>
                      上傳
                    </Button>
                    <br />
                    <br />
                    上傳進度 {loaded} %
                    <Progress
                      theme="success"
                      style={{ height: "5px" }}
                      className="mb-3"
                      value={loaded}
                    />
                    {!!uploadedFilenames &&
                      uploadedFilenames.map((filename, i) => (
                        <p>
                          已上傳第 {i} 個檔案 - {filename}
                        </p>
                      ))}
                  </Form>
                </Col>
              </Row>
            </ListGroupItem>
          </ListGroup>
        </Container>
      </LoginRedirector>
    );
  };
  export default Verification;
  