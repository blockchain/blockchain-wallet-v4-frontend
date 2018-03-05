import React from 'react';
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json';

import Tooltip from './Tooltip';

describe('Tooltip component', () => {
  it('renders correctly', () => {
    const component = shallow(<Tooltip><span>Default</span></Tooltip>);
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });

  it('default state is correct', () => {
    const component = shallow(<Tooltip />);
    expect(component.state().displayed).toBeFalsy();
  });

  it('click handler sets state properly', () => {
    const component = shallow(<Tooltip />);
    component.instance().handleClick();
    expect(component.state().displayed).toBeTruthy();
  });
});
