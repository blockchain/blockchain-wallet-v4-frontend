import React from 'react'
import { FormattedMessage } from 'react-intl'

const description = (
  <div className='d-flex flex-column justify-item-start'>
    <div className='h6'>
      <FormattedMessage id='scenes.settings.tor.title' defaultMessage='Wallet Access via Tor' />
    </div>
    <div className='flex-row'>
      <FormattedMessage id='scenes.settings.tor.description' defaultMessage='Enable the following option to prevent IP addresses that are known to be part of the Tor anonymizing network from accessing your wallet.' />
      <FormattedMessage id='scenes.settings.tor.description2' defaultMessage='The Tor network is frequently used by hackers attempting to access Blockchain users wallets.' />
    </div>
  </div>
)

const settings = (
  <div className='d-flex flex-column justify-item-start align-items-end'>
    <button className='button-secondary'>
      <FormattedMessage id='scenes.settings.tor.block' defaultMessage='Block' />
    </button>
  </div>
)

export default {
  description, settings
}
