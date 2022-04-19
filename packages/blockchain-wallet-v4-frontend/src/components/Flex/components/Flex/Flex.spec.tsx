import React from 'react'
import { mount } from 'enzyme'

import { Flex } from '.'
import 'jest-styled-components'

describe('Flex', () => {
  it('Should create the flex element with the correct flex parameters', () => {
    const component = mount(
      <Flex gap={12} flexDirection='column' alignItems='center' justifyContent='space-between' />
    )

    expect(component).toHaveStyleRule('display', 'flex')
    expect(component).toHaveStyleRule('gap', '12px')
    expect(component).toHaveStyleRule('flex-direction', 'column')
    expect(component).toHaveStyleRule('align-items', 'center')
    expect(component).toHaveStyleRule('justify-content', 'space-between')
  })
})
