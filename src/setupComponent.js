import React from "react";
import { mount, shallow } from "enzyme";
import { REFRESH_SYMBOL } from "./constants";

const setupComponent = ({
                          component: Component,
                          elementsToFind = [],
                          defaultProps = {},
                          defaultEnzymeOptions = {}
                        }) => {
  const assembleProps = props => ( { ...defaultProps, ...props } );
  const assemableEnzymeOptions = options => ({ ...defaultEnzymeOptions, ...options });

  const constructComponent = (props, enzymeOptions, construct) => {

    const wrapper = construct(
      <Component {...assembleProps(props)}/>,
      assemableEnzymeOptions(enzymeOptions)
    );

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
    mount: (props = {}, enzymeOptions = {}) => constructComponent(props, enzymeOptions, mount),
    shallow: (props = {}, enzymeOptions = {}) => constructComponent(props, enzymeOptions, shallow)
  }
};

export default setupComponent;