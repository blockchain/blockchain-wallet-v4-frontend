import React from 'react'
import { mount } from 'enzyme'

import { PaddingSymetric } from '.'
import 'jest-styled-components'

describe('PaddingSymetric', () => {
  it('Should add top, bottom, left, right symetrically', () => {
    const component = mount(<PaddingSymetric horizontal={12} vertical={14} />)

    expect(component).toHaveStyleRule('padding-top', '14px')
    expect(component).toHaveStyleRule('padding-left', '12px')
    expect(component).toHaveStyleRule('padding-bottom', '14px')
    expect(component).toHaveStyleRule('padding-right', '12px')
  })
})
