import React from 'react'
import { shallow } from 'enzyme'

import { ExternalSVG } from '.'

describe('ExternalSVG', () => {
  it('Should display the svg image from relative path', () => {
    const wrapper = shallow(<ExternalSVG href='/assets/icon.svg' width={3} height={2} />)

    expect(wrapper.type()).toEqual('svg')
    expect(wrapper.getElement().props.width).toEqual('3rem')
    expect(wrapper.getElement().props.height).toEqual('2rem')

    const image = wrapper.find('image')

    const imageProps = image.getElement().props

    expect(imageProps.href).toEqual('/assets/icon.svg')
    expect(imageProps.width).toEqual('3rem')
    expect(imageProps.height).toEqual('2rem')
  })

  it('Should display the svg image from blockchain domain', () => {
    const wrapper = shallow(
      <ExternalSVG href='https://blockchain.com/assets/icon.svg' width={3} height={2} />
    )

    const image = wrapper.find('image')

    const imageProps = image.getElement().props

    expect(imageProps.href).toEqual('https://blockchain.com/assets/icon.svg')
  })

  it('Should throw error when the assets is not hosted by blockchain', () => {
    expect(() =>
      shallow(<ExternalSVG href='https://dev.w3.org/assets/icon.svg' width={3} height={2} />)
    ).toThrow()
  })

  it('Should render fallback when image failed to load', () => {
    const wrapper = shallow(
      <ExternalSVG
        href='/assets/icon.svg'
        width={3}
        height={2}
        fallback={<div data-testid='image-fallback' />}
      />
    )

    const image = wrapper.find('image')

    const imageProps = image.getElement().props

    expect(wrapper.find('[data-testid="image-fallback"]').exists()).toBe(false)

    imageProps.onError()

    expect(wrapper.find('[data-testid="image-fallback"]').exists()).toBe(true)
  })
})
