import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Field } from 'redux-form'
import styled from 'styled-components'

import { HeartbeatLoader, Text } from 'blockchain-info-components'
import FormError from 'components/Form/FormError'
import FormGroup from 'components/Form/FormGroup'
import FormItem from 'components/Form/FormItem'
import FormLabel from 'components/Form/FormLabel'
import PasswordBox from 'components/Form/PasswordBox'
import { Wrapper } from 'components/Public'
import QRCodeWrapper from 'components/QRCodeWrapper'
import { actions, selectors } from 'data'
import { ProductAuthOptions, UnifiedAccountRedirectType } from 'data/types'
import { required } from 'services/forms'
import { isMobile, media } from 'services/styles'

import { Props as OwnProps } from '../..'
import BackArrowHeader from '../../components/BackArrowHeader'
import NeedHelpLink from '../../components/NeedHelpLink'
import ProductTabMenu from '../../components/ProductTabMenu'
import SignupLink from '../../components/SignupLink'
import { ActionButton, CenteredColumn, WrapperWithPadding } from '../../model'

const OuterWrapper = styled.div`
  display: flex;
  flex-direction: column;
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
const MobileAuthWrapper = styled(Wrapper)`
  display: flex;
  position: relative;
  overflow: visible;
  width: 75%;
  border-radius: 8px;
  background-color: ${(props) => props.theme.grey000};
  z-index: 0;
  padding: 16px;
  bottom: 2px;
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
const SettingsGoalText = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  margin: 36px 0 24px;
`

const EnterPasswordWallet = (props: Props) => {
  const {
    busy,
    exchangeTabClicked,
    formValues,
    handleBackArrowClickWallet,
    initialRedirect,
    invalid,
    magicLinkData,
    productAuthMetadata,
    qrData,
    submitting,
    walletError
  } = props

  const passwordError = walletError && walletError.toLowerCase().includes('wrong_wallet_password')
  const accountLocked =
    walletError &&
    (walletError.toLowerCase().includes('this account has been locked') ||
      walletError.toLowerCase().includes('account is locked') ||
      walletError.toLowerCase().includes('account deactivated'))
  const settingsRedirect = Object.values(UnifiedAccountRedirectType).includes(initialRedirect)

  return (
    <OuterWrapper>
      <FormWrapper>
        {!settingsRedirect && (
          <ProductTabMenu
            active={ProductAuthOptions.WALLET}
            onExchangeTabClick={exchangeTabClicked}
          />
        )}
        <WrapperWithPadding>
          {!settingsRedirect && (
            <BackArrowHeader
              {...props}
              handleBackArrowClick={handleBackArrowClickWallet}
              platform={magicLinkData?.platform_type}
              marginTop='28px'
            />
          )}
          {settingsRedirect && (
            <SettingsGoalText>
              <Text size='20px' weight={600} color='grey900' lineHeight='2'>
                <FormattedMessage
                  id='scenes.login.enter_password.setting_goal.title'
                  defaultMessage='Log Into Your Wallet to Continue'
                />
              </Text>
              <Text size='16px' weight={500} color='grey900' lineHeight='1.5'>
                <FormattedMessage
                  id='scenes.login.enter_password.settings_goal.subtitle'
                  defaultMessage='For your security, we ask you to enter your password to continue to update your settings.'
                />
              </Text>
            </SettingsGoalText>
          )}
          <FormGroup>
            <FormItem>
              <FormLabel htmlFor='password'>
                <FormattedMessage id='buttons.password' defaultMessage='Password' />
              </FormLabel>
              <Field
                autoFocus
                component={PasswordBox}
                data-e2e='loginPassword'
                name='password'
                placeholder='Enter Password'
                validate={[required]}
              />
              {passwordError && (
                <FormError data-e2e='passwordError' style={{ paddingTop: '4px' }}>
                  <FormattedMessage
                    id='scenes.login.wrong_password'
                    defaultMessage='Wrong password.'
                  />
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
              origin='PASSWORD'
              platform={productAuthMetadata.platform}
              product={ProductAuthOptions.WALLET}
            />
          </CenteredColumn>
        </WrapperWithPadding>
      </FormWrapper>
      {!isMobile() && (
        <MobileAuthWrapper>
          <QRCodeWrapper value={qrData} size={150} showImage />
          <TextColumn>
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
        </MobileAuthWrapper>
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
