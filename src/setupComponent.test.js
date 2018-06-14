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
      <ChildComponent data={this.props.data} />
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

describe('setupComponent', () => {
  describe('shallow', () => {
    let shallow;

    beforeEach(() => {
      const { shallow: testShallow } = setupComponent(TestComponent, [], {
        coolTitle: 'i am a default prop'
      });

      shallow = testShallow;
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
      const { mount: testMount } = setupComponent(ParentComponent, [], {
        title: 'default title',
        data: 'default data'
      });

      mount = testMount;
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
      const { shallow: testShallow } = setupComponent(MultiItems, [
        {
          name: 'coolClass',
          query: '.coolClass'
        }
      ]);

      shallow = testShallow;
    });

    it('returns the element', () => {
      expect(shallow().coolClass).toMatchSnapshot();
    });
  });
});