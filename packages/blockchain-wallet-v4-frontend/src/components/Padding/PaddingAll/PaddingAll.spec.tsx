import React from 'react'
import { mount } from 'enzyme'

import { PaddingAll } from '.'
import 'jest-styled-components'

describe('PaddingAll', () => {
  it('Should add top, bottom, left, right styles', () => {
    const component = mount(<PaddingAll size={12} />)

    expect(component).toHaveStyleRule('padding-top', '12px')
    expect(component).toHaveStyleRule('padding-left', '12px')
    expect(component).toHaveStyleRule('padding-bottom', '12px')
    expect(component).toHaveStyleRule('padding-right', '12px')
  })
})
