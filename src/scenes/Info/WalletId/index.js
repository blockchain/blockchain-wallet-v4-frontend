import React from 'react'
import { FormattedMessage } from 'react-intl'

const description = (
  <div className='d-flex flex-column justify-item-start'>
    <div className='h6'>
      <FormattedMessage id='scenes.info.walletid.title' defaultMessage='Wallet ID' />
    </div>
    <div className='flex-row'>
      <FormattedMessage id='scenes.info.walletid.description' defaultMessage='Wallet ID is your unique identifier.' />
      <FormattedMessage id='scenes.info.walletid.description2' defaultMessage='It is completely individual to you, and it is what you will use to log in and access your wallet.' />
      <FormattedMessage id='scenes.info.walletid.description3' defaultMessage='It is NOT a bitcoin address for sending or receiving.' />
    </div>
    <div className='text-danger'>
      <FormattedMessage id='scenes.info.walletid.warning' defaultMessage='Do not share your Wallet ID with others.' />
    </div>
  </div>
)

const settings = (
  <div className='d-flex flex-column justify-item-start align-items-end'>
    <span className='d-flex h6'>29f92cab-4dba-90d5-8a68-ab9cd22c3582</span>
  </div>
)

export default {
  description, settings
}
