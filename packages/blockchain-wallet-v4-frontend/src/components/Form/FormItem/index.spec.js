import { shallow } from 'enzyme'
import FormItem from './index.js'
import React from 'react'
import toJson from 'enzyme-to-json'

jest.mock('blockchain-info-components', () => ({ Text: 'text' }))

describe('FormItem', () => {
  it('renders correctly', () => {
    const tree = toJson(shallow(<FormItem />))
    expect(tree).toMatchSnapshot()
  })
})
