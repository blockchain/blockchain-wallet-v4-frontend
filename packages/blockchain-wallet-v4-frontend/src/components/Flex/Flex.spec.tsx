import React from 'react'
import { shallow } from 'enzyme'

import { Flex } from '.'

describe('Flex', () => {
  it('Should create the flex element with the correct flex parameters', () => {
    const component = shallow(
      <Flex gap={12} flexDirection='column' alignItems='center' justifyContent='space-between' />
    )

    const flexElementStyle = component.get(0).props.style

    expect(flexElementStyle.display).toEqual('flex')
    expect(flexElementStyle.gap).toEqual('12px')
    expect(flexElementStyle.flexDirection).toEqual('column')
    expect(flexElementStyle.alignItems).toEqual('center')
    expect(flexElementStyle.justifyContent).toEqual('space-between')
  })
})
