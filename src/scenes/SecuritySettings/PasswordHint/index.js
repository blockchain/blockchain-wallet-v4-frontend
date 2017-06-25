import React from 'react'
import { FormattedMessage } from 'react-intl'

const description = (
  <div className='d-flex flex-column justify-item-start'>
    <div className='h6'>
      <FormattedMessage id='scenes.settings.passwordhint.title' defaultMessage='Password hint' />
    </div>
    <div className='flex-row'>
      <FormattedMessage id='scenes.settings.passwordhint.description' defaultMessage='Your Blockchain Wallet never communicates your password to our servers.' />
      <FormattedMessage id='scenes.settings.passwordhint.description2' defaultMessage='This means we have no idea what your password is and we cannot reset it if you forget it.' />
      <FormattedMessage id='scenes.settings.passwordhint.description3' defaultMessage='Create a memorable password hint that we can send to your verified email address in case you forget your password.' />
    </div>
  </div>
)

const settings = (
  <div className='d-flex flex-column justify-item-start align-items-end'>
    <button className='button-secondary'>
      <FormattedMessage id='scenes.settings.passwordhint.change' defaultMessage='Change' />
    </button>
  </div>
)

export default {
  description, settings
}
