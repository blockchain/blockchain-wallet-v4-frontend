import React from 'react'
import { FormattedMessage } from 'react-intl'

const description = (
  <div className='d-flex flex-column justify-item-start'>
    <div className='d-flex h6 padding-bottom-10 text-capitalize'>
      <FormattedMessage id='scenes.preferences.email.title' defaultMessage='Email address' />
    </div>
    <div className='d-flex'>
      <FormattedMessage id='scenes.preferences.email.description' defaultMessage='Your verified email address is used to send login codes
      when suspicious or unusual activity is detected, to remind you of your wallet login ID, and to send bitcoin payment alerts when you receive funds.' />
    </div>
    <div className='d-flex text-danger'>
      <FormattedMessage id='scenes.preferences.email.warning' defaultMessage="This will change your wallet's email address,
      but the email address you signed up to Buy Bitcoin with will remain the same." />
    </div>
  </div>
)

const settings = (
  <div className='d-flex flex-column justify-item-start align-items-end'>
    <span className='d-flex h6'>test@example.com</span>
    <button className='d-flex button-secondary'>
      <FormattedMessage id='scenes.preferences.email.change' defaultMessage='Change' />
    </button>
  </div>
)

export default {
  description, settings
}
