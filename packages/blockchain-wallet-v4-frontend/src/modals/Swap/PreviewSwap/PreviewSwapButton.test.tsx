import React from 'react'
import { IntlProvider } from 'react-intl'
import { render, screen } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'

import { Palette } from 'blockchain-info-components'
import { useCountDown } from 'hooks'

import { PreviewSwapButton, Props } from './PreviewSwapButton'

jest.mock('hooks/useCountDown', () => ({
  useCountDown: jest.fn(() => ({
    isCompletingSoon: false
  }))
}))

const makeDefaultProps = (): Props => ({
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
        <PreviewSwapButton {...props} />
      </ThemeProvider>
    </IntlProvider>
  )

const getButton = () => screen.getByRole('button')

describe('PreviewSwapButton', () => {
  it('should display submit button', () => {
    setup(makeDefaultProps())

    const button: HTMLButtonElement = screen.getByRole('button', {
      name: 'Swap Now'
    })

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
})
