import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'

import Link from './Link'

describe('Link component', () => {
  it('default renders correctly', () => {
    const component = shallow(
      <Link>
        <span>tab</span>
      </Link>
    )
    const tree = toJson(component)
    expect(tree).toMatchSnapshot()
  })
})
