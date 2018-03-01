import React from 'react';
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json';

import Banner from './Banner';

describe('Banner component', () => {
  it('renders correctly', () => {
    const component = shallow(<Banner />);
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  })
});
