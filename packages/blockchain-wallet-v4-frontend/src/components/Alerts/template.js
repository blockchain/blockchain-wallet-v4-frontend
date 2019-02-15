import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Toast } from 'blockchain-info-components'
import * as C from 'services/AlertService'

const Wrapper = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 100%;
  display: flex;
  flex-direction: column-reverse;
  justify-content: flex-start;
  align-items: flex-start;
  z-index: 1050;

  & > * {
    margin-top: 5px;
  }

  @media (min-width: 768px) {
    bottom: 5px;
    right: 5px;
    width: auto;
  }
`

const selectHeader = nature => {
  switch (nature) {
    case 'info':
      return (
        <FormattedMessage id='components.alerts.alert' defaultMessage='Alert' />
      )
    case 'success':
      return (
        <FormattedMessage
          id='components.alerts.success'
          defaultMessage='Success'
        />
      )
    case 'error':
      return (
        <FormattedMessage id='components.alerts.error' defaultMessage='Error' />
      )
    default:
      return (
        <FormattedMessage
          id='components.alerts.default'
          defaultMessage='Alert'
        />
      )
  }
}

const selectMessage = (message, data = undefined) => {
  switch (message) {
    case C.ADDRESS_ADD_ERROR:
      return (
        <FormattedMessage
          id='components.alerts.addresserroradd'
          defaultMessage='Error adding address.'
        />
      )
    case C.ADDRESS_DELETE_ERROR:
      return (
        <FormattedMessage
          id='components.alerts.address_delete_error'
          defaultMessage='Failed to delete address label.'
        />
      )
    case C.ADDRESS_DELETE_SUCCESS:
      return (
        <FormattedMessage
          id='components.alerts.address_delete_success'
          defaultMessage='Address deleted successfully.'
        />
      )
    case C.ADDRESS_DOES_NOT_EXIST_ERROR:
      return (
        <FormattedMessage
          id='components.alerts.address_does_not_exist_error'
          defaultMessage='This address already exists in your wallet.'
        />
      )
    case C.ADDRESS_FORMAT_NOT_SUPPORTED_ERROR:
      return (
        <FormattedMessage
          id='components.alerts.address_format_not_supported_error'
          defaultMessage='This address format is not supported.'
        />
      )
    case C.ADDRESS_LABEL_MAXIMUM_ERROR:
      return (
        <FormattedMessage
          id='components.alerts.address_label_maximum_error'
          defaultMessage='You cannot have more than 15 unused addresses. Please send some Bitcoin to at least one of them.'
        />
      )
    case C.AUTHORIZATION_REQUIRED_INFO:
      return (
        <FormattedMessage
          id='components.alerts.authorization_required_info'
          defaultMessage='Authorization required. Please check your mailbox.'
        />
      )
    case C.AUTOLOGOUT_UPDATE_ERROR:
      return (
        <FormattedMessage
          id='components.alerts.autologout_update_error'
          defaultMessage='Failed to update auto logout'
        />
      )
    case C.AUTOLOGOUT_UPDATE_SUCCESS:
      return (
        <FormattedMessage
          id='components.alerts.autologout_update_success'
          defaultMessage='Auto logout has been successfully updated'
        />
      )
    case C.BANK_ACCOUNT_SET_SUCCESS:
      return (
        <FormattedMessage
          id='components.alerts.bank_account_set_success'
          defaultMessage='Bank account set successfully'
        />
      )
    case C.COINIFY_SIGNUP_ERROR:
      return (
        <FormattedMessage
          id='components.alerts.coinify_signup_error'
          defaultMessage='Failed to create Coinify account.'
        />
      )
    case C.CREATE_WALLET_INFO:
      return (
        <FormattedMessage
          id='components.alerts.create_wallet_info'
          defaultMessage='Creating wallet...'
        />
      )
    case C.CURRENCY_UPDATE_ERROR:
      return (
        <FormattedMessage
          id='components.alerts.currency_update_error'
          defaultMessage='Failed to update currency'
        />
      )
    case C.CURRENCY_UPDATE_SUCCESS:
      return (
        <FormattedMessage
          id='components.alerts.currency_update_success'
          defaultMessage='Currency has been successfully updated'
        />
      )
    case C.DOCUMENT_UPLOAD_ERROR:
      return (
        <FormattedMessage
          id='components.alerts.document_upload_error'
          defaultMessage='Failed to upload document.'
        />
      )
    case C.DEAUTHORIZE_BROWSER_SUCCESS:
      return (
        <FormattedMessage
          id='components.alerts.deauthorize_browser_success'
          defaultMessage='Browser was successfully deauthorized.'
        />
      )
    case C.DEAUTHORIZE_BROWSER_ERROR:
      return (
        <FormattedMessage
          id='components.alerts.deauthorize_browser_error'
          defaultMessage='Failed to deauthorize this browser.'
        />
      )
    case C.EMAIL_CODE_SENT_SUCCESS:
      return (
        <FormattedMessage
          id='components.alerts.email_code_sent_success'
          defaultMessage='Confirmation code has been sent.'
        />
      )
    case C.EMAIL_UPDATE_ERROR:
      return (
        <FormattedMessage
          id='components.alerts.email_update_error'
          defaultMessage='Failed to update email address.'
        />
      )
    case C.EMAIL_UPDATE_SUCCESS:
      return (
        <FormattedMessage
          id='components.alerts.email_update_success'
          defaultMessage='Your email has been updated and your confirmation code has been sent.'
        />
      )
    case C.EMAIL_UPDATE_SUCCESS_LINK:
      return (
        <FormattedMessage
          id='components.alerts.email_update_success_link'
          defaultMessage='Your email has been updated and a confirmation email has been sent to the new address.'
        />
      )
    case C.EMAIL_VERIFY_ERROR:
      return (
        <FormattedMessage
          id='components.alerts.email_verify_error'
          defaultMessage='Failed to verify email address.'
        />
      )
    case C.EMAIL_VERIFY_SUCCESS:
      return (
        <FormattedMessage
          id='components.alerts.email_verify_success'
          defaultMessage='Email address has been successfully verified'
        />
      )
    case C.EXCHANGE_REFRESH_TRADES_ERROR:
      return (
        <FormattedMessage
          id='components.alerts.exchange_refresh_trades_error'
          defaultMessage='Failed to refresh all trades statuses.'
        />
      )
    case C.EXCHANGE_REFRESH_TRADE_ERROR:
      return (
        <FormattedMessage
          id='components.alerts.exchange_refresh_trade_error'
          defaultMessage='Failed to refresh trade status.'
        />
      )
    case C.EXCHANGE_TRANSACTION_ERROR:
      return (
        <FormattedMessage
          id='components.alerts.exchange_transaction_error'
          defaultMessage='The transaction failed to send. Please try again later.'
        />
      )
    case C.FETCH_USED_ADDRESSES_ERROR:
      return (
        <FormattedMessage
          id='components.alerts.fetch_used_addresses_error'
          defaultMessage='Failed to retrieve used addresses.'
        />
      )
    case C.FETCH_UNUSED_ADDRESSES_ERROR:
      return (
        <FormattedMessage
          id='components.alerts.fetch_unused_addresses_error'
          defaultMessage='Failed to retrieve unused addresses.'
        />
      )
    case C.GET_GOOGLEAUTH_SECRET_ERROR:
      return (
        <FormattedMessage
          id='components.alerts.get_googleauth_secret_error'
          defaultMessage='Could not retrieve Google Authenticator secret.'
        />
      )
    case C.GOOGLE_AUTH_VERIFY_ERROR:
      return (
        <FormattedMessage
          id='components.alerts.google_auth_verify_error'
          defaultMessage='Failed to verify Google Authenticator code'
        />
      )
    case C.GOOGLE_AUTH_VERIFY_SUCCESS:
      return (
        <FormattedMessage
          id='components.alerts.google_auth_verify_success'
          defaultMessage='Google auth verified'
        />
      )
    case C.GUID_SENT_ERROR:
      return (
        <FormattedMessage
          id='components.alerts.guid_sent_error'
          defaultMessage='Wallet guid could not be sent to your email address'
        />
      )
    case C.GUID_SENT_SUCCESS:
      return (
        <FormattedMessage
          id='components.alerts.guid_sent_success'
          defaultMessage='Your wallet ID has been sent to your email address'
        />
      )
    case C.HINT_UPDATE_ERROR:
      return (
        <FormattedMessage
          id='components.alerts.hint_update_error'
          defaultMessage='Failed to update hint'
        />
      )
    case C.HINT_UPDATE_SUCCESS:
      return (
        <FormattedMessage
          id='components.alerts.hint_update_success'
          defaultMessage='Hint has been successfully updated'
        />
      )
    case C.IMPORT_LEGACY_SUCCESS:
      return (
        <FormattedMessage
          id='components.alerts.import_legacy_success'
          defaultMessage='Address added successfully'
        />
      )
    case C.INCORRECT_BIP38_PASSWORD_ERROR:
      return (
        <FormattedMessage
          id='components.alerts.incorrect_bip38_password_error'
          defaultMessage='Incorrect BIP38 password.'
        />
      )
    case C.IPRESTRICTION_NO_WHITELIST_ERROR:
      return (
        <FormattedMessage
          id='components.alerts.iprestriction_no_whitelist_error'
          defaultMessage='You must add at least one IP address to the whitelist to enable Login IP Restriction'
        />
      )
    case C.IPRESTRICTION_UPDATE_ERROR:
      return (
        <FormattedMessage
          id='components.alerts.iprestriction_update_error'
          defaultMessage='Failed to update IP restriction'
        />
      )
    case C.IPRESTRICTION_UPDATE_SUCCESS:
      return (
        <FormattedMessage
          id='components.alerts.iprestriction_update_success'
          defaultMessage='IP restriction has been successfully updated'
        />
      )
    case C.IPWHITELIST_UPDATE_ERROR:
      return (
        <FormattedMessage
          id='components.alerts.ipwhitelist_update_error'
          defaultMessage='Failed to update IP whitelist'
        />
      )
    case C.IPWHITELIST_UPDATE_SUCCESS:
      return (
        <FormattedMessage
          id='components.alerts.ipwhitelist_update_success'
          defaultMessage='IP whitelist has been successfully updated'
        />
      )
    case C.KYC_START_ERROR:
      return (
        <FormattedMessage
          id='components.alerts.kyc_start_error'
          defaultMessage='Failed to update a tier. Please try again'
        />
      )
    case C.LANGUAGE_UPDATE_ERROR:
      return (
        <FormattedMessage
          id='components.alerts.language_update_error'
          defaultMessage='Failed to update language'
        />
      )
    case C.LANGUAGE_UPDATE_SUCCESS:
      return (
        <FormattedMessage
          id='components.alerts.language_update_success'
          defaultMessage='Language has been successfully updated.'
        />
      )
    case C.LOGGINGLEVEL_UPDATE_ERROR:
      return (
        <FormattedMessage
          id='components.alerts.logginglevel_update_error'
          defaultMessage='Failed to update logging level'
        />
      )
    case C.LOGGINGLEVEL_UPDATE_SUCCESS:
      return (
        <FormattedMessage
          id='components.alerts.logginglevel_update_success'
          defaultMessage='Logging level has been successfully updated'
        />
      )
    case C.LOGIN_ERROR:
      return (
        <FormattedMessage
          id='components.alerts.login_failed'
          defaultMessage='Login failed'
        />
      )
    case C.LOGIN_SUCCESS:
      return (
        <FormattedMessage
          id='components.alerts.login_successful'
          defaultMessage='Login successful'
        />
      )
    case C.MESSAGE_SIGN_ERROR:
      return (
        <FormattedMessage
          id='components.alerts.message_sign_error'
          defaultMessage='Failed to sign message.'
        />
      )
    case C.MNEMONIC_VERIFY_SUCCESS:
      return (
        <FormattedMessage
          id='components.alerts.mnemonic_verify_success'
          defaultMessage='Your backup phrase has been verified!'
        />
      )
    case C.MOBILE_CODE_SENT_ERROR:
      return (
        <FormattedMessage
          id='components.alerts.mobile_code_sent_error'
          defaultMessage='Mobile verification code sent'
        />
      )
    case C.MOBILE_CODE_SENT_SUCCESS:
      return (
        <FormattedMessage
          id='components.alerts.mobile_code_sent_success'
          defaultMessage='Mobile verification code sent'
        />
      )
    case C.MOBILE_LOGIN_ERROR:
      return (
        <FormattedMessage
          id='components.alerts.mobile_login_error'
          defaultMessage='Error logging into your wallet'
        />
      )
    case C.MOBILE_LOGIN_ERROR_QRCODE_EXPIRED:
      return (
        <FormattedMessage
          id='components.alerts.mobile_login_error_qrcode_expired'
          defaultMessage='QR code expired'
        />
      )
    case C.MOBILE_LOGIN_SCAN_ERROR:
      return (
        <FormattedMessage
          id='components.alerts.mobile_login_scan_error'
          defaultMessage='Could not scan the mobile login QR Code'
        />
      )
    case C.MOBILE_UPDATE_ERROR:
      return (
        <FormattedMessage
          id='components.alerts.mobile_update_error'
          defaultMessage='Failed to update mobile number.'
        />
      )
    case C.MOBILE_UPDATE_SUCCESS:
      return (
        <FormattedMessage
          id='components.alerts.mobile_update_success'
          defaultMessage='Mobile number has been successfully updated. Verification SMS has been sent.'
        />
      )
    case C.MOBILE_VERIFY_ERROR:
      return (
        <FormattedMessage
          id='components.alerts.mobile_verify_error'
          defaultMessage='Failed to verify mobile number'
        />
      )
    case C.MOBILE_VERIFY_SUCCESS:
      return (
        <FormattedMessage
          id='components.alerts.mobile_verify_success'
          defaultMessage='Mobile number has been verified'
        />
      )
    case C.NEW_WALLET_CREATE_ERROR:
      return (
        <FormattedMessage
          id='components.alerts.new_wallet_create_error'
          defaultMessage='Failed to create new wallet'
        />
      )
    case C.NEW_ADDRESS_GENERATE_ERROR:
      return (
        <FormattedMessage
          id='components.alerts.new_address_generate_error'
          defaultMessage='Failed to generate new address.'
        />
      )
    case C.NEW_WALLET_CREATE_SUCCESS:
      return (
        <FormattedMessage
          id='components.alerts.new_wallet_create_success'
          defaultMessage='Successfully created new wallet'
        />
      )
    case C.PAYMENT_RECEIVED_BCH:
      return (
        <FormattedMessage
          id='components.alerts.payment_received_bch'
          defaultMessage="You've just received a Bitcoin cash payment"
        />
      )
    case C.PAYMENT_RECEIVED_BTC:
      return (
        <FormattedMessage
          id='components.alerts.payment_received_btc'
          defaultMessage="You've just received a Bitcoin payment"
        />
      )
    case C.PAYMENT_RECEIVED_ETH:
      return (
        <FormattedMessage
          id='components.alerts.payment_received_eth'
          defaultMessage="You've just received an Ethereum payment"
        />
      )
    case C.PAYMENT_RECEIVED_XLM:
      return (
        <FormattedMessage
          id='components.alerts.payment_received_xlm'
          defaultMessage="You've just received a stellar payment"
        />
      )
    case C.PBKDF2_UPDATE_SUCCESS:
      return (
        <FormattedMessage
          id='components.alerts.pbkdf2_update_success'
          defaultMessage='PBKDF2 iterations changed successfully'
        />
      )
    case C.PLEASE_LOGIN:
      return (
        <FormattedMessage
          id='components.alerts.please_login'
          defaultMessage='Please login to your wallet to proceed'
        />
      )
    case C.QR_SCANNER_NOT_ALLOWED:
      return (
        <FormattedMessage
          id='components.alerts.qr_scanner_not_allowed'
          defaultMessage='Please enable camera to use this feature'
        />
      )
    case C.RECEIVE_BCH_SUCCESS:
      return (
        <FormattedMessage
          id='components.alerts.receive_bch_success'
          defaultMessage='You have received a bitcoin cash payment.'
        />
      )
    case C.RECEIVE_BTC_SUCCESS:
      return (
        <FormattedMessage
          id='components.alerts.receive_btc_success'
          defaultMessage='You have received a bitcoin payment.'
        />
      )
    case C.RECEIVE_ETH_SUCCESS:
      return (
        <FormattedMessage
          id='components.alerts.receive_eth_success'
          defaultMessage='You have received an ether payment.'
        />
      )
    case C.REGISTER_ERROR:
      return (
        <FormattedMessage
          id='components.alerts.register_error'
          defaultMessage='Wallet could not be created'
        />
      )
    case C.REGISTER_SUCCESS:
      return (
        <FormattedMessage
          id='components.alerts.register_successful'
          defaultMessage='Wallet successfully created'
        />
      )
    case C.RENAME_BCH_WALLET_ERROR:
      return (
        <FormattedMessage
          id='components.alerts.rename_bch_wallet_error'
          defaultMessage='Failed to update Bitcoin Cash account label'
        />
      )
    case C.RENAME_BCH_WALLET_SUCCESS:
      return (
        <FormattedMessage
          id='components.alerts.rename_bch_wallet_success'
          defaultMessage='BCH wallet name updated'
        />
      )
    case C.RENAME_BTC_WALLET_SUCCESS:
      return (
        <FormattedMessage
          id='components.alerts.rename_btc_wallet_success'
          defaultMessage='BTC wallet name updated'
        />
      )
    case C.RESET_TWOFA_INFO:
      return (
        <FormattedMessage
          id='components.alerts.reset_twofa_info'
          defaultMessage='Reset two-factor authentication has been successfully submitted.'
        />
      )
    case C.RESTORE_ERROR:
      return (
        <FormattedMessage
          id='components.alerts.restore_error'
          defaultMessage='Error restoring your wallet'
        />
      )
    case C.RESTORE_SUCCESS:
      return (
        <FormattedMessage
          id='components.alerts.restore_success'
          defaultMessage='Your wallet has been successfully restored'
        />
      )
    case C.RESTORE_WALLET_INFO:
      return (
        <FormattedMessage
          id='components.alerts.restore_wallet_info'
          defaultMessage='Restoring wallet...'
        />
      )
    case C.SECOND_PASSWORD_INVALID_ERROR:
      return (
        <FormattedMessage
          id='components.alerts.second_password_invalid_error'
          defaultMessage='Wrong second password'
        />
      )
    case C.SECOND_PASSWORD_ENABLED_SUCCESS:
      return (
        <FormattedMessage
          id='components.alerts.second_password_enabled_success'
          defaultMessage='Second password successfully enabled'
        />
      )
    case C.SECOND_PASSWORD_DISABLED_SUCCESS:
      return (
        <FormattedMessage
          id='components.alerts.second_password_disabled_success'
          defaultMessage='Second password successfully disabled'
        />
      )
    case C.SEND_BCH_ERROR:
      return (
        <FormattedMessage
          id='components.alerts.send_bch_error'
          defaultMessage='Your bitcoin cash transaction failed to send. Please try again.'
        />
      )
    case C.SEND_BCH_SUCCESS:
      return (
        <FormattedMessage
          id='components.alerts.send_bch_success'
          defaultMessage='Your bitcoin cash transaction is now pending'
        />
      )
    case C.SEND_BSV_ERROR:
      return (
        <FormattedMessage
          id='components.alerts.send_bsv_error'
          defaultMessage='Your Bitcoin SV transaction failed to send. Please try again.'
        />
      )
    case C.SEND_BSV_SUCCESS:
      return (
        <FormattedMessage
          id='components.alerts.send_bsv_success'
          defaultMessage='Your Bitcoin SV transaction is now pending'
        />
      )
    case C.SEND_BTC_ERROR:
      return (
        <FormattedMessage
          id='components.alerts.send_btc_error'
          defaultMessage='Your bitcoin transaction failed to send. Please try again.'
        />
      )
    case C.SEND_BTC_SUCCESS:
      return (
        <FormattedMessage
          id='components.alerts.send_btc_success'
          defaultMessage='Your bitcoin transaction is now pending'
        />
      )
    case C.SEND_ETH_ERROR:
      return (
        <FormattedMessage
          id='components.alerts.send_eth_error'
          defaultMessage='Your ether transaction failed to send. Please try again.'
        />
      )
    case C.SEND_ETH_SUCCESS:
      return (
        <FormattedMessage
          id='components.alerts.send_eth_success'
          defaultMessage='Your ether transaction is now pending'
        />
      )
    case C.SEND_XLM_ERROR:
      return (
        <FormattedMessage
          id='components.alerts.send_xlm_error'
          defaultMessage='Your stellar transaction failed to send. Please try again.'
        />
      )
    case C.SEND_XLM_SUCCESS:
      return (
        <FormattedMessage
          id='components.alerts.send_xlm_success'
          defaultMessage='Your stellar transaction is now pending'
        />
      )
    case C.SMS_RESEND_ERROR:
      return (
        <FormattedMessage
          id='components.alerts.sms_resend_error'
          defaultMessage='Error sending SMS verification code.'
        />
      )
    case C.SMS_RESEND_SUCCESS:
      return (
        <FormattedMessage
          id='components.alerts.sms_resend_success'
          defaultMessage='A new SMS verification code has been sent to your phone.'
        />
      )
    case C.SWEEP_ERROR:
      return (
        <FormattedMessage
          id='components.alerts.sweep_error'
          defaultMessage='Could not sweep address'
        />
      )
    case C.SWEEP_ERROR_EMPTY_ADDRESS:
      return (
        <FormattedMessage
          id='components.alerts.sweep_error_empty_address'
          defaultMessage='The imported address does not have funds'
        />
      )
    case C.SWEEP_SUCCESS:
      return (
        <FormattedMessage
          id='components.alerts.sweep_success'
          defaultMessage='Swept address funds to {label}'
          values={data}
        />
      )
    case C.TOR_UPDATE_ERROR:
      return (
        <FormattedMessage
          id='components.alerts.tor_update_error'
          defaultMessage='Failed to update TOR blocking'
        />
      )
    case C.TOR_UPDATE_SUCCESS:
      return (
        <FormattedMessage
          id='components.alerts.tor_update_success'
          defaultMessage='TOR blocking has been successfully updated'
        />
      )
    case C.TWOFA_GOOGLEAUTH_ENABLE_ERROR:
      return (
        <FormattedMessage
          id='components.alerts.googleauth_enable_error'
          defaultMessage='Failed to update Google Authenticator 2FA'
        />
      )
    case C.TWOFA_GOOGLEAUTH_ENABLE_SUCCESS:
      return (
        <FormattedMessage
          id='components.alerts.googleauth_enable_success'
          defaultMessage='2FA (Google Authenticator) has been successfully enabled'
        />
      )
    case C.TWOFA_MOBILE_ENABLE_ERROR:
      return (
        <FormattedMessage
          id='components.alerts.twofa_mobile_enable_error'
          defaultMessage='Failed to update mobile 2FA'
        />
      )
    case C.TWOFA_MOBILE_ENABLE_SUCCESS:
      return (
        <FormattedMessage
          id='components.alerts.twofa_mobile_enable_success'
          defaultMessage='2FA (Mobile) has been successfully enabled'
        />
      )
    case C.TWOFA_MOBILE_SET_ERROR:
      return (
        <FormattedMessage
          id='components.alerts.twofa_mobile_set_error'
          defaultMessage='SMS has been successfully verified as two factor auth method'
        />
      )
    case C.TWOFA_MOBILE_SET_SUCCESS:
      return (
        <FormattedMessage
          id='components.alerts.twofa_mobile_set_success'
          defaultMessage='SMS has been successfully verified as two factor auth method'
        />
      )
    case C.TWOFA_MOBILE_VERIFY_ERROR:
      return (
        <FormattedMessage
          id='components.alerts.twofa_mobile_verify_error'
          defaultMessage='Failed to verify mobile number.'
        />
      )
    case C.TWOFA_MOBILE_VERIFY_SUCCESS:
      return (
        <FormattedMessage
          id='components.alerts.twofa_mobile_verify_success'
          defaultMessage='Your mobile number is now your two-factor authentication method.'
        />
      )
    case C.TWOFA_REMEMBER_UPDATE_ERROR:
      return (
        <FormattedMessage
          id='components.alerts.twofa_remember_update_error'
          defaultMessage='Failed to update 2FA remember'
        />
      )
    case C.TWOFA_REMEMBER_UPDATE_SUCCESS:
      return (
        <FormattedMessage
          id='components.alerts.twofa_remember_update_success'
          defaultMessage='2FA remember has been successfully updated.'
        />
      )
    case C.TWOFA_REQUIRED_INFO:
      return (
        <FormattedMessage
          id='components.alerts.twofa_required_info'
          defaultMessage='2FA required for login.'
        />
      )
    case C.TWOFA_RESET_UNKNOWN_GUID_ERROR:
      return (
        <FormattedMessage
          id='components.alerts.twofa_reset_unknown_guid_error'
          defaultMessage='Unknown Wallet ID.'
        />
      )
    case C.TWOFA_RESET_ERROR:
      return (
        <FormattedMessage
          id='components.alerts.twofa_reset_error'
          defaultMessage='Error resetting two-step authentication.'
        />
      )
    case C.TWOFA_RESET_NOT_ENABLED_ERROR:
      return (
        <FormattedMessage
          id='components.alerts.twofa_reset_not_enabled_error'
          defaultMessage='2FA has not been enabled for this wallet.'
        />
      )
    case C.TWOFA_RESET_EMAIL_ERROR:
      return (
        <FormattedMessage
          id='components.alerts.twofa_reset_email_error'
          defaultMessage='Email does not match the email address associated with this wallet.'
        />
      )
    case C.TWOFA_UPDATE_ERROR:
      return (
        <FormattedMessage
          id='components.alerts.twofa_success_error'
          defaultMessage='Failed to update 2FA setting'
        />
      )
    case C.TWOFA_UPDATE_SUCCESS:
      return (
        <FormattedMessage
          id='components.alerts.twofa_update_success'
          defaultMessage='2FA has been successfully updated'
        />
      )
    case C.TWOFA_YUBIKEY_ENABLE_ERROR:
      return (
        <FormattedMessage
          id='components.alerts.yubikey_enable_error'
          defaultMessage='Failed to update Yubikey 2FA'
        />
      )
    case C.TWOFA_YUBIKEY_ENABLE_SUCCESS:
      return (
        <FormattedMessage
          id='components.alerts.yubikey_enable_success'
          defaultMessage='2FA (Yubikey) has been successfully enabled'
        />
      )
    case C.UPDATE_ADDRESS_LABEL_SUCCESS:
      return (
        <FormattedMessage
          id='components.alerts.update_address_label_success'
          defaultMessage='Address label updated.'
        />
      )
    case C.UPDATE_ADDRESS_LABEL_ERROR:
      return (
        <FormattedMessage
          id='components.alerts.update_address_label_error'
          defaultMessage='Failed to update address label.'
        />
      )
    case C.VERIFY_EMAIL_SENT:
      return (
        <FormattedMessage
          id='components.alerts.verify_email_sent'
          defaultMessage='Verification email sent. Please check your email.'
        />
      )
    case C.VERIFY_EMAIL_SENT_ERROR:
      return (
        <FormattedMessage
          id='components.alerts.verify_email_sent_error'
          defaultMessage='Error sending verification email. Please try again later.'
        />
      )
    case C.WALLET_LOADING_ERROR:
      return (
        <FormattedMessage
          id='components.alerts.wallet_loading_error'
          defaultMessage='Could not retrieve essential data. Try again later.'
        />
      )
    case C.WALLET_SESSION_ERROR:
      return (
        <FormattedMessage
          id='components.alerts.wallet_session_error'
          defaultMessage='Error establishing the session'
        />
      )
    case C.WALLET_UPGRADE_ERROR:
      return (
        <FormattedMessage
          id='components.alerts.wallet_upgrade_error'
          defaultMessage='Failed to upgrade to HD and save wallet.'
        />
      )
    case C.YUBIKEY_VERIFY_ERROR:
      return (
        <FormattedMessage
          id='components.alerts.yubikey_verify_error'
          defaultMessage='Failed to verify Yubikey'
        />
      )
    case C.YUBIKEY_VERIFY_SUCCESS:
      return (
        <FormattedMessage
          id='components.alerts.yubikey_verify_success'
          defaultMessage='Yubikey verified'
        />
      )
    case C.CAPTCHA_CODE_INCORRECT:
      return (
        <FormattedMessage
          id='components.alerts.captcha_code_incorrect'
          defaultMessage='The captcha you provided was incorrect, please try again'
        />
      )
    case C.BTC_ADDRESS_INVALID:
      return (
        <FormattedMessage
          id='components.alerts.btc_address_incorrect'
          defaultMessage='Invalid Bitcoin Address.'
        />
      )
    case C.BCH_ADDRESS_INVALID:
      return (
        <FormattedMessage
          id='components.alerts.bch_address_incorrect'
          defaultMessage='Invalid Bitcoin Cash Address.'
        />
      )
    case C.ETH_ADDRESS_INVALID:
      return (
        <FormattedMessage
          id='components.alerts.eth_address_incorrect'
          defaultMessage='Invalid Ether Address.'
        />
      )
    case C.XLM_ADDRESS_INVALID:
      return (
        <FormattedMessage
          id='components.alerts.xlm_address_incorrect'
          defaultMessage='Invalid Stellar Address.'
        />
      )
    case C.PRIVATE_KEY_INVALID:
      return (
        <FormattedMessage
          id='components.alerts.private_key_incorrect'
          defaultMessage='Invalid Private Key.'
        />
      )
    case C.BTC_ADDRESS_AND_PRIVATE_KEY_INVALID:
      return (
        <FormattedMessage
          id='components.alerts.address_and_private_key_incorrect'
          defaultMessage='Not a valid bitcoin private key or address.'
        />
      )
    case C.LOCKBOX_SETUP_SUCCESS:
      return (
        <FormattedMessage
          id='components.alerts.lockbox_setup_success'
          defaultMessage='Lockbox successfully added.'
        />
      )
    case C.LOCKBOX_SETUP_ERROR:
      return (
        <FormattedMessage
          id='components.alerts.lockbox_setup_error'
          defaultMessage='Failed to setup Lockbox.'
        />
      )
    case C.LOCKBOX_UPDATE_SUCCESS:
      return (
        <FormattedMessage
          id='components.alerts.lockbox_update_success'
          defaultMessage='Lockbox settings successfully updated.'
        />
      )
    case C.LOCKBOX_UPDATE_ERROR:
      return (
        <FormattedMessage
          id='components.alerts.lockbox_update_error'
          defaultMessage='Failed to update Lockbox settings.'
        />
      )
    case C.LOCKBOX_DELETE_SUCCESS:
      return (
        <FormattedMessage
          id='components.alerts.lockbox_delete_success'
          defaultMessage='Lockbox successfully deleted.'
        />
      )
    case C.LOCKBOX_DELETE_ERROR:
      return (
        <FormattedMessage
          id='components.alerts.lockbox_delete_error'
          defaultMessage='Failed to remove Lockbox.'
        />
      )
    default:
      return (
        message || (
          <FormattedMessage
            id='components.alerts.unknown_error'
            defaultMessage='An error has occurred.'
          />
        )
      )
  }
}
const Alerts = props => {
  const { alerts, handleClose } = props

  return (
    <Wrapper>
      {alerts.map((alert, index) => {
        const { id, nature, message, data } = alert
        return (
          <Toast key={index} nature={nature} onClose={() => handleClose(id)}>
            {selectHeader(nature)}
            {selectMessage(message, data)}
          </Toast>
        )
      })}
    </Wrapper>
  )
}

Alerts.propTypes = {
  alerts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      nature: PropTypes.oneOf(['info', 'error', 'success']),
      message: PropTypes.string.isRequired,
      data: PropTypes.object
    })
  )
}

export default Alerts
