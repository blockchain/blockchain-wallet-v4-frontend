import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'

import ConfirmationGauge from './ConfirmationGauge'

describe('ConfirmationGauge component', () => {
  it('default renders correctly', () => {
    const component = shallow(<ConfirmationGauge nbConfirmations={1} />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
})
