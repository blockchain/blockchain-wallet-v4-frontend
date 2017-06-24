import React from 'react'
import { FormattedMessage } from 'react-intl'

const description = (
  <div className='d-flex flex-column justify-item-start'>
    <div className='h6'>
      <FormattedMessage id='scenes.preferences.bitcoinlinkhandling.title' defaultMessage='Bitcoin Links Handling' />
    </div>
    <div>
      <FormattedMessage id='scenes.preferences.bitcoinlinkhandling.description' defaultMessage='Enable this to allow your Blockchain Wallet to handle bitcoin payment links in the web browser.' />
      <FormattedMessage id='scenes.preferences.bitcoinlinkhandling.description2' defaultMessage='This will make your experience more convenient when transacting online.' />
    </div>
  </div>
)

const settings = (
  <div className='d-flex flex-column justify-item-start align-items-end'>
    <button className='button-secondary'>
      <FormattedMessage id='scenes.preferences.bitcoinlinkhandling.enable' defaultMessage='Enable' />
    </button>
    <div>
      <FormattedMessage id='scenes.preferences.bitcoinlinkhandling.unknownstatus' defaultMessage="We can't detect whether or not handling of bitcoin links has been enabled." />
      <FormattedMessage id='scenes.preferences.bitcoinlinkhandling.unknownstatus2' defaultMessage='If it has already been enabled, nothing will happen.' />
    </div>
  </div>
)

export default {
  description, settings
}
