import React from 'react'
import { FormattedMessage } from 'react-intl'

const description = (
  <div className='d-flex flex-column justify-item-start'>
    <div className='d-flex h6 padding-bottom-10 text-capitalize'>
      <FormattedMessage id='scenes.preferences.language.title' defaultMessage='Wallet Language' />
    </div>
    <div className='d-flex'>
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
