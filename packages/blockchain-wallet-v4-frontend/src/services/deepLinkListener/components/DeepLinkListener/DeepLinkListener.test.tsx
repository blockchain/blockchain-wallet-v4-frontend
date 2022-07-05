import React, { FC } from 'react'
import { mount } from 'enzyme'

import { DeepLinkListener, useDeepLink } from 'services/deepLinkListener'
import { createUnhandledError } from 'services/deepLinkListener/utils'

const DeepLinkButton: FC<{ link: string; onResult: (value: unknown) => void; title: string }> = ({
  link,
  onResult,
  title
}) => {
  const { onClickDeepLink } = useDeepLink()

  return (
    <button type='button' onClick={() => onResult(onClickDeepLink(link))}>
      {title}
    </button>
  )
}

describe('DeepLinkListener', () => {
  let consoleErrorSpy: jest.SpyInstance

  beforeAll(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterAll(() => {
    consoleErrorSpy.mockRestore()
  })

  afterEach(() => {
    consoleErrorSpy.mockClear()
  })

  it('Should indicate the deep link was handled by parent component', () => {
    const deepLinkOneHandlerSpy = jest.fn()
    const deepLinkTwoHandlerSpy = jest.fn()
    const onResultSpy = jest.fn()

    const handlers = {
      deep_link_one: deepLinkOneHandlerSpy,
      deep_link_two: deepLinkTwoHandlerSpy
    }

    const wrapper = mount(
      <DeepLinkListener handlers={handlers}>
        <DeepLinkButton link='deep_link_one' title='Deep link one' onResult={onResultSpy} />
      </DeepLinkListener>
    )

    wrapper.find('button[children="Deep link one"]').simulate('click')

    expect(deepLinkOneHandlerSpy).toHaveBeenCalled()
    expect(deepLinkTwoHandlerSpy).not.toHaveBeenCalled()

    expect(onResultSpy).toHaveBeenCalledWith({
      handled: true
    })
  })

  it('Should promote the click event until it find a handler', () => {
    const deepLinkRootHandlerSpy = jest.fn()
    const deepLinkSecondHandlerSpy = jest.fn()
    const onResultSpy = jest.fn()

    const rootHandlers = {
      deep_link_one: deepLinkRootHandlerSpy
    }
    const secondHandlers = {
      deep_link_one: deepLinkSecondHandlerSpy
    }

    const wrapper = mount(
      <DeepLinkListener handlers={rootHandlers}>
        <DeepLinkListener handlers={secondHandlers}>
          <DeepLinkListener handlers={{}}>
            <DeepLinkButton link='deep_link_one' title='Deep link one' onResult={onResultSpy} />
          </DeepLinkListener>
        </DeepLinkListener>
      </DeepLinkListener>
    )

    wrapper.find('button[children="Deep link one"]').simulate('click')

    expect(deepLinkSecondHandlerSpy).toHaveBeenCalled()
    expect(deepLinkRootHandlerSpy).not.toHaveBeenCalled()

    expect(onResultSpy).toHaveBeenCalledWith({
      handled: true
    })
  })

  it('Should return the state as unhandled', () => {
    const onResultSpy = jest.fn()

    const wrapper = mount(
      <DeepLinkListener handlers={{}}>
        <DeepLinkButton link='deep_link_one' title='Deep link one' onResult={onResultSpy} />
      </DeepLinkListener>
    )

    wrapper.find('button[children="Deep link one"]').simulate('click')

    expect(onResultSpy).toHaveBeenCalledWith({
      handled: false
    })

    expect(consoleErrorSpy).toHaveBeenCalledWith(createUnhandledError('deep_link_one'))
  })
})
