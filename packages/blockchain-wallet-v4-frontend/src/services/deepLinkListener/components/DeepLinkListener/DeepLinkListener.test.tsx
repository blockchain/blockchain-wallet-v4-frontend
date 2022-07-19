import React, { FC } from 'react'
import { mount } from 'enzyme'

import { DeepLinkListener, useDeepLink } from 'services/deepLinkListener'

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
})
