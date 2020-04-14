import { shallow } from 'enzyme'
import FormError from './index.js'
import React from 'react'
import toJson from 'enzyme-to-json'

jest.mock('blockchain-info-components', () => ({ Text: 'text' }))

describe('FormError', () => {
  it('renders correctly', () => {
    const tree = toJson(shallow(<FormError />))
    expect(tree).toMatchSnapshot()
  })
})
