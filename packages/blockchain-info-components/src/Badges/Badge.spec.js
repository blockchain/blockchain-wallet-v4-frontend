import React from 'react'
import { render } from 'enzyme'
import toJson from 'enzyme-to-json'

import Badge from './Badge'

describe('Badge component', () => {
  it('applestore renders correctly', () => {
    const component = render(<Badge type='applestore' />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })

  it('googleplay renders correctly', () => {
    const component = render(<Badge type='googleplay' />)
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
})
