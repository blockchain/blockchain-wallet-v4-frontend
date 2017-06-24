import React from 'react'
import { FormattedMessage } from 'react-intl'

const description = (
  <div className='d-flex flex-column justify-item-start'>
    <div className='h6'>
      <FormattedMessage id='scenes.preferences.currency.title' defaultMessage='Local currency' />
    </div>
    <div>
      <FormattedMessage id='scenes.preferences.currency.description' defaultMessage='Select your local currency.' />
    </div>
  </div>
)

const settings = (
  <div className='d-flex flex-column justify-item-start align-items-end'>
    [Currency Dropdown]
  </div>
)

export default {
  description, settings
}
