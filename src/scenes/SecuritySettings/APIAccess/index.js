import React from 'react'
import { FormattedMessage } from 'react-intl'

const description = (
  <div className='d-flex flex-column justify-item-start'>
    <div className='d-flex h6 padding-bottom-10 text-capitalize'>
      <FormattedMessage id='scenes.settings.api.title' defaultMessage='API Access' />
    </div>
    <div className='d-flex'>
      <FormattedMessage id='scenes.settings.api.description' defaultMessage='Use our API to interact with your wallet programmatically.' />
    </div>
    <div className='d-flex'>
      <a href='https://github.com/blockchain/service-my-wallet-v3#installation'>
        <FormattedMessage id='scenes.settings.api.getstarted' defaultMessage='To get started, follow the steps here' />
      </a>
    </div>
  </div>
)

const settings = (
  <div />
)

export default {
  description, settings
}
