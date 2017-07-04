import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { NavLink } from 'react-router-dom'
import DropdownLanguage from 'components/Shared/DropdownLanguage'

import logo from 'img/blockchain-blue.svg'

const Footer = () => {
  return (
    <footer className='padding-vertical-40 padding-horizontal-10'>
      <div className='container'>
        <div className='row'>
          <div className='col-md-3'>
            <img src={logo} />
          </div>
          <div className='col-md-2'>
            <div>
              <FormattedMessage id='components.layouts.landing.footer.products' defaultMessage='Products' />
            </div>
            <NavLink to='/wallet'>
              <FormattedMessage id='components.layouts.landing.footer.wallet' defaultMessage='Wallet' />
            </NavLink>
            <a href='https://blockchain.com/enterprise'>
              <FormattedMessage id='components.layouts.landing.footer.business' defaultMessage='Business' />
            </a>
            <a href='https://blockchain.com/research'>
              <FormattedMessage id='components.layouts.landing.footer.research' defaultMessage='Research' />
            </a>
            <a href='https://blockchain.info'>.Info Explorer</a>
            <a href='https://support.blockchain.com'>
              <FormattedMessage id='components.layouts.landing.footer.support' defaultMessage='Support' />
            </a>
          </div>
          <div className='col-md-2'>
            <div>
              <FormattedMessage id='components.layouts.landing.footer.company' defaultMessage='Company' />
            </div>
            <a href='https://blockchain.com/about'>
              <FormattedMessage id='components.layouts.landing.footer.about' defaultMessage='About' />
            </a>
            <a href='https://blockchain.com/team'>
              <FormattedMessage id='components.layouts.landing.footer.team' defaultMessage='Team' />
            </a>
            <a href='https://blockchain.com/careers'>
              <FormattedMessage id='components.layouts.landing.footer.careers' defaultMessage='Careers' />
            </a>
            <a href='https://blockchain.com/interview'>
              <FormattedMessage id='components.layouts.landing.footer.interviewing' defaultMessage='Interviewing' />
            </a>
            <a href='https://blockchain.com/faq'>
              <FormattedMessage id='components.layouts.landing.footer.faq' defaultMessage='Faq' />
            </a>
          </div>
          <div className='col-md-2'>
            <div>
              <FormattedMessage id='components.layouts.landing.footer.news' defaultMessage='News' />
            </div>
            <a href='https://blockchain.com/press'>
              <FormattedMessage id='components.layouts.landing.footer.press' defaultMessage='Press' />
            </a>
            <a href='https://blog.blockchain.com'>
              <FormattedMessage id='components.layouts.landing.footer.blog' defaultMessage='Blog' />
            </a>
          </div>
          <div className='col-md-3'>
            <DropdownLanguage />
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

export default Footer
