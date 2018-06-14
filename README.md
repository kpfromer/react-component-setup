# react-component-setup

[![Build Status](https://travis-ci.org/kpfromer/react-component-setup.svg?branch=master)](https://travis-ci.org/kpfromer/react-component-setup)
[![Coverage Status](https://coveralls.io/repos/github/kpfromer/react-component-setup/badge.svg?branch=master)](https://coveralls.io/github/kpfromer/react-component-setup?branch=master)

## Description

Helps setup components for use in testing via enzyme.

## Why?

I read an [article from Tomasz Bak](https://medium.com/selleo/testing-react-components-best-practices-2f77ac302d12)
describing some best react practices. One practice described that you should use a setup() instead
of a beforeEach (in jest) in order for your code to be more readable. I liked this practice and incorporated into one of my projects.
But immediatly, it became tedious to write a setup() for every component, thus I created `react-component-setup`.

## Usage

Import the package:

```javascript
import { SetupComponent } from 'react-component-setup';
```

Then run the `SetupComponent` intially in your Reactjs test file to generate
default properties and automatic element fetching.

`SetupComponent` will return an object with `mount` and `shallow` functions.
Each of which correspond with their respective enzyme call. Example return:

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

const { shallow: setup } = SetupComponent(CoolReactComponent); // Component to construct
// I could have used mount instead of shallow if needed
```

Note that the `{ shallow: setup } = ...` is just a [javascript object deconstructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment).

Then add a simple test using whatever testing framework you want, in this case I used jest.

```javascript
describe('CoolReactComponent', () => {
    it('should render a cool component', () => {
        const { wrapper } = setup();
        expect(wrapper.exists()).toBe(true);
    });
});
```

Both `mount` and `shallow` return an object of `wrapper` which is the enzyme shallow container of the constructed component.

#### Find an element automatically

If you want to find an element automatically (you test that element quite often)
you can add it to the `SetupComponent`'s elementsToFind list. Example:

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

const { shallow: setup } = SetupComponent(
    CoolReactComponent,
    [ // the elements that should be found automatically
        {
            name: 'coolParagraph',
            query: '.cool-paragraph'
        }
    ]
);

describe('CoolReactComponent', () => {
    it('should render a chill paragraph', () => {
        const { coolParagraph } = setup(); // coolParagraph is from the name in the list
        expect(wrapper.html()).toMatchSnapshot();
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
    DisplayName,
    [],
    { // the default props for the component
        name: 'Kyle'
    }
);

setup(); // returns element that is <h1>Hello, Kyle!</h1>
```

## License

  react-component-setup is [MIT licensed](LICENSE).