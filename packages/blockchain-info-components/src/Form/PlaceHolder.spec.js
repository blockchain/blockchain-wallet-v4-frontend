import React from 'react';
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json';

import PlaceHolder from './PlaceHolder';

describe('PlaceHolder component', () => {
  it('default renders correctly', () => {
    const component = shallow(<PlaceHolder visible={true} handleClick={()=>{}}></PlaceHolder>);
    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });
});
