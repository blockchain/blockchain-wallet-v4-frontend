import React from 'react'
import { FormattedMessage } from 'react-intl'

const description = (
  <div className='d-flex flex-column justify-item-start'>
    <div className='h6'>
      <FormattedMessage id='scenes.preferences.mobile.title' defaultMessage='Mobile number' />
    </div>
    <div className='flex-row'>
      <FormattedMessage id='scenes.preferences.mobile.description' defaultMessage='Your mobile phone can be used to enable two-factor authentication, ' />
      <FormattedMessage id='scenes.preferences.mobile.description' defaultMessage='helping to secure your wallet from unauthorized access, ' />
      <FormattedMessage id='scenes.preferences.mobile.description' defaultMessage='and to send bitcoin payment alerts when you receive funds.' />
    </div>
  </div>
)

const settings = (
  <div className='d-flex flex-column justify-item-start align-items-end'>
    <span className='h6'>+447800000000</span>
    <button className='button-secondary'>
      <FormattedMessage id='scenes.preferences.mobile.change' defaultMessage='Change' />
    </button>
  </div>
)

export default {
  description, settings
}
