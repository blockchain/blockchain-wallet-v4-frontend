import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import { ExchangeByBlockchain } from './ExchangeByBlockchain'

jest.mock('blockchain-info-components', () => ({
  Button: 'button',
  Text: 'text'
}))
jest.mock('data', () => ({
  actions: {
    components: {
      identityVerification: {
        verifyIdentity: jest.fn()
      }
    }
  },
  selectors: {
    modules: {
      profiles: {
        getUserKYCState: jest.fn()
      }
    }
  },
  model: {
    profile: {
      KYC_STATES: {
        NONE: 'NONE'
      }
    }
  }
}))

describe('ExchangeByBlockchain', () => {
  it('renders correctly with button', () => {
    const component = shallow(<ExchangeByBlockchain kycNotFinished />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })

  it('renders correctly with exchange link', () => {
    const component = shallow(<ExchangeByBlockchain />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
})
