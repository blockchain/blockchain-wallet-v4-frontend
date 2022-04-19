import React from 'react'
import { shallow } from 'enzyme'

import { ClickableArea } from './ClickableArea'

describe('<ClickableArea />', () => {
  it('Should fire the onClick callback when clicked', () => {
    const onClickSpy = jest.fn()

    const wrapper = shallow(<ClickableArea onClick={onClickSpy}>Click me!</ClickableArea>)

    wrapper.simulate('click')

    expect(onClickSpy).toHaveBeenCalledTimes(1)
  })
})
