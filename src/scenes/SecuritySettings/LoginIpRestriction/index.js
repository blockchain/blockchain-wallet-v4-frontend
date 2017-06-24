import React from 'react'
import { FormattedMessage } from 'react-intl'

const description = (
  <div className='d-flex flex-column justify-item-start'>
    <div className='h6'>
      <FormattedMessage id='scenes.settings.iprestriction.title' defaultMessage='Login IP restriction' />
    </div>
    <div className='flex-row'>
      <FormattedMessage id='scenes.settings.iprestriction.description' defaultMessage='Only allow login from IP address in the whitelist.' />
      <FormattedMessage id='scenes.settings.iprestriction.description2' defaultMessage='If you do not have a static IP address, this may lock you out of your wallet.If you have verified your email address, you will be notified of any suspicious login attempts.' />
    </div>
  </div>
)

const settings = (
  <div className='d-flex flex-column justify-item-start align-items-end'>
    <button className='button-secondary'>
      <FormattedMessage id='scenes.settings.iprestriction.enable' defaultMessage='Enable' />
    </button>
  </div>
)

export default {
  description, settings
}
