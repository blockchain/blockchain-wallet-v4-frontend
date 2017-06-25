import React from 'react'
import { FormattedMessage } from 'react-intl'

const description = (
  <div className='d-flex flex-column justify-item-start'>
    <div className='h6'>
      <FormattedMessage id='scenes.settings.2fa.title' defaultMessage='2-step Verification' />
    </div>
    <div className='flex-row'>
      <FormattedMessage id='scenes.settings.2fa.description' defaultMessage='Protect your wallet from unauthorized access by enabling 2-Step Verification.' />
      <FormattedMessage id='scenes.settings.2fa.description2' defaultMessage='You can choose to use a free app or your mobile phone number to secure your wallet.' />
    </div>
  </div>
)

const settings = (
  <div className='d-flex flex-column justify-item-start align-items-end'>
    <button className='button-secondary'>
      <FormattedMessage id='scenes.settings.2fa.enable' defaultMessage='Enable' />
    </button>
  </div>
)

export default {
  description, settings
}
