import React from 'react';
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json';

import Toast from './Toast';

describe('Toast component', () => {
  const fakeOnClick = () => {};

  it('default renders correctly', () => {
    const component = shallow(<Toast onClose={fakeOnClick}><span>Default</span></Toast>);
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });

  it('error renders correctly', () => {
    const component = shallow(<Toast nature='error' onClose={fakeOnClick}><span>Default</span></Toast>);
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });

  it('success renders correctly', () => {
    const component = shallow(<Toast nature='success' onClose={fakeOnClick}><span>Default</span></Toast>);
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });
});
