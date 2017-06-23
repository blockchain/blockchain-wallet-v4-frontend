import React from 'react'
import CSSModules from 'react-css-modules'
import { FormattedMessage } from 'react-intl'
import { NavLink } from 'react-router-dom'
import DropdownLanguage from 'components/Shared/DropdownLanguage'

import logo from 'img/blockchain-blue.svg'
import style from './style.scss'

const Footer = () => {
  return (
    <footer className='padding-vertical-40 padding-horizontal-10' styleName='footer'>
      <div className='container'>
        <div className='row'>
          <div className='col-md-3'>
            <img src={logo} styleName='logo' />
          </div>
          <div className='col-md-2'>
            <div styleName='category'>
              <FormattedMessage id='components.layouts.landing.footer.products' defaultMessage='Products' />
            </div>
            <NavLink styleName='link' to='/wallet'>
              <FormattedMessage id='components.layouts.landing.footer.wallet' defaultMessage='Wallet' />
            </NavLink>
            <a styleName='link' href='https://blockchain.com/enterprise'>
              <FormattedMessage id='components.layouts.landing.footer.business' defaultMessage='Business' />
            </a>
            <a styleName='link' href='https://blockchain.com/research'>
              <FormattedMessage id='components.layouts.landing.footer.research' defaultMessage='Research' />
            </a>
            <a styleName='link' href='https://blockchain.info'>.Info Explorer</a>
            <a styleName='link' href='https://support.blockchain.com'>
              <FormattedMessage id='components.layouts.landing.footer.support' defaultMessage='Support' />
            </a>
          </div>
          <div className='col-md-2'>
            <div styleName='category'>
              <FormattedMessage id='components.layouts.landing.footer.company' defaultMessage='Company' />
            </div>
            <a styleName='link' href='https://blockchain.com/about'>
              <FormattedMessage id='components.layouts.landing.footer.about' defaultMessage='About' />
            </a>
            <a styleName='link' href='https://blockchain.com/team'>
              <FormattedMessage id='components.layouts.landing.footer.team' defaultMessage='Team' />
            </a>
            <a styleName='link' href='https://blockchain.com/careers'>
              <FormattedMessage id='components.layouts.landing.footer.careers' defaultMessage='Careers' />
            </a>
            <a styleName='link' href='https://blockchain.com/interview'>
              <FormattedMessage id='components.layouts.landing.footer.interviewing' defaultMessage='Interviewing' />
            </a>
            <a styleName='link' href='https://blockchain.com/faq'>
              <FormattedMessage id='components.layouts.landing.footer.faq' defaultMessage='Faq' />
            </a>
          </div>
          <div className='col-md-2'>
            <div styleName='category'>
              <FormattedMessage id='components.layouts.landing.footer.news' defaultMessage='News' />
            </div>
            <a styleName='link' href='https://blockchain.com/press'>
              <FormattedMessage id='components.layouts.landing.footer.press' defaultMessage='Press' />
            </a>
            <a styleName='link' href='https://blog.blockchain.com'>
              <FormattedMessage id='components.layouts.landing.footer.blog' defaultMessage='Blog' />
            </a>
          </div>
          <div className='col-md-3'>
            <DropdownLanguage styleName='dropdown' />
          </div>
        </div>
        <div className='row padding-top-20'>
          <div className='col-md-10'>
            <h6>2017 BLOCKCHAIN LUXEMBOURG S.A. ALL RIGHTS RESERVED.</h6>
          </div>
          <div className='col-md-2' />
        </div>
      </div>
    </footer>
  )
}

export default CSSModules(Footer, style)
