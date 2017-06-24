import React from 'react'
import { FormattedMessage } from 'react-intl'

const description = (
  <div className='d-flex flex-column justify-item-start'>
    <div className='d-flex h6 padding-bottom-10 text-capitalize'>
      <FormattedMessage id='scenes.settings.password.title' defaultMessage='Wallet Password' />
    </div>
    <div className='d-flex'>
      <FormattedMessage id='scenes.settings.password.description' defaultMessage='Your password is never shared with our servers, which means we cannot help reset your password if you forget it.
      Make sure you write down your recovery phrase which can restore access to your wallet in the event of a lost password.' />
    </div>
  </div>
)

const settings = (
  <div className='d-flex flex-column justify-item-start align-items-end'>
    <button className='d-flex button-secondary'>
      <FormattedMessage id='scenes.settings.password.change' defaultMessage='Change' />
    </button>
  </div>
)

export default {
  description, settings
}
