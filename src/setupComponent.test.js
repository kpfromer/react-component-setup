import React, { Component } from 'react';
import setupComponent from "./setupComponent";
import * as enzyme from 'enzyme';

jest.mock('enzyme', () => ( {
  shallow: jest.fn(),
  mount: jest.fn()
} ));

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
        <input value={this.state.val} onChange={this.changeVal}/>
      </div>
    );
  }
}

// TODO: dry
describe('setupComponent', () => {

  afterEach(() => {
    enzyme.mount.mockClear();
    enzyme.shallow.mockClear();
  });

  describe('shallow', () => {
    let shallow, mockWrapper;

    beforeEach(() => {
      ( { shallow } = setupComponent({
        component: TestComponent,
        defaultProps: {
          coolTitle: 'i am a default prop'
        },
        defaultEnzymeOptions: {
          context: {
            coolContextValue: '#themecolor'
          }
        }
      }) );

      mockWrapper = {
        enzymeStuff: 'cool enzyme stuff!'
      };

      enzyme.shallow.mockReturnValue(mockWrapper);
    });

    it('constructs a shallow component', () => {
      const { wrapper } = shallow();
      expect(wrapper).toBe(mockWrapper);
      expect(enzyme.shallow).toHaveBeenCalledWith(
        <TestComponent
          coolTitle="i am a default prop"
        />,
        {
          context: {
            coolContextValue: '#themecolor'
          }
        }
      );
    });
    // TODO: dry
    it('overrides default props with function props', () => {
      shallow({
        coolTitle: 'I am a cool overridden prop!!'
      });
      expect(enzyme.shallow.mock.calls[0][0]).toEqual(
        <TestComponent
          coolTitle="I am a cool overridden prop!!"
        />
      );
    });
    it('overrides default enzyme options with function options', () => {
      const newContext = {
        context: {
          coolContextValue: 'other value'
        }
      };
      shallow(
        {},
        newContext
      );

      expect(enzyme.shallow.mock.calls[0][1]).toEqual(newContext)
    });
  });

  describe('mount', () => {
    let mount, mockWrapper;

    beforeEach(() => {
      ( { mount } = setupComponent({
        component: ParentComponent,
        defaultProps: {
          title: 'default title',
          data: 'default data'
        },
        defaultEnzymeOptions: {
          context: {
            variable: 'old'
          }
        }
      }) );
      mockWrapper = {
        enzymeStuff: 'cool enzyme stuff!'
      };

      enzyme.mount.mockReturnValue(mockWrapper);
    });

    it('constructs a mount component', () => {
      const { wrapper } = mount();
      expect(wrapper).toBe(mockWrapper);
      expect(enzyme.mount).toHaveBeenCalledWith(
        <ParentComponent
          title="default title"
          data="default data"
        />,
        {
          context: {
            variable: 'old'
          }
        }
      );
    });
    it('overrides default props with function props', () => {
      mount({
        data: 'overridden data'
      });
      expect(enzyme.mount.mock.calls[0][0]).toEqual(
        <ParentComponent
          title="default title"
          data="overridden data"
        />
      );
    });
    it('overrides default enzyme options with function options', () => {
      const newContext = {
        context: {
          variable: 'new'
        }
      };
      mount(
        {},
        newContext
      );
      expect(enzyme.mount.mock.calls[0][1]).toEqual(newContext);
    });
  });

  describe('given `elementsToFind`', () => {
    let shallow, mockWrapper, mockFind;

    beforeEach(() => {
      ( { shallow } = setupComponent({
        component: MultiItems,
        elementsToFind: [
          {
            name: 'coolClass',
            query: '.coolClass'
          }
        ]
      }) );

      mockFind = jest.fn();
      mockWrapper = {
        enzymeStuff: 'cool things',
        find: mockFind
      };
      enzyme.shallow.mockReturnValue(mockWrapper);
    });

    it('returns the element', () => {
      const mockElement = jest.fn();
      mockFind.mockReturnValue(mockElement);
      expect(shallow().coolClass).toBe(mockElement);
      expect(mockFind).toHaveBeenCalledWith('.coolClass')
    });
  });

  describe('element refresh', () => {
    let shallow, mockWrapper, mockFind;

    beforeEach(() => {
      ( { shallow } = setupComponent({
        component: InputComponent,
        elementsToFind: [
          {
            name: 'input',
            query: 'input'
          }
        ]
      }) );

      mockFind = jest.fn();
      mockWrapper = {
        enzymeStuff: 'cool things',
        find: mockFind
      };
      enzyme.shallow.mockReturnValue(mockWrapper);
    });

    it('returns the "refound" element', () => {
      let countCall = 0;
      const firstFound = jest.fn();
      const secondFound = jest.fn();
      mockFind.mockImplementation(() => {
        countCall++;

        if (countCall === 1) {
          return firstFound;
        } else if (countCall === 2) {
          return secondFound;
        }
        throw new Error('More than one count');
      });

      const { input, refresh } = shallow();
      expect(refresh(input)).toBe(secondFound);
      expect(mockFind.mock.calls).toEqual([
        ['input'],
        ['input']
      ]);
    });
  });
});