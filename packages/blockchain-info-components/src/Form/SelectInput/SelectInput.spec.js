import React from 'react';
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json';

import SelectInput from './template';

describe('SelectInput component', () => {
  it('default renders correctly', () => {
    const items = [
      { text: 'test', value: 'value' }
    ];
    const component = shallow(<SelectInput items={items} display='inherit' />);
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });
});
