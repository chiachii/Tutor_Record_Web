import React from "react";
import PropTypes from "prop-types";
import {
  Card,
  CardHeader,
  CardBody,
  ListGroup,
  ListGroupItem,
  FormRadio
} from "shards-react";

const categories = [
  {
    id: 1,
    name: "國文"
  },
  {
    id: 2,
    name: "英文"
  },
  {
    id: 3,
    name: "數學"
  },
  {
    id: 4,
    name: "自然"
  },
  {
    id: 5,
    name: "社會"
  }
];

const SidebarCategories = ({ title }) => (
  <Card small className="mb-3">
    <CardHeader className="border-bottom">
      <h6 className="m-0">{title}</h6>
    </CardHeader>
    <CardBody className="p-0">
      <ListGroup flush>
        <ListGroupItem className="px-3 pb-2">
          {categories.map((cate) => (
            <FormRadio name="category" className="mb-1" value={cate.id}>
              {cate.name}
            </FormRadio>
          ))}
        </ListGroupItem>
      </ListGroup>
    </CardBody>
  </Card>
);

SidebarCategories.propTypes = {
  /**
   * The component's title.
   */
  title: PropTypes.string
};

SidebarCategories.defaultProps = {
  title: "徵求授課類別"
};

export default SidebarCategories;
