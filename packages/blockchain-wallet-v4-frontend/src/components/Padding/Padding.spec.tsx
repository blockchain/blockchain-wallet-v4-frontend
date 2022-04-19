import React from 'react'
import { shallow } from 'enzyme'

import { Padding } from '.'

describe('Padding', () => {
  it('Should use 0 for all properties not defined', () => {
    const component = shallow(<Padding />)

    const style = component.prop('style')

    expect(style).toHaveProperty('paddingTop', 0)
    expect(style).toHaveProperty('paddingLeft', 0)
    expect(style).toHaveProperty('paddingBottom', 0)
    expect(style).toHaveProperty('paddingRight', 0)
  })

  it('Should use the all prop  to apply the same padding to all sides', () => {
    const component = shallow(<Padding all={10} />)

    const style = component.prop('style')

    expect(style).toHaveProperty('paddingTop', 10)
    expect(style).toHaveProperty('paddingLeft', 10)
    expect(style).toHaveProperty('paddingBottom', 10)
    expect(style).toHaveProperty('paddingRight', 10)
  })

  it('Should allow to apply padding only vertically', () => {
    const component = shallow(<Padding vertical={10} />)

    const style = component.prop('style')

    expect(style).toHaveProperty('paddingTop', 10)
    expect(style).toHaveProperty('paddingLeft', 0)
    expect(style).toHaveProperty('paddingBottom', 10)
    expect(style).toHaveProperty('paddingRight', 0)
  })

  it('Should allow to apply padding vertically and left', () => {
    const component = shallow(<Padding vertical={10} left={16} />)

    const style = component.prop('style')

    expect(style).toHaveProperty('paddingTop', 10)
    expect(style).toHaveProperty('paddingLeft', 16)
    expect(style).toHaveProperty('paddingBottom', 10)
    expect(style).toHaveProperty('paddingRight', 0)
  })

  it('Should allow to apply padding horizontal', () => {
    const component = shallow(<Padding horizontal={10} />)

    const style = component.prop('style')

    expect(style).toHaveProperty('paddingTop', 0)
    expect(style).toHaveProperty('paddingLeft', 10)
    expect(style).toHaveProperty('paddingBottom', 0)
    expect(style).toHaveProperty('paddingRight', 10)
  })

  it('Should allow to apply padding horizontal and top', () => {
    const component = shallow(<Padding horizontal={10} top={16} />)

    const style = component.prop('style')

    expect(style).toHaveProperty('paddingTop', 16)
    expect(style).toHaveProperty('paddingLeft', 10)
    expect(style).toHaveProperty('paddingBottom', 0)
    expect(style).toHaveProperty('paddingRight', 10)
  })

  it('Should allow to apply padding manually to all sides', () => {
    const component = shallow(<Padding top={16} bottom={10} left={5} right={2} />)

    const style = component.prop('style')

    expect(style).toHaveProperty('paddingTop', 16)
    expect(style).toHaveProperty('paddingLeft', 5)
    expect(style).toHaveProperty('paddingBottom', 10)
    expect(style).toHaveProperty('paddingRight', 2)
  })
})
