import React from 'react'
import { mount } from 'enzyme'

import { Padding } from '.'
import 'jest-styled-components'

describe('Padding', () => {
  it('Should use 0 for all properties not defined', () => {
    const component = mount(<Padding />)

    expect(component).toHaveStyleRule('padding-top', '0px')
    expect(component).toHaveStyleRule('padding-left', '0px')
    expect(component).toHaveStyleRule('padding-bottom', '0px')
    expect(component).toHaveStyleRule('padding-right', '0px')
  })

  it('Should add top, bottom, left, right styles', () => {
    const component = mount(<Padding top={12} bottom={14} right={16} left={18} />)

    expect(component).toHaveStyleRule('padding-top', '12px')
    expect(component).toHaveStyleRule('padding-left', '18px')
    expect(component).toHaveStyleRule('padding-bottom', '14px')
    expect(component).toHaveStyleRule('padding-right', '16px')
  })
})
