import React from 'react';
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json';

import FlatLoader from './FlatLoader';

describe('FlatLoader component', () => {
  it('default renders correctly', () => {
    const component = shallow(<FlatLoader height='10px' width='10px' color='grey-1'></FlatLoader>);
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });
});

