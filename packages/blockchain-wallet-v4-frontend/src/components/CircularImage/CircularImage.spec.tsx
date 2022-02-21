import React from 'react'
import { shallow } from 'enzyme'

import { CircularImage } from '.'

describe('CircularImage', () => {
  describe('#radius', () => {
    it('Should create a circular image when size is small', () => {
      const component = shallow(<CircularImage radius='small' src='http://example.com/' />)

      const imageTagStyle = component.get(0).props.style

      expect(imageTagStyle.width).toEqual(24)
      expect(imageTagStyle.height).toEqual(24)
      expect(imageTagStyle.borderRadius).toEqual(12)
    })

    it('Should create a circular image when size is medium', () => {
      const component = shallow(<CircularImage radius='medium' src='http://example.com/' />)

      const imageTagStyle = component.get(0).props.style

      expect(imageTagStyle.width).toEqual(40)
      expect(imageTagStyle.height).toEqual(40)
      expect(imageTagStyle.borderRadius).toEqual(20)
    })

    it('Should create a circular image when size is large', () => {
      const component = shallow(<CircularImage radius='large' src='http://example.com/' />)

      const imageTagStyle = component.get(0).props.style

      expect(imageTagStyle.width).toEqual(48)
      expect(imageTagStyle.height).toEqual(48)
      expect(imageTagStyle.borderRadius).toEqual(24)
    })

    it('Should create a circular image with the custom radius', () => {
      const component = shallow(<CircularImage radius={8} src='http://example.com/' />)

      const imageTagStyle = component.get(0).props.style

      expect(imageTagStyle.width).toEqual(16)
      expect(imageTagStyle.height).toEqual(16)
      expect(imageTagStyle.borderRadius).toEqual(8)
    })
  })
})
