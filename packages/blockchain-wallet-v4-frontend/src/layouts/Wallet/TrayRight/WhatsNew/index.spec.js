import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import WhatsNew from './index'
jest.mock('blockchain-info-components', () => ({ Text: 'text', TextGroup: 'text-group', Color: (val) => val, ModalHeader: 'modal-header', ModalBody: 'modal-body' }))

const mockTrayToggle = jest.fn()

describe('Whats New', () => {
  it('renders correctly', () => {
    const component = shallow(<WhatsNew handleTrayRightToggle={mockTrayToggle} />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
  it('handles Link clicks', () => {
    const component = shallow(<WhatsNew handleTrayRightToggle={mockTrayToggle} />)
    component.find('template__WhatsNewLink').first().simulate('click')
    expect(mockTrayToggle.mock.calls.length).toEqual(1)
  })
})
