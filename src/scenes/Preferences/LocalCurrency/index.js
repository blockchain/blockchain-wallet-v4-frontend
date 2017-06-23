import React from 'react'
import { FormattedText } from 'react-intl'

const description = (
  <div className='d-flex flex-column justify-item-start'>
    <div className='d-flex h6 padding-bottom-10 text-capitalize'>
      <FormattedText id='scenes.preferences.currency.title' defaultMessage='Local currency' />
    </div>
    <div className='d-flex'>
      <FormattedText id='scenes.preferences.currency.description' defaultMessage='Select your local currency.' />
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
