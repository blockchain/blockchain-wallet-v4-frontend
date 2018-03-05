import React from 'react';
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json';

import TextInput from './TextInput';


describe('TextInput component', () => {
  it('default renders correctly', () => {
    const component = shallow(<TextInput borderColor='red'></TextInput>);
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });
});
