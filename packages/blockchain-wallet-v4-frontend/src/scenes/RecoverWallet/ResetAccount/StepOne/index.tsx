// import React from 'react'
// import { FormattedMessage } from 'react-intl'
// import { props } from 'ramda'
// import styled from 'styled-components'

// import { Icon, Text } from 'blockchain-info-components'
// import { LoginSteps } from 'data/types'

// import { ActionButton, BackArrowFormHeader } from '../model'
// import { Props } from '..'

// const FormBody = styled.div`
//   display: flex;
//   flex-direction: column;
// `
// class StepOne extends React.PureComponent<Props, State> {
//   constructor(props) {
//     super(props)
//     this.state = {
//       firstModal: true
//     }
//   }

//   handleResetAccountClick = () => {
//     if (this.state.firstModal === true) {
//       this.setState({ firstModal: false })
//     } else {
//       // do action that resets account, take them to new password screen
//     }
//   }

//   handleGoBackClick = () => {
//     if (this.state.firstModal === true) {
//       this.props.setStep(LoginSteps.RECOVERY_OPTIONS)
//     } else {
//       this.setState({ firstModal: true })
//     }
//   }

//   render() {
//     const { authActions, cacheActions, formActions, formValues, setStep } = this.props
//     return (
//       <>
//         <BackArrowFormHeader
//           handleBackArrowClick={() => setStep(LoginSteps.ENTER_EMAIL_GUID)}
//           formValues={formValues}
//         />
//         {this.state.firstModal ? (
//           <>
//             <Icon name='sync-regular' color='blue600' size='20px' style={{ marginBottom: '8px' }} />
//             <FormBody>
//               <Text
//                 color='grey900'
//                 size='20px'
//                 weight={600}
//                 lineHeight='1.5'
//                 style={{ marginBottom: '8px' }}
//               >
//                 <FormattedMessage id='scenes.recovery.reset' defaultMessage='Reset Your Account?' />
//               </Text>
//               <Text color='grey600' size='14px' weight={500} lineHeight='1.5'>
//                 <FormattedMessage
//                   id='scenes.recovery.resetting'
//                   defaultMessage='Resetting will restore your Trading, Interest, and Exchange accounts.'
//                 />
//               </Text>
//             </FormBody>
//           </>
//         ) : (
//           <>
//             <Icon
//               name='alert-filled'
//               color='orange600'
//               size='20px'
//               style={{ marginBottom: '8px' }}
//             />
//             <FormBody>
//               <Text
//                 color='grey900'
//                 size='20px'
//                 weight={600}
//                 lineHeight='1.5'
//                 style={{ marginBottom: '8px' }}
//               >
//                 <FormattedMessage
//                   id='sscenes.recovery.reset_warning_title'
//                   defaultMessage='Resetting Account May Result in Lost Funds'
//                 />
//               </Text>
//               <Text color='grey600' size='14px' weight={500} lineHeight='1.5'>
//                 <FormattedMessage
//                   id='scenes.recovery.reset_warning_body'
//                   defaultMessage='This means that if you lose your recovery phrase, you will lose access to your Private Key Wallet funds. You can restore your Private Key Wallet funds later if you find your recovery phrase.'
//                 />
//               </Text>
//             </FormBody>
//           </>
//         )}

//         <ActionButton
//           nature='primary'
//           fullwidth
//           height='48px'
//           data-e2e='resetAccountButton'
//           style={{ marginBottom: '16px' }}
//           onClick={this.handleResetAccountClick}
//         >
//           <FormattedMessage id='buttons.reset_account' defaultMessage='Reset Account' />
//         </ActionButton>
//         <ActionButton
//           nature='empty-secondary'
//           fullwidth
//           height='48px'
//           data-e2e='goBack'
//           style={{ marginBottom: '16px' }}
//           onClick={this.handleGoBackClick}
//         >
//           <FormattedMessage id='buttons.go_back' defaultMessage='Go Back' />
//         </ActionButton>
//       </>
//     )
//   }
// }

// type State = { firstModal: boolean }

// export default StepOne
