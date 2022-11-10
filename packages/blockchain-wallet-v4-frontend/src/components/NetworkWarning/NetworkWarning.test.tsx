import React from 'react'
import { IntlProvider } from 'react-intl'
import { mount } from 'enzyme'

import { NetworkWarning, Props } from './NetworkWarning'
import { Variant } from './types'

const setup = (props: Props) =>
  mount(
    <IntlProvider locale='en' messages={{}}>
      <NetworkWarning {...props} />
    </IntlProvider>
  )

describe('NetworkWarning', () => {
  describe('when warning is equal to null', () => {
    it('should not render warning', () => {
      const wrapper = setup({
        variant: Variant.SEND,
        warning: null
      })

      expect(wrapper.html()).toBe('')
    })
  })

  describe('when warning exists', () => {
    describe('and when variant is SEND', () => {
      it('should display correct text for send warning', () => {
        const wrapper = setup({
          variant: Variant.SEND,
          warning: {
            network: 'Avalanche',
            symbol: 'AVAX'
          }
        })

        expect(wrapper.html()).toContain('Only send AVAX on the Avalanche network')
        expect(wrapper.html()).toContain(
          'Please send AVAX on the Avalanche Network for this wallet only. We cannot recover lost funds.'
        )
      })
    })

    describe('and when variant is RECEIVE', () => {
      it('should display correct text for receive warning', () => {
        const wrapper = setup({
          variant: Variant.RECEIVE,
          warning: {
            network: 'Avalanche',
            symbol: 'AVAX'
          }
        })

        expect(wrapper.html()).toContain('AVAX is on the Avalanche network')
        expect(wrapper.html()).toContain(
          'Please receive AVAX on the Avalanche Network for this address only. We cannot recover lost funds.'
        )
      })
    })

    describe('and when button is clicked', () => {
      it('should call window.open with correct values', () => {
        const windowOpenSpy = jest.spyOn(global.window, 'open')

        const wrapper = setup({
          variant: Variant.RECEIVE,
          warning: {
            network: 'Avalanche',
            symbol: 'AVAX'
          }
        })

        wrapper.find('button').simulate('click')

        expect(windowOpenSpy).toHaveBeenCalledWith(
          'https://support.blockchain.com/hc/en-us/articles/6416326056092',
          '_blank',
          'noopener, noreferrer'
        )
      })
    })
  })
})
