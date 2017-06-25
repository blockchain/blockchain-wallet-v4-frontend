import React from 'react'
import { FormattedMessage } from 'react-intl'

const description = (
  <div className='d-flex flex-column justify-item-start'>
    <div className='h6'>
      <FormattedMessage id='scenes.preferences.bitcoinunit.title' defaultMessage='Bitcoin Unit' />
    </div>
    <div>
      <FormattedMessage id='scenes.preferences.bitcoinunit.description' defaultMessage='Adjust the precision you would prefer bitcoin values to be displayed in.' />
    </div>
  </div>
)

const settings = (
  <div className='d-flex flex-column justify-item-start align-items-end'>
    [BitcoinUnit Dropdown]
  </div>
)

export default {
  description, settings
}
