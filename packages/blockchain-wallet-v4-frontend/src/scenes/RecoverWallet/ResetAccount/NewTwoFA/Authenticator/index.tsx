import React, { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from 'redux'

import { Badge, Button, Text } from 'blockchain-info-components'
import CopyClipboard from 'components/Clipboard/CopyClipboard'
import QRCodeWrapper from 'components/QRCodeWrapper'
import { actions } from 'data'
import { LOGIN_FORM } from 'data/auth/model'

const Authenticator = (props) => {
  useEffect(() => {
    props.securityCenterActions.getGoogleAuthenticatorSecretUrl()
  }, [])

  return (
    <>
      <Text>
        <FormattedMessage
          id='scenes.login.upgrade.googleAuth.text'
          defaultMessage='With your Google Authenticator app, scan the QR code below to make a secure connection.'
        />
      </Text>
      <Text>
        <FormattedMessage id='scenes.login.upgrade.2fa.header' defaultMessage='Set Up 2FA' />
      </Text>

      {/* <QRCodeWrapper size={150} value={props.data.googleAuthSecretUrl || ''} /> */}

      {/* <CopyClipboard address={props.data.secret || ''} /> */}

      <Badge type='applestore' />
      <Badge type='googleplay' />

      <Button
        nature='primary'
        data-e2e='nextButton'
        fullwidth
        height='48px'
        //   onClick={handleNext}
      >
        <FormattedMessage id='buttons.next' defaultMessage='Next' />
      </Button>
    </>
  )
}

// const mapStateToProps = (state) => ({
//   authCode: formValueSelector('securityGoogleAuthenticator')(state, 'authCode'),
//   data: getData(state)
// })

const mapDispatchToProps = (dispatch) => ({
  formActions: bindActionCreators(actions.form, dispatch),
  securityCenterActions: bindActionCreators(actions.modules.securityCenter, dispatch)
})

const connector = connect(null, mapDispatchToProps)

export type Props = ConnectedProps<typeof connector>

export default connector(Authenticator)
