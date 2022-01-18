import React from 'react'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'
import styled from 'styled-components'

import {
  Banner,
  Button,
  Icon,
  Link,
  SpinningLoader,
  Text,
  TextGroup
} from 'blockchain-info-components'
import { FormLabel } from 'components/Form'
import { Wrapper } from 'components/Public'
import { LoginFormType, LoginSteps, ProductAuthOptions } from 'data/types'
import { isMobile, media } from 'services/styles'

export const removeWhitespace = (string) => string.replace(/\s/g, ``)

export const TabWrapper = styled.div`
  display: flex;
  width: 100%;
`

export const ProductTab = styled.div<{ backgroundColor?: string; product?: ProductAuthOptions }>`
  display: flex;
  justify-content: center;
  width: 50%;
  align-items: center;
  padding: 16px 0;
  cursor: pointer;
  border-radius: ${(props) =>
    props.product === ProductAuthOptions.WALLET ? ' 8px 0 0 0 ' : '0 8px 0 0'};
  background-color: ${(props) =>
    props.backgroundColor ? props.theme[props.backgroundColor] : 'none'};
`

export const LoginWrapper = styled(Wrapper)`
  z-index: 1;
`

export const WrapperWithPadding = styled.div`
  padding: 0 32px;
  ${media.mobile`
  padding: 0 16px;
  `}
`

export const ActionButton = styled(Button)`
  margin-top: 15px;
`
const BrowserWarning = styled.div`
  margin-bottom: 10px;
`
export const Row = styled.div`
  display: flex;
`
export const CenterRow = styled.div`
  display: flex;
  justify-content: center;
`
export const CartridgeSentContainer = styled.div`
  width: auto;
`
export const GuidError = styled(TextGroup)`
  display: inline;
  margin-top: 3px;
`
export const LoginFormLabel = styled(FormLabel)`
  margin-bottom: 8px;
`

export const CircleBackground = styled.div<{ color?: string; size?: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${(props) => (props.size ? props.size : '40px')};
  height: ${(props) => (props.size ? props.size : '40px')};
  min-width: ${(props) => (props.size ? props.size : '40px')};
  background-color: ${(props) => (props.color ? props.theme[props.color] : props.theme.blue600)};
  border-radius: ${(props) => (props.size ? props.size : '40px')};
  margin-bottom: 8px;
`
export const RectangleBackground = styled.div`
  height: 48px;
  width: 100%;
  background-color: ${(props) => props.theme.grey000};
  border-radius: 8px;
  margin-top: 24px;
`
const BackArrowWrapper = styled.div<{ marginTop?: string }>`
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
  align-items: center;
  margin-top: ${(props) => (props.marginTop ? props.marginTop : 'auto')};
`
const BackArrow = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`
const EmailAndGuid = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`
export const HelpRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 16px;
`
export const Column = styled.div`
  display: flex;
  flex-direction: column;
`
export const CenteredColumn = styled(Column)`
  align-items: center;
`
export const Loader = styled(SpinningLoader)`
  height: 75px;
  width: 75px;
  margin: 75px;
`
export const PhishingWarning = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  background-color: ${(props) => props.theme.whiteFade100};
  padding: 12px 32px;
`

export const BackArrowFormHeader = (props: {
  formValues: LoginFormType
  handleBackArrowClick: () => void
  hideBackArrow?: boolean
  hideGuid?: boolean
  marginTop?: string
}) => {
  const guid = props.formValues?.guid
  const firstPartGuid = guid && guid.slice(0, 4)
  const lastPartGuid = guid && guid.slice(-4)
  return (
    <>
      <BackArrowWrapper marginTop={props.marginTop}>
        <BackArrow onClick={props.handleBackArrowClick}>
          {!props.hideBackArrow && (
            <Icon
              data-e2e='signupBack'
              name='arrow-back'
              size='24px'
              color='blue600'
              style={{ marginRight: '8px' }}
              role='button'
            />
          )}
          <Text color='grey900' size='14px' weight={600} lineHeight='1.5'>
            <FormattedMessage id='copy.back' defaultMessage='Back' />
          </Text>
        </BackArrow>
        <EmailAndGuid>
          {props.hideGuid || props.formValues.email || (props.formValues.email && isMobile()) ? (
            <Text
              color='blue600'
              size='12px'
              weight={600}
              lineHeight='1.5'
              style={{ marginRight: '2px' }}
            >
              {props.formValues?.email}
            </Text>
          ) : (
            <Text color='grey400' size='12px' weight={600} lineHeight='1.5'>
              ({firstPartGuid}...{lastPartGuid})
            </Text>
          )}
          {props.formValues.step !== LoginSteps.CHECK_EMAIL &&
            props.formValues.email &&
            !props.hideGuid &&
            !isMobile() && (
              <Text size='12px' weight={500} color='grey400'>
                ({firstPartGuid}...{lastPartGuid})
              </Text>
            )}
        </EmailAndGuid>
      </BackArrowWrapper>
    </>
  )
}

export const LinkRow = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

export const WalletNeedHelpLink = (props: { authActions; origin: string }) => (
  <LinkContainer
    to='/help'
    onClick={() => props.authActions.analyticsNeedHelpClicked(props.origin)}
  >
    <Link size='13px' weight={600} data-e2e='loginGetHelp'>
      <FormattedMessage id='copy.need_some_help' defaultMessage='Need some help?' />
    </Link>
  </LinkContainer>
)

export const ExchangeNeedHelpLink = (props: { authActions; origin: string }) => (
  <LinkContainer
    to='/help-exchange'
    onClick={() => props.authActions.analyticsNeedHelpClicked(props.origin)}
  >
    <Link size='13px' weight={600} data-e2e='loginGetHelp'>
      <FormattedMessage id='copy.need_some_help' defaultMessage='Need some help?' />
    </Link>
  </LinkContainer>
)

const SubCard = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 24px;
  border-top: 1px solid ${(props) => props.theme.grey000};
  padding: 0;
  ${media.tabletL`
  flex-direction: column;
  align-items: center;
`};
`
const SignUpText = styled(Text)`
  margin-top: 16px;
  cursor: pointer;
  ${media.mobile`
  margin-top: 0;
`};
  &:hover {
    font-weight: 600;
  }
`
const SignUpLinkRow = styled.div`
  display: flex;
  align-items: center;
  ${media.mobile`
flex-direction: column;
align-items: center;
`}
`
export const SignUpLink = () => (
  <SubCard>
    <LinkContainer data-e2e='signupLink' to='/signup'>
      <SignUpLinkRow>
        <Text
          size='16px'
          color='grey600'
          weight={500}
          style={{ cursor: 'pointer', marginTop: '16px' }}
        >
          <FormattedMessage
            id='scenes.login.account_signup'
            defaultMessage="Don't have a Blockchain Account?"
          />
        </Text>
        &nbsp;
        <SignUpText size='16px' color='blue600' weight={600}>
          <FormattedMessage id='buttons.signup_now' defaultMessage='Sign up Now ->' />
        </SignUpText>
      </SignUpLinkRow>
    </LinkContainer>
  </SubCard>
)
export const UnsupportedBrowserWarning = () => (
  <BrowserWarning>
    <Banner type='warning'>
      <FormattedMessage
        id='scenes.login.browserwarning'
        defaultMessage='Your browser is not supported. Please update to at least Chrome 45, Firefox 45, Safari 8, Edge, or Opera.'
      />
    </Banner>
  </BrowserWarning>
)

const FooterWrapper = styled.div<{ step: LoginSteps }>`
  visibility: ${(props) => (props.step === LoginSteps.ENTER_EMAIL_GUID ? 'visible' : 'hidden')};
  margin-bottom: ${(props) => (props.step === LoginSteps.ENTER_EMAIL_GUID ? '32px' : '0')};
`
// margin bottom above is to keep the height of the container consistent
// when transitioning from email form to password form

export const getLoginPageFooter = (step) => {
  return (
    <FooterWrapper step={step}>
      <Text size='14px' color='grey400' weight={500} style={{ margin: '24px 0 16px' }}>
        <FormattedMessage
          id='scenes.login.phishingwarning'
          defaultMessage='Please check that you are visiting the correct URL'
        />
      </Text>
      <PhishingWarning>
        <Icon name='padlock' color='grey400' size='14px' />
        <Text color='grey400' weight={500} style={{ paddingLeft: '8px' }}>
          https://login.blockchain.com
        </Text>
      </PhishingWarning>
    </FooterWrapper>
  )
}
