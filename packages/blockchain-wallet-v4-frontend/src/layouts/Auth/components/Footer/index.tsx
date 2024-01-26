import React from 'react'
import { useSelector } from 'react-redux'
import { formValueSelector } from 'redux-form'
import styled from 'styled-components'

import { LOGIN_FORM } from 'data/auth/model'
import { getMagicLinkData, getProduct } from 'data/auth/selectors'
import { LoginSteps, PlatformTypes, ProductAuthOptions } from 'data/types'
import { media } from 'services/styles'

import DropdownLanguage from './DropdownLanguage'
import Help from './Help'
import InstitutionalPortal from './InstitutionalPortal'
import Version from './Version'

const FooterContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  margin: 6rem 0 2rem;

  ${media.mobile`
    flex-direction: column;
    margin-top: 0.5rem;
  `}
`

const FooterInner = styled.div`
  padding: 2rem 2rem 0;

  > * {
    margin: 0 0.5rem;
  }
`

const Footer = ({ path }) => {
  const authProduct = useSelector(getProduct)
  const step = useSelector((state) => formValueSelector(LOGIN_FORM)(state, 'step')) as LoginSteps
  const platform = useSelector(getMagicLinkData)?.platform_type

  const isMobile = platform !== PlatformTypes.IOS && platform !== PlatformTypes.ANDROID
  const showInstitutionalPortal =
    authProduct === ProductAuthOptions.EXCHANGE &&
    step !== LoginSteps.INSTITUTIONAL_PORTAL &&
    !isMobile &&
    path !== '/login'

  return (
    <FooterContainer>
      {showInstitutionalPortal && (
        <FooterInner>
          <InstitutionalPortal />
        </FooterInner>
      )}
      <FooterInner>
        <DropdownLanguage color='grey400' size='16px' />
        <Version />
        <Help />
      </FooterInner>
    </FooterContainer>
  )
}

export default Footer
