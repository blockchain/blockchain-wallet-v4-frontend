import React from 'react'
import { FormattedMessage } from 'react-intl'

import { getFormattedMessageComponent } from '.'

describe('getFormattedMessageComponent()', () => {
  it('Should return a FormattedMessage when the key has a valid FormattedMessageComponent', () => {
    expect(getFormattedMessageComponent('currency.ars')).toEqual(
      <FormattedMessage id='currency.ars' defaultMessage='Argentine Peso' />
    )
  })

  it("Should return a empty string when the key hasn't a valid FormattedMessageComponent", () => {
    expect(getFormattedMessageComponent('TEST')).toEqual('')
  })

  it('Should return a empty string when the key is empty', () => {
    expect(getFormattedMessageComponent('')).toEqual('')
  })
})
