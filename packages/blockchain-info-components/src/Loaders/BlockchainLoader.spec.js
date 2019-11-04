import { shallow } from 'enzyme'
import React from 'react'
import toJson from 'enzyme-to-json'

import BlockchainLoader from './BlockchainLoader'

describe('BlockchainLoader component', () => {
  it('default renders correctly', () => {
    const component = shallow(<BlockchainLoader height='10px' width='10px' />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
})
