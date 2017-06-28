import React from 'react'
import { FormattedMessage } from 'react-intl'
import CSSModules from 'react-css-modules'

import style from './style.scss'

const Footer = () => {
  return (
    <div styleName='footer'>
      <a href='https://blockchain.info/Resources/TermsofServicePolicy.pdf' target='_blank'>
        <FormattedMessage id='components.layouts.wallet.menuleft.footer.termsofservice' defaultMessage='ToS' />
      </a>
      <div styleName='circle' />
      <a href='https://www.blockchain.com/assets/pdf/Blockchain_PrivacyPolicy.pdf' target='_blank' className='text-capitalize'>
        <FormattedMessage id='components.layouts.wallet.menuleft.footer.privacypolicy' defaultMessage='Privacy policy' />
      </a>
      <div styleName='circle' />
      <a href='https://www.blockchain.com/about' target='_blank'>
        <FormattedMessage id='components.layouts.wallet.menuleft.footer.about' defaultMessage='About' />
      </a>
    </div>
  )
}

export default CSSModules(Footer, style)
