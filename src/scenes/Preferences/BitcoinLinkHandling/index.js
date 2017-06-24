import React from 'react'
import { FormattedMessage } from 'react-intl'

const description = (
  <div className='d-flex flex-column justify-item-start'>
    <div className='d-flex h6 padding-bottom-10 text-capitalize'>
      <FormattedMessage id='scenes.preferences.bitcoinlinkhandling.title' defaultMessage='Bitcoin Links Handling' />
    </div>
    <div className='d-flex'>
      <FormattedMessage id='scenes.preferences.bitcoinlinkhandling.description' defaultMessage='Enable this to allow your Blockchain Wallet
      to handle bitcoin payment links in the web browser. This will make your experience more convenient when transacting online.' />
    </div>
  </div>
)

const settings = (
  <div className='d-flex flex-column justify-item-start align-items-end'>
    <button className='d-flex button-secondary'>
      <FormattedMessage id='scenes.preferences.bitcoinlinkhandling.enable' defaultMessage='Enable' />
    </button>
    <div className='d-flex'>
      <FormattedMessage id='scenes.preferences.bitcoinlinkhandling.unknownstatus' defaultMessage="We can't detect whether or not
      handling of bitcoin links has been enabled. If it has already been enabled, nothing will happen." />
    </div>
  </div>
)

export default {
  description, settings
}
