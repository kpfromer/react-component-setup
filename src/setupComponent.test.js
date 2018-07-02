import React, { Component } from 'react';
import setupComponent from "./setupComponent";

class TestComponent extends Component {
  render() {
    return <h1>{this.props.coolTitle}</h1>;
  }
}

class ChildComponent extends Component {
  render() {
    return <p>{this.props.data}</p>;
  }
}

class ParentComponent extends Component {
  render() {
    return <div>
      <h1>{this.props.title}</h1>
      <ChildComponent data={this.props.data}/>
    </div>
  }
}

class MultiItems extends Component {
  render() {
    return (
      <div>
        <h1>h1</h1>
        <h2>hello world</h2>
        <div className="coolClass">
          cool is what I am
        </div>
      </div>
    );
  }
}

class InputComponent extends Component {

  state = {
    val: 'unchanged'
  };

  changeVal = event => this.setState({ val: event.target.value });

  render() {
    return (
      <div>
        <h1>title</h1>
        <input value={this.state.val} onChange={this.changeVal} />
      </div>
    );
  }
}

describe('setupComponent', () => {
  describe('shallow', () => {
    let shallow;

    beforeEach(() => {
      ({ shallow } = setupComponent({
        component: TestComponent,
        defaultProps: {
          coolTitle: 'i am a default prop'
        }
      }));
    });

    it('constructs a shallow component', () => {
      const { wrapper } = shallow();
      expect(wrapper).toMatchSnapshot();
    });

    it('overrides default props with function props', () => {
      const { wrapper } = shallow({
        coolTitle: 'I am a cool overridden prop!!'
      });
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('mount', () => {
    let mount;

    beforeEach(() => {
      ({ mount } = setupComponent({
        component: ParentComponent,
        defaultProps: {
          title: 'default title',
          data: 'default data'
        }
      }));
    });

    it('constructs a mount component', () => {
      const { wrapper } = mount();
      expect(wrapper).toMatchSnapshot();
    });

    it('overrides default props with function props', () => {
      const { wrapper } = mount({
        data: 'overridden data'
      });
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('given `elementsToFind`', () => {
    let shallow;

    beforeEach(() => {
      ({ shallow } = setupComponent({
        component: MultiItems,
        elementsToFind: [
          {
            name: 'coolClass',
            query: '.coolClass'
          }
        ]
      }));
    });

    it('returns the element', () => {
      expect(shallow().coolClass).toMatchSnapshot();
    });
  });

  describe('element refresh', () => {
    let shallow;
    beforeEach(() => {
      ({ shallow } = setupComponent({
        component: InputComponent,
        elementsToFind: [
          {
            name: 'input',
            query: 'input'
          }
        ]
      }))
    });

    it('returns the "refound" element', () => {
      const { input, refresh } = shallow();
      input.simulate('change', { target: { value: 'changed input!' } });
      // Checks if input changes if it does that mean enzyme fixed this issue and refresh will be useless
      expect(input.props().value).toMatchSnapshot();
      expect(refresh(input).props().value).toMatchSnapshot();
    });
  });
});