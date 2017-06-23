import React from 'react'
import { FormattedText } from 'react-intl'

const description = (
  <div className='d-flex flex-column justify-item-start'>
    <div className='d-flex h6 padding-bottom-10 text-capitalize'>
      <FormattedText id='scenes.preferences.mobile.title' defaultMessage='Mobile number' />
    </div>
    <div className='d-flex'>
      <FormattedText id='scenes.preferences.mobile.description' defaultMessage='Your mobile phone can be used to enable two-factor authentication,
      helping to secure your wallet from unauthorized access, and to send bitcoin payment alerts when you receive funds.' />
    </div>
  </div>
)

const settings = (
  <div className='d-flex flex-column justify-item-start align-items-end'>
    <span className='d-flex h6'>+447800000000</span>
    <button className='d-flex button-secondary'>
      <FormattedText id='scenes.preferences.mobile.change' defaultMessage='Change' />
    </button>
  </div>
)

export default {
  description, settings
}
