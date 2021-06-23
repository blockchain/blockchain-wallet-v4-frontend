import React from 'react'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'
import styled from 'styled-components'

import { Icon, Link, Text, TextGroup } from 'blockchain-info-components'
import * as C from 'services/alerts'

const Content = styled.div`
  display: flex;
  flex-direction: row;
  flex: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
  box-sizing: border-box;
`
const ContentColumn = styled.div`
  > :last-child {
    line-height: 12px;
    margin-top: 2px;
  }
`
const IconColumn = styled.div`
  margin: 0 10px 0 0;
`

const buildMessageTemplate = (messageText) => (
  <Text
    size='14px'
    weight={600}
    style={{ marginLeft: '10px', wordBreak: 'break-all' }}
    data-e2e='toastMessage'
  >
    {messageText}
  </Text>
)

const getAlertContent = (message, data = undefined) => {
  switch (message) {
    case C.ETH_LOW_BALANCE_WARNING:
      return (
        <Content>
          <IconColumn>
            <Icon size='24px' name='info' color='orange600' />
          </IconColumn>
          <ContentColumn>
            <Text size='14px' weight={600} data-e2e='runningLowMessage'>
              <FormattedMessage
                id='components.alerts.loweth.header'
                defaultMessage='Running Low!'
              />
            </Text>
            <TextGroup inline>
              <Text size='12px' weight={500}>
                <FormattedMessage
                  id='components.alerts.loweth.body1'
                  defaultMessage='Sending USD Digital requires ETH. Your balance is low, Swap to get more ETH.'
                />
              </Text>
              <Text>
                <Link
                  href='https://support.blockchain.com/hc/en-us/sections/360004368351-USD-Pax-FAQ'
                  target='_blank'
                  weight={500}
                  size='12px'
                >
                  <FormattedMessage
                    id='components.alerts.loweth.learnmore'
                    defaultMessage='Learn More.'
                  />
                </Link>
              </Text>
            </TextGroup>
          </ContentColumn>
        </Content>
      )
    case C.ADDRESS_ADD_ERROR:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.addresserroradd'
          defaultMessage='Error adding address.'
        />
      )
    case C.ADDRESS_DELETE_ERROR:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.address_delete_error'
          defaultMessage='Failed to delete address label.'
        />
      )
    case C.ADDRESS_DELETE_SUCCESS:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.address_delete_success'
          defaultMessage='Address deleted successfully.'
        />
      )
    case C.ADDRESS_DOES_NOT_EXIST_ERROR:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.address_does_not_exist_error'
          defaultMessage='This address already exists in your wallet.'
        />
      )
    case C.ADDRESS_FORMAT_NOT_SUPPORTED_ERROR:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.address_format_not_supported_error'
          defaultMessage='This address format is not supported.'
        />
      )
    case C.ADDRESS_LABEL_MAXIMUM_ERROR:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.address_label_maximum_error'
          defaultMessage='You cannot have more than 15 unused addresses. Please send some Bitcoin to at least one of them.'
        />
      )
    case C.AUTHORIZATION_REQUIRED_INFO:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.authorization_required_info'
          defaultMessage='Authorization required. Please check your mailbox.'
        />
      )
    case C.AUTOLOGOUT_UPDATE_ERROR:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.autologout_update_error'
          defaultMessage='Failed to update auto logout'
        />
      )
    case C.AUTOLOGOUT_UPDATE_SUCCESS:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.autologout_update_success'
          defaultMessage='Auto logout has been successfully updated'
        />
      )
    case C.BANK_ACCOUNT_SET_SUCCESS:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.bank_account_set_success'
          defaultMessage='Bank account set successfully'
        />
      )
    case C.BITPAY_INVOICE_NOT_FOUND_ERROR:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.bitpay_not_found'
          defaultMessage='BitPay invoice not found'
        />
      )
    case C.COPY_ADDRESS_CLIPBOARD_SUCCESS:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.copy_address_clipboard_success'
          defaultMessage='{coinName} address successfully copied to clipboard!'
          values={data}
        />
      )
    case C.COPY_LINK_CLIPBOARD_SUCCESS:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.copy_link_clipboard_success'
          defaultMessage='Link successfully copied to clipboard!'
        />
      )
    case C.CURRENCY_UPDATE_ERROR:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.currency_update_error'
          defaultMessage='Failed to update currency'
        />
      )
    case C.CURRENCY_UPDATE_SUCCESS:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.currency_update_success'
          defaultMessage='Currency has been successfully updated'
        />
      )
    case C.DOCUMENT_UPLOAD_ERROR:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.document_upload_error'
          defaultMessage='Failed to upload document.'
        />
      )
    case C.DEAUTHORIZE_BROWSER_SUCCESS:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.deauthorize_browser_success'
          defaultMessage='Browser was successfully deauthorized.'
        />
      )
    case C.DEAUTHORIZE_BROWSER_ERROR:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.deauthorize_browser_error'
          defaultMessage='Failed to deauthorize this browser.'
        />
      )
    case C.EMAIL_CODE_SENT_SUCCESS:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.email_code_sent_success'
          defaultMessage='Confirmation code has been sent.'
        />
      )
    case C.EMAIL_UPDATE_ERROR:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.email_update_error'
          defaultMessage='Failed to update email address.'
        />
      )
    case C.EMAIL_UPDATE_SUCCESS:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.email_update_success'
          defaultMessage='Your email has been updated and your confirmation code has been sent.'
        />
      )
    case C.EMAIL_UPDATE_SUCCESS_LINK:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.email_update_success_link'
          defaultMessage='Your email has been updated and a confirmation email has been sent to the new address.'
        />
      )
    case C.EMAIL_VERIFY_ERROR:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.email_verify_error'
          defaultMessage='Failed to verify email address.'
        />
      )
    case C.EMAIL_VERIFY_SUCCESS:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.email_verify_success'
          defaultMessage='Email address has been successfully verified'
        />
      )
    case C.EXCHANGE_HISTORY_DOWNLOAD_BLOCKED:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.exchange_history_download_blocked'
          defaultMessage='Your Swap transaction report is currently being processed. You will receive an email with your report shortly.'
        />
      )
    case C.EXCHANGE_HISTORY_DOWNLOAD_ERROR:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.exchange_history_download_error'
          defaultMessage='Failed to generate your Swap transaction report. Please try again later or contact support.'
        />
      )
    case C.EXCHANGE_HISTORY_DOWNLOAD_SUCCESS:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.exchange_history_download_success'
          defaultMessage='You will soon receive an email that contains a report of all of your Swap transactions from the past year.'
        />
      )
    case C.EXCHANGE_REFRESH_TRADES_ERROR:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.exchange_refresh_trades_error'
          defaultMessage='Failed to refresh all trades statuses.'
        />
      )
    case C.EXCHANGE_REFRESH_TRADE_ERROR:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.exchange_refresh_trade_error'
          defaultMessage='Failed to refresh trade status.'
        />
      )
    case C.EXCHANGE_TRANSACTION_ERROR:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.exchange_transaction_error'
          defaultMessage='The transaction failed to send. Please try again later.'
        />
      )
    case C.FETCH_USED_ADDRESSES_ERROR:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.fetch_used_addresses_error'
          defaultMessage='Failed to retrieve used addresses.'
        />
      )
    case C.FIRST_PAX_TRADE_INFO:
      return buildMessageTemplate(
        <>
          <Text>
            <FormattedMessage
              id='components.alerts.first_pax_trade_info_dyk'
              defaultMessage='Did you know?'
            />
          </Text>
          <TextGroup inline>
            <Text size='12px' weight={400}>
              <FormattedMessage
                id='components.alerts.first_usdd_trade_info'
                defaultMessage='Now that you own USD Digital, you need to own ETH to Send or Swap.'
              />
            </Text>
            <Link
              href='https://support.blockchain.com/hc/en-us/articles/360027492092-Why-do-I-need-ETH-to-send-my-PAX-'
              target='_blank'
              weight={500}
              size='12px'
            >
              <FormattedMessage id='buttons.learn_more' defaultMessage='Learn More' />
            </Link>
          </TextGroup>
        </>
      )
    case C.FETCH_UNUSED_ADDRESSES_ERROR:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.fetch_unused_addresses_error'
          defaultMessage='Failed to retrieve unused addresses.'
        />
      )
    case C.GET_GOOGLEAUTH_SECRET_ERROR:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.get_googleauth_secret_error'
          defaultMessage='Could not retrieve Google Authenticator secret.'
        />
      )
    case C.GOOGLE_AUTH_VERIFY_ERROR:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.google_auth_verify_error'
          defaultMessage='Failed to verify Google Authenticator code'
        />
      )
    case C.GOOGLE_AUTH_VERIFY_SUCCESS:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.google_auth_verify_success'
          defaultMessage='Google auth verified'
        />
      )
    case C.HINT_UPDATE_ERROR:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.hint_update_error'
          defaultMessage='Failed to update hint'
        />
      )
    case C.HINT_UPDATE_SUCCESS:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.hint_update_success'
          defaultMessage='Hint has been successfully updated'
        />
      )
    case C.IMPORT_LEGACY_SUCCESS:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.import_legacy_success'
          defaultMessage='Address added successfully'
        />
      )
    case C.INCORRECT_BIP38_PASSWORD_ERROR:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.incorrect_bip38_password_error'
          defaultMessage='Incorrect BIP38 password.'
        />
      )
    case C.IPRESTRICTION_LOGIN_ERROR:
      return (
        <ContentColumn>
          <TextGroup inline>
            <Text size='12px' weight={500}>
              <FormattedMessage
                id='components.alerts.iprestriction_login_error'
                defaultMessage='This wallet is restricted to another IP address. To remove this restriction, submit a 2FA reset request under '
              />
            </Text>
            <Text>
              <LinkContainer to='/help'>
                <Link size='12px' weight={500}>
                  <FormattedMessage id='copy.need_some_help' defaultMessage='Need some help?' />
                </Link>
              </LinkContainer>
            </Text>
          </TextGroup>
        </ContentColumn>
      )
    case C.IPRESTRICTION_NO_WHITELIST_ERROR:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.iprestriction_no_whitelist_error'
          defaultMessage='You must add at least one IP address to the whitelist to enable Login IP Restriction'
        />
      )
    case C.IPRESTRICTION_UPDATE_ERROR:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.iprestriction_update_error'
          defaultMessage='Failed to update IP restriction'
        />
      )
    case C.IPRESTRICTION_UPDATE_SUCCESS:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.iprestriction_update_success'
          defaultMessage='IP restriction has been successfully updated'
        />
      )
    case C.IPWHITELIST_UPDATE_ERROR:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.ipwhitelist_update_error'
          defaultMessage='Failed to update IP whitelist'
        />
      )
    case C.IPWHITELIST_UPDATE_SUCCESS:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.ipwhitelist_update_success'
          defaultMessage='IP whitelist has been successfully updated'
        />
      )
    case C.KYC_START_ERROR:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.kyc_start_error'
          defaultMessage='Failed to update a tier. Please try again'
        />
      )
    case C.LANGUAGE_UPDATE_ERROR:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.language_update_error'
          defaultMessage='Failed to update language'
        />
      )
    case C.LANGUAGE_UPDATE_SUCCESS:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.language_update_success'
          defaultMessage='Language has been successfully updated.'
        />
      )
    case C.LOGGINGLEVEL_UPDATE_ERROR:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.logginglevel_update_error'
          defaultMessage='Failed to update logging level'
        />
      )
    case C.LOGGINGLEVEL_UPDATE_SUCCESS:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.logginglevel_update_success'
          defaultMessage='Logging level has been successfully updated'
        />
      )
    case C.LOGIN_ERROR:
      return buildMessageTemplate(
        <FormattedMessage id='components.alerts.login_failed' defaultMessage='Login failed' />
      )

    case C.MESSAGE_SIGN_ERROR:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.message_sign_error'
          defaultMessage='Failed to sign message.'
        />
      )
    case C.MNEMONIC_VERIFY_SUCCESS:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.mnemonic_verify_success_new'
          defaultMessage='Your Secret Private Key Recovery Phrase has been verified!'
        />
      )
    case C.MOBILE_CODE_SENT_ERROR:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.mobile_code_sent_error'
          defaultMessage='Mobile verification code sent'
        />
      )
    case C.MOBILE_CODE_SENT_SUCCESS:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.mobile_code_sent_success'
          defaultMessage='Mobile verification code sent'
        />
      )
    case C.MOBILE_LOGIN_ERROR:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.mobile_login_error'
          defaultMessage='Error logging into your wallet'
        />
      )
    case C.MOBILE_LOGIN_ERROR_QRCODE_EXPIRED:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.mobile_login_error_qrcode_expired'
          defaultMessage='QR code expired'
        />
      )
    case C.MOBILE_LOGIN_SCAN_ERROR:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.mobile_login_scan_error'
          defaultMessage='Could not scan the mobile login QR Code'
        />
      )
    case C.MOBILE_UPDATE_ERROR:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.mobile_update_error'
          defaultMessage='Failed to update mobile number.'
        />
      )
    case C.MOBILE_UPDATE_SUCCESS:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.mobile_update_success'
          defaultMessage='Mobile number has been successfully updated. Verification SMS has been sent.'
        />
      )
    case C.MOBILE_VERIFY_ERROR:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.mobile_verify_error'
          defaultMessage='Failed to verify mobile number'
        />
      )
    case C.MOBILE_VERIFY_SUCCESS:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.mobile_verify_success'
          defaultMessage='Mobile number has been verified'
        />
      )
    case C.NEW_WALLET_CREATE_ERROR:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.new_wallet_create_error'
          defaultMessage='Failed to create new wallet'
        />
      )
    case C.NEW_ADDRESS_GENERATE_ERROR:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.address_generate_error'
          defaultMessage='Failed to generate new address'
        />
      )
    case C.NEW_WALLET_CREATE_SUCCESS:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.new_wallet_create_success'
          defaultMessage='Successfully created new wallet'
        />
      )
    case C.PAYMENT_RECEIVED_BCH:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.payment_bch_received'
          defaultMessage="You've just received a Bitcoin Cash payment"
        />
      )
    case C.PAYMENT_RECEIVED_BTC:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.payment_received_btc'
          defaultMessage="You've just received a Bitcoin payment"
        />
      )
    case C.PAYMENT_RECEIVED_ETH:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.payment_received_eth'
          defaultMessage="You've just received an Ethereum payment"
        />
      )
    case C.PAYMENT_RECEIVED_ETH_PENDING:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.payment_received_eth_pending'
          defaultMessage="You've just received a pending Ethereum payment"
        />
      )
    case C.PAYMENT_RECEIVED_XLM:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.payment_xlm_received'
          defaultMessage="You've just received a Stellar payment"
        />
      )
    case C.PAYMENT_CONFIRMED_SUCCESS:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.paymentconfirmed'
          defaultMessage='Your transaction has been confirmed.'
        />
      )
    case C.PBKDF2_UPDATE_SUCCESS:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.pbkdf2_update_success'
          defaultMessage='PBKDF2 iterations changed successfully'
        />
      )
    case C.PLEASE_LOGIN:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.please_login'
          defaultMessage='Please login to your wallet to proceed'
        />
      )
    case C.PLEASE_TRY_AGAIN:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.pleasetryagain'
          defaultMessage='Something went wrong. Please try again.'
        />
      )
    case C.QR_SCANNER_NOT_ALLOWED:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.qr_scanner_not_allowed'
          defaultMessage='Please enable camera to use this feature'
        />
      )
    case C.RECEIVE_BCH_SUCCESS:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.receive_bch_success'
          defaultMessage='You have received a bitcoin cash payment.'
        />
      )
    case C.RECEIVE_BTC_SUCCESS:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.receive_btc_success'
          defaultMessage='You have received a bitcoin payment.'
        />
      )
    case C.RECEIVE_ETH_SUCCESS:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.receive_eth_success'
          defaultMessage='You have received an ether payment.'
        />
      )
    case C.REGISTER_ERROR:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.register_error'
          defaultMessage='Wallet could not be created'
        />
      )
    case C.REGISTER_SUCCESS:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.register_successful'
          defaultMessage='Wallet successfully created'
        />
      )
    case C.RENAME_BCH_WALLET_ERROR:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.rename_bch_wallet_error'
          defaultMessage='Failed to update Bitcoin Cash account label'
        />
      )
    case C.RENAME_BCH_WALLET_SUCCESS:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.rename_bch_wallet_success'
          defaultMessage='BCH wallet name updated'
        />
      )
    case C.RENAME_BTC_WALLET_SUCCESS:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.rename_btc_wallet_success'
          defaultMessage='BTC wallet name updated'
        />
      )
    case C.RESEND_COIN_SUCCESS:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.resend_coin_success'
          defaultMessage='Your {coinName} transaction has been resent.'
          values={data}
        />
      )
    case C.RESET_TWOFA_INFO:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.reset_twofa_info'
          defaultMessage='Reset two-factor authentication has been successfully submitted.'
        />
      )
    case C.RESTORE_ERROR:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.restore_error'
          defaultMessage='Error restoring your wallet'
        />
      )
    case C.RESTORE_SUCCESS:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.restore_success'
          defaultMessage='Your wallet has been successfully restored'
        />
      )
    case C.RESTORE_WALLET_INFO:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.restore_wallet_info'
          defaultMessage='Restoring wallet...'
        />
      )
    case C.SECOND_PASSWORD_INVALID_ERROR:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.second_password_invalid_error'
          defaultMessage='Wrong second password'
        />
      )
    case C.SECOND_PASSWORD_ENABLED_SUCCESS:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.second_password_enabled_success'
          defaultMessage='Second password enabled'
        />
      )
    case C.SECOND_PASSWORD_DISABLED_SUCCESS:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.second_password_disabled_success'
          defaultMessage='Second password disabled'
        />
      )
    case C.SEND_COIN_SUCCESS:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.send_coin_success'
          defaultMessage='Your {coinName} transaction is now pending!'
          values={data}
        />
      )
    case C.SEND_COIN_CONFIRMED:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.send_coin_confirmed'
          defaultMessage='Your {coinName} transaction is now confirmed!'
          values={data}
        />
      )
    case C.SEND_COIN_ERROR:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.send_coin_error'
          defaultMessage='Your {coinName} transaction failed to send. Please try again.'
          values={data}
        />
      )
    case C.SMS_RESEND_ERROR:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.sms_resend_error'
          defaultMessage='Error sending SMS verification code.'
        />
      )
    case C.SMS_RESEND_SUCCESS:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.sms_resend_success'
          defaultMessage='A new SMS verification code has been sent to your phone.'
        />
      )
    case C.SWEEP_ERROR:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.sweep_error'
          defaultMessage='Could not sweep address'
        />
      )
    case C.SWEEP_ERROR_EMPTY_ADDRESS:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.sweep_error_empty_address'
          defaultMessage='The imported address does not have funds'
        />
      )
    case C.SWEEP_SUCCESS:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.sweep_success'
          defaultMessage='Swept address funds to {label}'
          values={data}
        />
      )
    case C.TOR_UPDATE_ERROR:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.tor_update_error'
          defaultMessage='Failed to update TOR blocking'
        />
      )
    case C.TOR_UPDATE_SUCCESS:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.tor_update_success'
          defaultMessage='TOR blocking has been successfully updated'
        />
      )
    case C.TWOFA_GOOGLEAUTH_ENABLE_ERROR:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.googleauth_enable_error'
          defaultMessage='Failed to update Google Authenticator 2FA'
        />
      )
    case C.TWOFA_GOOGLEAUTH_ENABLE_SUCCESS:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.googleauth_enable_success'
          defaultMessage='2FA (Google Authenticator) has been successfully enabled'
        />
      )
    case C.TWOFA_MOBILE_ENABLE_ERROR:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.twofa_mobile_enable_error'
          defaultMessage='Failed to update mobile 2FA'
        />
      )
    case C.TWOFA_MOBILE_ENABLE_SUCCESS:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.twofa_mobile_enable_success'
          defaultMessage='2FA (Mobile) has been successfully enabled'
        />
      )
    case C.TWOFA_MOBILE_SET_ERROR:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.twofa_mobile_set_error'
          defaultMessage='SMS has been successfully verified as two factor auth method'
        />
      )
    case C.TWOFA_MOBILE_SET_SUCCESS:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.twofa_mobile_set_success'
          defaultMessage='SMS has been successfully verified as two factor auth method'
        />
      )
    case C.TWOFA_MOBILE_VERIFY_ERROR:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.twofa_mobile_verify_error'
          defaultMessage='Failed to verify mobile number.'
        />
      )
    case C.TWOFA_MOBILE_VERIFY_SUCCESS:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.twofa_mobile_verify_success'
          defaultMessage='Your mobile number is now your two-factor authentication method.'
        />
      )
    case C.TWOFA_REMEMBER_UPDATE_ERROR:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.twofa_remember_update_error'
          defaultMessage='Failed to update 2FA remember'
        />
      )
    case C.TWOFA_REMEMBER_UPDATE_SUCCESS:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.twofa_remember_update_success'
          defaultMessage='2FA remember has been successfully updated.'
        />
      )
    case C.TWOFA_REQUIRED_INFO:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.twofa_required_info'
          defaultMessage='2FA required for login.'
        />
      )
    case C.TWOFA_UPDATE_ERROR:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.twofa_success_error'
          defaultMessage='Failed to update 2FA setting'
        />
      )
    case C.TWOFA_UPDATE_SUCCESS:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.twofa_update_success'
          defaultMessage='2FA has been successfully updated'
        />
      )
    case C.TWOFA_YUBIKEY_ENABLE_ERROR:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.yubikey_enable_error'
          defaultMessage='Failed to update Yubikey 2FA'
        />
      )
    case C.TWOFA_YUBIKEY_ENABLE_SUCCESS:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.yubikey_enable_success'
          defaultMessage='2FA (Yubikey) has been successfully enabled'
        />
      )
    case C.UPDATE_ADDRESS_LABEL_SUCCESS:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.update_address_label_success'
          defaultMessage='Address label updated.'
        />
      )
    case C.UPDATE_ADDRESS_LABEL_ERROR:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.update_address_label_error'
          defaultMessage='Failed to update address label.'
        />
      )
    case C.UPDATE_IMPORTED_ADDRESS_LABEL_SUCCESS:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.update_imported_address_label_success'
          defaultMessage='Address label updated'
        />
      )
    case C.UPDATE_IMPORTED_ADDRESS_LABEL_ERROR:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.update_imported_address_label_error'
          defaultMessage='Failed to update imported address label'
        />
      )
    case C.VERIFY_EMAIL_SENT:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.verify_email_sent'
          defaultMessage='Verification email sent. Please check your email.'
        />
      )
    case C.VERIFY_EMAIL_SENT_ERROR:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.verify_email_sent_error'
          defaultMessage='Error sending verification email. Please try again later.'
        />
      )
    case C.WALLET_LOADING_ERROR:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.wallet_loading_error'
          defaultMessage='Could not retrieve essential data. Try again later.'
        />
      )
    case C.WALLET_SESSION_ERROR:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.wallet_session_error'
          defaultMessage='Error establishing the session'
        />
      )
    case C.WALLET_UPGRADE_ERROR:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.wallet_upgrade_error'
          defaultMessage='Failed to upgrade to HD and save wallet.'
        />
      )
    case C.YUBIKEY_VERIFY_ERROR:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.yubikey_verify_error'
          defaultMessage='Failed to verify Yubikey'
        />
      )
    case C.YUBIKEY_VERIFY_SUCCESS:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.yubikey_verify_success'
          defaultMessage='Yubikey verified'
        />
      )
    case C.BTC_ADDRESS_INVALID:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.btc_address_incorrect'
          defaultMessage='Invalid Bitcoin Address.'
        />
      )
    case C.BCH_ADDRESS_INVALID:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.bch_address_incorrect'
          defaultMessage='Invalid Bitcoin Cash Address.'
        />
      )
    case C.ETH_ADDRESS_INVALID:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.ethereum_address_incorrect'
          defaultMessage='Invalid Ethereum Address.'
        />
      )
    case C.XLM_ADDRESS_INVALID:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.xlm_address_incorrect'
          defaultMessage='Invalid Stellar Address.'
        />
      )
    case C.PRIVATE_KEY_INVALID:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.private_key_incorrect'
          defaultMessage='Invalid Private Key.'
        />
      )
    case C.BTC_ADDRESS_AND_PRIVATE_KEY_INVALID:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.address_and_private_key_incorrect'
          defaultMessage='Not a valid Bitcoin Private Key or Address.'
        />
      )
    case C.LOCKBOX_SETUP_SUCCESS:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.success_lockbox_setup'
          defaultMessage='Successfully setup your {deviceType}.'
          values={data}
        />
      )
    case C.LOCKBOX_SETUP_ERROR:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.error_lockbox_setup'
          defaultMessage='Failed to setup your {deviceType}.'
          values={data}
        />
      )
    case C.LOCKBOX_UPDATE_SUCCESS:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.lockbox_update_success'
          defaultMessage='Lockbox settings successfully updated.'
        />
      )
    case C.LOCKBOX_UPDATE_ERROR:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.lockbox_update_error'
          defaultMessage='Failed to update Lockbox settings.'
        />
      )
    case C.LOCKBOX_DELETE_SUCCESS:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.lockbox_delete_success'
          defaultMessage='Lockbox successfully deleted.'
        />
      )
    case C.LOCKBOX_DELETE_ERROR:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.lockbox_delete_error'
          defaultMessage='Failed to remove Lockbox.'
        />
      )
    case C.LOCKED_WITHDRAW_ERROR:
      return buildMessageTemplate(
        data === 0 || data === 1 ? (
          <FormattedMessage
            id='modals.withdraw.tooltip_info_day'
            defaultMessage='The remaining balance will be available to be withdrawn within 1 day.'
          />
        ) : (
          <FormattedMessage
            id='copy.error.locked_withdraw_error'
            defaultMessage='Your crypto will be available to be withdrawn within {days} days.'
            values={data}
          />
        )
      )
    case C.KYC_RESET_ERROR:
      return buildMessageTemplate(
        <FormattedMessage
          id='components.alerts.kyc_reset_error'
          defaultMessage='Restoring account failed. Please try again.'
        />
      )
    default:
      return buildMessageTemplate(
        message || (
          <FormattedMessage
            id='components.alerts.unknown_error'
            defaultMessage='An error has occurred.'
          />
        )
      )
  }
}

export default getAlertContent
