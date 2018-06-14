import React from "react";
import { mount, shallow } from "enzyme";

// todo: extract into a simple npm package
const setupComponent = (Component, elementsToFind = [], defaultProps = {}) => {
  const assembleProps = props => ({...defaultProps, ...props});

  const constructComponent = (props, construct) => {

    const wrapper = construct(<Component {...assembleProps(props)}/>);

    const foundElements = {};

    elementsToFind.forEach(element => {
      foundElements[element.name] = wrapper.find(element.query)
    });

    return {
      wrapper,
      ...foundElements
    }
  };

  return {
    mount: (props = {}) => constructComponent(props, mount),
    shallow: (props = {}) => constructComponent(props, shallow)
  }
};

export default setupComponent;