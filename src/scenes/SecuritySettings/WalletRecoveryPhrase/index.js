import React from 'react'
import { FormattedMessage } from 'react-intl'

const description = (
  <div className='d-flex flex-column justify-item-start'>
    <div className='d-flex h6 padding-bottom-10 text-capitalize'>
      <FormattedMessage id='scenes.settings.recoveryphrase.title' defaultMessage='Wallet Recovery Phrase' />
    </div>
    <div className='d-flex'>
      <FormattedMessage id='scenes.settings.recoveryphrase.description' defaultMessage='Your recovery phrase can be used to restore all your funds in the case of a lost password
       or a loss of service at Blockchain. Note, that the recovery phrase never changes and recovers all of your existing bitcoins as well
        as newly received funds in this wallet. Please note that imported addresses are not backed up by the wallet recovery phrase. 
      We strongly recommend to transfer funds from imported addresses into this wallet.' />
    </div>
  </div>
)

const settings = (
  <div className='d-flex flex-column justify-item-start align-items-end'>
    <button className='d-flex button-secondary'>
      <FormattedMessage id='scenes.settings.recoveryphrase.backup' defaultMessage='Backup phrase' />
    </button>
  </div>
)

export default {
  description, settings
}
