import React from 'react'
import { IntlProvider } from 'react-intl'
import { render, screen } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'

import { Palette } from 'blockchain-info-components'
import { useCountDown } from 'hooks'

import { QuoteCountDown } from './QuoteCountDown'

jest.mock('hooks/useCountDown', () => ({
  useCountDown: jest.fn(() => ({}))
}))

const DATE_TIMESTAMP = 1653436860000
const TOTAL_MS = 50000

const setup = () =>
  render(
    <IntlProvider locale='en' messages={{}}>
      <ThemeProvider theme={Palette('default')}>
        <QuoteCountDown date={new Date(DATE_TIMESTAMP)} totalMs={TOTAL_MS} />
      </ThemeProvider>
    </IntlProvider>
  )

describe('QuoteCountDown', () => {
  it('should call useQuoteCountDown with provided date', () => {
    setup()

    const timestamp = (useCountDown as jest.Mock).mock.calls[0][0].getTime()

    expect(useCountDown).toHaveBeenCalledWith(expect.any(Date), TOTAL_MS)
    expect(timestamp).toBe(DATE_TIMESTAMP)
  })

  describe('when count down is not completed', () => {
    it('should display text with count down', () => {
      ;(useCountDown as jest.Mock).mockImplementationOnce(() => ({
        isCompleted: false,
        timer: '01:16'
      }))

      setup()

      const countDownText = screen.getByText('01:16')

      expect(countDownText).toBeVisible()
    })
  })

  describe('when count down is completed', () => {
    it('should display soon text', () => {
      ;(useCountDown as jest.Mock).mockImplementationOnce(() => ({
        isCompleted: true,
        timer: '00:00'
      }))

      setup()

      const countDownText = screen.getByText('soon')

      expect(countDownText).toBeVisible()
    })
  })
})
