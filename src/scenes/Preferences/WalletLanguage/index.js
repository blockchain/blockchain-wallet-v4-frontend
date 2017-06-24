import React from 'react'
import { FormattedMessage } from 'react-intl'

const description = (
  <div className='d-flex flex-column justify-item-start'>
    <div className='h6'>
      <FormattedMessage id='scenes.preferences.language.title' defaultMessage='Wallet Language' />
    </div>
    <div>
      <FormattedMessage id='scenes.preferences.language.description' defaultMessage='Set your preferred language.' />
    </div>
  </div>
)

const settings = (
  <div className='d-flex flex-column justify-item-start align-items-end'>
    [Languages Dropdown]
  </div>
)

export default {
  description, settings
}
