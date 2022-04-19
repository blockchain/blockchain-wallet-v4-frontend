import React from 'react'
import { shallow } from 'enzyme'

import { Tab } from '.'

describe('Tab', () => {
  it('Should be able to click the tab', () => {
    const onClickSpy = jest.fn()

    const wrapper = shallow(<Tab onClick={onClickSpy}>Live</Tab>)

    wrapper.simulate('click')

    expect(onClickSpy).toHaveBeenCalledTimes(1)
  })
})
