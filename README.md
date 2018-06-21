# react-component-setup

[![Build Status](https://travis-ci.org/kpfromer/react-component-setup.svg?branch=master)](https://travis-ci.org/kpfromer/react-component-setup)
[![Coveralls github](https://coveralls.io/repos/github/kpfromer/react-component-setup/badge.svg?branch=master)](https://coveralls.io/github/kpfromer/react-component-setup?branch=master)

## Description

This package reduces component testing boilerplate code by providing a handy `mount` and `shallow` functions using enzyme.

## Installation

Run the following command:

`npm install --save-dev react-component-setup`

## Why?

I read an [article by Tomasz Bak](https://medium.com/selleo/testing-react-components-best-practices-2f77ac302d12)
describing some best react practices. One practice described that you should use a setup() instead
of a beforeEach (in jest) for your code to be more readable. I liked this practice and incorporated into one of my projects.
However, immediately, it became tedious to write a setup() for every component; thus I created `react-component-setup`.

## Usage

First, install the [required packages](#requirements)!

Import the package:

```javascript
import { SetupComponent } from 'react-component-setup';
```

Then run the `SetupComponent` initially in your Reactjs test file to generate
default properties and automatic element fetching.

`SetupComponent` will return an object with `mount` and `shallow` functions.
Each of which corresponds with their respective enzyme call. Example return:

```javascript
{
    mount: [mount Function],
    shalllow: [shallow Function]
}
```

```javascript
import React, { Component } from 'react';
import { SetupComponent } from 'react-component-setup';

class CoolReactComponent extends Component {
    render() {
        return (
            <div>
                <h1>Hello, world!</h1>
                <p>I am a cool react component</p>
            </div>
        );
    }
}

const { shallow: setup } = SetupComponent({ Component: CoolReactComponent }); // Component to construct
// I could have used mount instead of shallow if needed
```

Note that the `{ shallow: setup } = ...` is just a [javascript object deconstructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment).

Then add a simple test using whatever testing framework you want, in this case, I used jest.

```javascript
describe('CoolReactComponent', () => {
    it('should render a cool component', () => {
        const { wrapper } = setup();
        expect(wrapper.exists()).toBe(true);
    });
});
```

Both `mount` and `shallow` return an object of `wrapper` which is the enzyme shallow container of the constructed component.

#### Defining properties for the component

Most components have properties. In order to supply your properties to the component provide an object with
the properties value. Example:

```javascript
import React, { Component } from 'react';
import { SetupComponent } from 'react-component-setup';

class NameDisplayer extends Component {
    render() {
        return (
            <h1>First name: {this.props.firstName}. Last name: {this.props.lastName}.</h1>
        );
    }
}

const { shallow: setup } = SetupComponent({ Component: NameDisplayer });

setup({
    firstName: 'Mark'
    lastName: 'Johnson'
}); // returns component like <h1>First name: Mark. Last name: Johnson.</h1>
```

#### Find an element automatically

If you want to find an element automatically (you test that element quite often)
You can add it to the `SetupComponent`'s elementsToFind list.
All elementsToFind does is it returns the `wrapper.find()` of the `query` using the `name`.
Example:

```javascript
import React, { Component } from 'react';
import { SetupComponent } from 'react-component-setup';

class CoolReactComponent extends Component {
    render() {
        return (
            <div>
                <h1>Hello, world!</h1>
                <p className="cool-paragraph">I am a cool react component</p>
            </div>
        );
    }
}

const { shallow: setup } = SetupComponent({
    Component: CoolReactComponent,
    elementsToFind: [ // the elements that should be found automatically
        {
            name: 'coolParagraph',
            query: '.cool-paragraph'
        }
    ]
});

describe('CoolReactComponent', () => {
    it('should render a chill paragraph', () => {
        const { coolParagraph } = setup(); // coolParagraph is from the name in the list
        expect(coolParagraph.html()).toMatchSnapshot();
    });
});
```

#### Refreshing elements in `elementsToFind`

I have had trouble using elementsToFind with inputs when simulating a change.
Simulating a change on input causes any variable reference to the element to become stale, thus the variable is useless since you will need to reuse the `wrapper.find` method.
See more [here](https://github.com/airbnb/enzyme/issues/76#issuecomment-388112899).
To fix this issue a newly created `refresh` method has been added to automatically refind the element for you.

Basic Example:

```javascript
const { wrapper, coolCustomElementToFind, refresh } = setup(); // setup is the the shallow or mount function created from SetupComponent

const refreshedCustomElement = refresh(coolCustomElementToFind); // refresh does not change coolCustomElementToFind

```

Full Example:

```javascript
import React, { Component } from 'react';
import { SetupComponent } from 'react-component-setup';

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

const { shallow: setup } = setupComponent({
    Component: InputComponent,
    elementsToFind: [
      {
        name: 'input',
        query: 'input'
      }
    ]
})

describe('Component', () => {
    it('updates values', () => {
        const { input, refresh } = setup();

        input.simulate('change', { target: { value: 'A new input value!' } });
        // By now the input variable is outdated and it's `props('value')` don't actual match the new value
        // It needs to be refreshed

        expect(refresh(input).props().value).toBe('A new input value!');
    });
});
```

#### Default Properties

If you want to add default properties to your component add an object to the `SetupComponent` function. Example:

```javascript
import React, { Component } from 'react';
import { SetupComponent } from 'react-component-setup';

class DisplayName extends Component {
    render() {
        return (
            <h1>Hello {this.props.name}!</h1>
        );
    }
}

const { shallow: setup } = SetupComponent(
    Component: DisplayName,
    defaultProps: { // the default props for the component
        name: 'Kyle'
    }
);

setup(); // returns element that is <h1>Hello, Kyle!</h1>
```

Note: default props will be overridden by props provided in the setup function call.

## Requirements:

1. `react` version ^0.14.9 || ^15.0.0 || ^16.0.0
2. `react-dom` version ^0.14.9 || ^15.0.0 || ^16.0.0
3. `enzyme` version ~3.3.0

## License

  react-component-setup is [MIT licensed](LICENSE).