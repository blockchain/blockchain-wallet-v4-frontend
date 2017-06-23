import React from 'react'
import { FormattedMessage } from 'react-intl'

const description = (
  <div className='d-flex flex-column justify-item-start'>
    <div className='d-flex h6'>
      <FormattedMessage id='scenes.info.pairingcode.title' defaultMessage='Pairing code' />
    </div>
    <div className='d-flex'>
      <FormattedMessage id='scenes.info.pairingcode.explain' defaultMessage='Scan the code (click on `Show Pairing Code`)
        with your Blockchain Wallet (iOS or Android) for a seamless connection to your wallet. Download our mobiles applications below' />
    </div>
    <div className='d-flex'>
      <a href='https://itunes.apple.com/us/app/blockchain-bitcoin-wallet/id493253309'>iOS</a>
      <a href='https://play.google.com/store/apps/details?id=piuk.blockchain.android'>Android</a>
    </div>
    <div className='d-flex text-danger'>
      <FormattedMessage id='scenes.info.pairingcode.warning' defaultMessage='Do not share your Pairing Code with others.' />
    </div>
  </div>
)

const settings = (
  <button className='d-flex button-secondary'>
    <FormattedMessage id='scenes.info.pairingcode.show' defaultMessage='Show pairing code' />
  </button>
)

export default {
  description, settings
}
