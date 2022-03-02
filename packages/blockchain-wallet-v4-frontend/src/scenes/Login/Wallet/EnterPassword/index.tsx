import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap'
import { bindActionCreators } from 'redux'
import { Field } from 'redux-form'
import styled from 'styled-components'

import { HeartbeatLoader, Link, Text } from 'blockchain-info-components'
import { FormError, FormGroup, FormItem, FormLabel, PasswordBox } from 'components/Form'
import { Wrapper } from 'components/Public'
import QRCodeWrapper from 'components/QRCodeWrapper'
import { actions, selectors } from 'data'
import { LoginSteps, ProductAuthOptions } from 'data/types'
import { required } from 'services/forms'
import { isMobile, media } from 'services/styles'

import { Props as OwnProps } from '../..'
import BackArrowHeader from '../../components/BackArrowHeader'
import NeedHelpLink from '../../components/NeedHelpLink'
import ProductTabMenu from '../../components/ProductTabMenu'
import SignupLink from '../../components/SignupLink'
import UnsupportedBrowser from '../../components/UnsupportedBrowser'
import { ActionButton, CenteredColumn, WrapperWithPadding } from '../../model'

const OuterWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 100%;
  ${media.tabletL`
    width: 100%;
    justify-content: center;
    padding: 0;
  `};
`
const SideWrapper = styled.div`
  height: 96%;
  width: 274px;
  ${media.tabletL`
    display: none;
  `};
`
const FormWrapper = styled(Wrapper)`
  display: flex;
  flex-direction: column;
  z-index: 1;
  padding: 0 0 24px 0;
  ${media.mobile`
  padding: 0 0 16px 0;
`}
`
const MobileAuthSideWrapper = styled(Wrapper)`
  position: relative;
  overflow: visible;
  max-width: 240px;
  height: 98%;
  border-radius: 0 8px 8px 0;
  background-color: ${(props) => props.theme.grey000};
  z-index: 0;
  right: 0.5px;
  padding: 40px 16px;
`
const TextColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 12px;
  > div {
    margin-bottom: 8px;
  }
`

const EnterPasswordWallet = (props: Props) => {
  const {
    authActions,
    busy,
    exchangeTabClicked,
    formValues,
    handleBackArrowClickWallet,
    invalid,
    isBrowserSupported,
    qrData,
    submitting,
    walletError
  } = props

  const passwordError = walletError && walletError.toLowerCase().includes('wrong_wallet_password')
  const accountLocked =
    walletError &&
    (walletError.toLowerCase().includes('this account has been locked') ||
      walletError.toLowerCase().includes('account is locked'))

  return (
    <OuterWrapper>
      <SideWrapper />
      <FormWrapper>
        <ProductTabMenu
          active={ProductAuthOptions.WALLET}
          onExchangeTabClick={exchangeTabClicked}
        />
        <WrapperWithPadding>
          <BackArrowHeader
            {...props}
            handleBackArrowClick={handleBackArrowClickWallet}
            marginTop='28px'
          />
          <FormGroup>
            <UnsupportedBrowser isSupportedBrowser={isBrowserSupported} />
            <FormItem>
              <FormLabel htmlFor='password'>
                <FormattedMessage id='scenes.login.your_password' defaultMessage='Your Password' />
              </FormLabel>
              <Field
                autoFocus
                component={PasswordBox}
                data-e2e='loginPassword'
                disabled={!isBrowserSupported}
                name='password'
                placeholder='Enter your password'
                validate={[required]}
              />
              {passwordError && (
                <FormError data-e2e='passwordError' style={{ paddingTop: '5px' }}>
                  <FormattedMessage
                    id='scenes.login.wrong_password_recover'
                    defaultMessage='Wrong password. Do you want to recover your wallet using Secret Private Key Recovery Phrase?'
                  />
                  {'  '}
                  <LinkContainer to='/recover'>
                    <Link size='12px' data-e2e='loginRecover'>
                      <FormattedMessage
                        id='scenes.login.recover_account'
                        defaultMessage='Recover account'
                      />
                      .
                    </Link>
                  </LinkContainer>
                </FormError>
              )}
              {accountLocked && (
                <FormError position='relative'>{walletError?.split('.')[0]}.</FormError>
              )}
            </FormItem>
          </FormGroup>
          <CenteredColumn>
            <ActionButton
              type='submit'
              nature='primary'
              fullwidth
              height='48px'
              disabled={submitting || invalid || busy || !formValues?.password}
              data-e2e='passwordButton'
              style={{ marginBottom: '16px' }}
            >
              {submitting || busy ? (
                <HeartbeatLoader height='20px' width='20px' color='white' />
              ) : (
                <Text color='whiteFade900' size='16px' weight={600}>
                  <FormattedMessage id='scenes.login.login' defaultMessage='Log In' />
                </Text>
              )}
            </ActionButton>
            <NeedHelpLink
              authActions={authActions}
              origin='PASSWORD'
              product={ProductAuthOptions.WALLET}
            />
          </CenteredColumn>
        </WrapperWithPadding>
        <SignupLink />
      </FormWrapper>
      {!isMobile() && (
        <SideWrapper>
          <MobileAuthSideWrapper>
            <TextColumn>
              <QRCodeWrapper value={qrData} size={160} showImage />
              <Text
                color='grey900'
                size='14px'
                weight={600}
                lineHeight='1.25'
                style={{ marginBottom: '8px' }}
              >
                <FormattedMessage
                  id='scenes.login.wallet.mobile_app_login.title'
                  defaultMessage='Log In with Mobile App'
                />
              </Text>
              <Text color='grey900' size='12px' weight={500} lineHeight='1.5'>
                <FormattedMessage
                  id='scenes.login.wallet.mobile_login.description'
                  defaultMessage='Tap the QR code icon at the top right corner of the app.'
                />
              </Text>
              <Text
                color='grey900'
                size='12px'
                weight={500}
                lineHeight='1.5'
                style={{ marginTop: '4px' }}
              >
                <FormattedMessage
                  id='scenes.login.wallet.mobile_login.notification'
                  defaultMessage='Ensure that notifications are enabled for the Blockchain.com app.'
                />
              </Text>
            </TextColumn>
          </MobileAuthSideWrapper>
        </SideWrapper>
      )}
    </OuterWrapper>
  )
}

const mapStateToProps = (state) => ({
  phonePubKey: selectors.cache.getPhonePubkey(state),
  qrData: selectors.cache.getChannelPrivKeyForQrData(state),
  walletLoginData: selectors.auth.getLogin(state)
})

const mapDispatchToProps = (dispatch) => ({
  middlewareActions: bindActionCreators(actions.ws, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(EnterPasswordWallet)
