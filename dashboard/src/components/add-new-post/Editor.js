import React from "react";
import ReactQuill from "react-quill";
import { Card, CardBody, Form, FormInput } from "shards-react";

import "react-quill/dist/quill.snow.css";
import "../../assets/quill.css";

const Editor = ({ onChange }) => {
  //......
  //onChange(   key   )("標題", "內容");

  return (
    <Card small className="mb-3">
      <CardBody>
        <Form className="add-new-post">
          <FormInput size="lg" className="mb-3" placeholder="Your Post Title" onChange={onChange('title')} />
          <ReactQuill className="add-new-post__editor mb-1" onChange={onChange('content')} />
        </Form>
      </CardBody>
    </Card>
  );
};

export default Editor;
