import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import WhatsNew from './index'
jest.mock('blockchain-info-components', () => ({ Text: 'text', TextGroup: 'text-group', Color: (val) => val, ModalHeader: 'modal-header', ModalBody: 'modal-body' }))

describe('Whats New', () => {
  it('renders correctly', () => {
    const component = shallow(<WhatsNew />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
})
