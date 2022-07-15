import React from 'react'
import { FormattedMessage } from 'react-intl'

import { getFormattedMesasageComponent } from '.'

describe('getFormattedMesasageComponent()', () => {
  it('Should return a FormattedMessage when the key has a valid FormattedMessageComponent', () => {
    expect(getFormattedMesasageComponent('currency.ars')).toEqual(
      <FormattedMessage id='currency.ars' defaultMessage='Argentine Peso' />
    )
  })

  it("Should return a empty string when the key hasn't a valid FormattedMessageComponent", () => {
    expect(getFormattedMesasageComponent('TEST')).toEqual('')
  })

  it('Should return a empty string when the key is empty', () => {
    expect(getFormattedMesasageComponent('')).toEqual('')
  })
})
