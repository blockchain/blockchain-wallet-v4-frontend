import React from 'react';
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json';

import PlaceHolder from './PlaceHolder';

describe('PlaceHolder component', () => {
  it('default renders correctly', () => {
    const component = shallow(<PlaceHolder visible handleClick={() => {}} />);
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });
});
