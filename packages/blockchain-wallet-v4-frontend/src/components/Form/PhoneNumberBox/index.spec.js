import { Remote } from 'blockchain-wallet-v4/src'
import { shallow } from 'enzyme'
import PhoneNumberBox from './index.js'
import React from 'react'
import toJson from 'enzyme-to-json'

jest.mock('react-intl-tel-input/dist/libphonenumber.js', () => jest.fn())
jest.mock('react-intl-tel-input', () => jest.fn())

describe('PhoneNumberBox', () => {
  it('renders correctly', () => {
    const component = shallow(
      <PhoneNumberBox
        countryCode={Remote.of('US')}
        input={{ value: '' }}
        meta={{}}
      />
    )
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
})
