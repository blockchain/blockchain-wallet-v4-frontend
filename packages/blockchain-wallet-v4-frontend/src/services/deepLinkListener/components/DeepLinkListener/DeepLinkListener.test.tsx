import React, { FC } from 'react'
import { mount } from 'enzyme'

import { DeepLinkClickState, DeepLinkListener, useDeepLink } from 'services/deepLinkListener'

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
    const deepLinkHandlerSpy = jest.fn()
    const onResultSpy = jest.fn()

    const wrapper = mount(
      <DeepLinkListener onClickDeepLink={deepLinkHandlerSpy}>
        <DeepLinkButton link='deep_link_one' title='Deep link one' onResult={onResultSpy} />
      </DeepLinkListener>
    )
    wrapper.find('button[children="Deep link one"]').simulate('click')
    expect(deepLinkHandlerSpy).toHaveBeenCalled()
  })
  it('Should promote the click event until it find a handler', () => {
    const deepLinkRootHandlerSpy = jest.fn(() => DeepLinkClickState.notHandled)
    const deepLinkSecondHandlerSpy = jest.fn(() => DeepLinkClickState.handled)
    const onResultSpy = jest.fn()

    const wrapper = mount(
      <DeepLinkListener onClickDeepLink={deepLinkRootHandlerSpy}>
        <DeepLinkListener onClickDeepLink={deepLinkSecondHandlerSpy}>
          <DeepLinkListener onClickDeepLink={() => DeepLinkClickState.notHandled}>
            <DeepLinkButton link='deep_link_one' title='Deep link one' onResult={onResultSpy} />
          </DeepLinkListener>
        </DeepLinkListener>
      </DeepLinkListener>
    )
    wrapper.find('button[children="Deep link one"]').simulate('click')

    expect(deepLinkSecondHandlerSpy).toHaveBeenCalled()
    expect(deepLinkRootHandlerSpy).not.toHaveBeenCalled()
    expect(onResultSpy).toHaveBeenCalledWith(DeepLinkClickState.handled)
  })
})
