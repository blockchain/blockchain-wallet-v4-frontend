import React from 'react'
import { IntlProvider } from 'react-intl'
import { render, screen } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'

import { MobilePaymentType } from '@core/network/api/buySell/types'
import { Palette } from 'blockchain-info-components'
import { useCountDown } from 'hooks'

import { ConfirmButton, Props } from './ConfirmButton'

jest.mock('hooks/useCountDown', () => ({
  useCountDown: jest.fn(() => ({
    isCompletingSoon: false
  }))
}))

const makeDefaultProps = (): Props => ({
  isAcceptedTerms: true,
  isGooglePayReady: false,
  isSubmitting: false,
  refreshConfig: {
    date: new Date(1653436800000),
    totalMs: 23000
  }
})

const setup = (props: Props) =>
  render(
    <IntlProvider locale='en' messages={{}}>
      <ThemeProvider theme={Palette('default')}>
        <ConfirmButton {...props} />
      </ThemeProvider>
    </IntlProvider>
  )

const getBuyButton = (): HTMLButtonElement =>
  screen.getByRole('button', {
    name: 'Buy Now'
  })

const getButton = (): HTMLButtonElement => screen.getByRole('button')

describe('ConfirmButton', () => {
  it('should display submit button', () => {
    setup(makeDefaultProps())

    const button = getBuyButton()

    expect(button).toBeVisible()
    expect(button).toBeEnabled()
    expect(button.type).toBe('submit')
  })

  it('should call with useCountDown with correct refresh config values', () => {
    const props = makeDefaultProps()
    setup(props)

    expect(useCountDown).toHaveBeenCalledWith(props.refreshConfig.date, props.refreshConfig.totalMs)
  })

  describe('when isSubmitting is true', () => {
    it('should display disabled button', () => {
      setup({
        ...makeDefaultProps(),
        isSubmitting: true
      })

      const button = getButton()

      expect(button).toBeDisabled()
    })
  })

  describe('when isCompletingSoon is true', () => {
    it('should display disabled button', () => {
      ;(useCountDown as jest.Mock).mockImplementationOnce(() => ({
        isCompletingSoon: true
      }))
      setup(makeDefaultProps())

      const button = getButton()

      expect(button).toBeDisabled()
    })
  })

  describe('when isAcceptedTerms is false', () => {
    it('should display disabled button', () => {
      setup({
        ...makeDefaultProps(),
        isAcceptedTerms: false
      })

      const button = getBuyButton()

      expect(button).toBeDisabled()
    })
  })

  describe('when mobilePaymentMethod is gpay and isGooglePayReady is false', () => {
    it('should display disabled button', () => {
      setup({
        ...makeDefaultProps(),
        isGooglePayReady: false,
        mobilePaymentMethod: MobilePaymentType.GOOGLE_PAY
      })

      const button = getBuyButton()

      expect(button).toBeDisabled()
    })
  })
})
