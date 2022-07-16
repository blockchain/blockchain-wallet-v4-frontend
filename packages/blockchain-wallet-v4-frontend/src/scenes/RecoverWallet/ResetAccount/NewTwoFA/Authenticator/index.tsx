// import React, { useEffect, useState } from 'react'
// import { FormattedMessage } from 'react-intl'
// import { connect, ConnectedProps } from 'react-redux'
// import { bindActionCreators } from 'redux'

// import AuthenticatorCode from './template.qrcode'
// import AuthenticatorVerify from './template.verify'

// import { Props as OwnProps } from '../../..'

// // import { Badge, Button, Text } from 'blockchain-info-components'
// // import CopyClipboard from 'components/Clipboard/CopyClipboard'
// // import QRCodeWrapper from 'components/QRCodeWrapper'
// import { actions, selectors } from 'data'
// // import { LOGIN_FORM } from 'data/auth/model'

// const Authenticator = (props) => {
//   const [step, setStep] = useState(1)

//   const changeAuthenticatorStep = (authStep: number) => {
//     setStep(authStep)
//   }
//   return (
//     <>
//       {step === 1 && <AuthenticatorCode {...props} />}
//       {step === 2 && <AuthenticatorVerify {...props} />}
//     </>
//   )
// }

// // const mapStateToProps = (state) => ({
// //   authCode: formValueSelector('securityGoogleAuthenticator')(state, 'authCode'),
// // authType: selectors.core.settings.getAuthType(state).getOrElse(0)
// //   data: getData(state)
// // })

// const mapDispatchToProps = (dispatch) => ({
//   formActions: bindActionCreators(actions.form, dispatch),
//   securityCenterActions: bindActionCreators(actions.modules.securityCenter, dispatch)
// })

// const connector = connect(null, mapDispatchToProps)

// export type Props = ConnectedProps<typeof connector> &
//   OwnProps & {
//     changeAuthenticatorStep: (number) => void
//   }

// export default connector(Authenticator)
