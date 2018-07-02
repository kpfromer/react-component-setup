import React from "react";
import { mount, shallow } from "enzyme";
import { REFRESH_SYMBOL } from "./constants";

const setupComponent = ({
                          component: Component,
                          elementsToFind = [],
                          defaultProps = {}
                        }) => {
  const assembleProps = props => ( { ...defaultProps, ...props } );

  const constructComponent = (props, construct) => {

    const wrapper = construct(<Component {...assembleProps(props)}/>);

    const foundElements = {};

    elementsToFind.forEach(element => {

      const elementWithRefresh = wrapper.find(element.query);
      elementWithRefresh[REFRESH_SYMBOL] = element.name;

      foundElements[element.name] = elementWithRefresh;
    });



    const refresh = refreshElement =>
      wrapper.find(
        elementsToFind
          .find(element => element.name === refreshElement[REFRESH_SYMBOL])
          .query
      );

    return {
      wrapper,
      refresh,
      ...foundElements
    }
  };

  return {
    mount: (props = {}) => constructComponent(props, mount),
    shallow: (props = {}) => constructComponent(props, shallow)
  }
};

export default setupComponent;