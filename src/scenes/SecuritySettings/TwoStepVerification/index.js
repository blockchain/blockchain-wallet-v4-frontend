import React from 'react'
import { FormattedMessage } from 'react-intl'

const description = (
  <div className='d-flex flex-column justify-item-start'>
    <div className='d-flex h6 padding-bottom-10 text-capitalize'>
      <FormattedMessage id='scenes.settings.2fa.title' defaultMessage='2-step Verification' />
    </div>
    <div className='d-flex'>
      <FormattedMessage id='scenes.settings.2fa.description' defaultMessage='Protect your wallet from unauthorized access by enabling 2-Step Verification.
      You can choose to use a free app or your mobile phone number to secure your wallet.' />
    </div>
  </div>
)

const settings = (
  <div className='d-flex flex-column justify-item-start align-items-end'>
    <button className='d-flex button-secondary'>
      <FormattedMessage id='scenes.settings.2fa.enable' defaultMessage='Enable' />
    </button>
  </div>
)

export default {
  description, settings
}
