import React from 'react'
import { FormattedMessage } from 'react-intl'

const description = (
  <div className='d-flex flex-column justify-item-start'>
    <div className='d-flex h6 padding-bottom-10 text-capitalize'>
      <FormattedMessage id='scenes.settings.passwordhint.title' defaultMessage='Password hint' />
    </div>
    <div className='d-flex'>
      <FormattedMessage id='scenes.settings.passwordhint.description' defaultMessage='Your Blockchain Wallet never communicates your password to our servers. 
      This means we have no idea what your password is and we cannot reset it if you forget it.
      Create a memorable password hint that we can send to your verified email address in case you forget your password.' />
    </div>
  </div>
)

const settings = (
  <div className='d-flex flex-column justify-item-start align-items-end'>
    <button className='d-flex button-secondary'>
      <FormattedMessage id='scenes.settings.passwordhint.change' defaultMessage='Change' />
    </button>
  </div>
)

export default {
  description, settings
}
