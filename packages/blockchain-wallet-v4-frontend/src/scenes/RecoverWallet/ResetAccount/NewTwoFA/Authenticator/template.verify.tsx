// import React, { useEffect, useState } from 'react'
// import { FormattedMessage, useIntl } from 'react-intl'

// import { Button, Text, TextInput } from 'blockchain-info-components'

// const AuthenticatorVerify = (props) => {
//   const [inputValue, setInputValue] = useState('')
//   const [isInputValid, setIsInputValid] = useState(false)

//   const handleSubmit = () => {
//     props.securityCenterActions.verifyGoogleAuthenticator(inputValue)
//   }
//   return (
//     <>
//       <Text>

//           <FormattedMessage
//             id='scenes.login.upgrade.googleAuthVerify.header'
//             defaultMessage='Verify Your Google Account'
//           />
//         </Text>
//         <Text>

//           <FormattedMessage
//             id='scenes.login.upgrade.googleAuthVerify.text'
//             defaultMessage='Enter the 6-digit code you see in your Google Auth App.'
//           />
//           </Text>

//       />

//         <Label variant='paragraph-2' color='grey800'>
//           <FormattedMessage
//             id='scenes.login.upgrade.googleAuthVerify.6digitcode'
//             defaultMessage='6 digit code'
//           />
//         </Label>
//         <TextInput
//           name='6digitcode'
//           type='text'
//           value={inputValue}
//           onChange={handleInputChange}
//           placeholder={formatMessage({
//             defaultMessage: 'Enter 6 digit code',
//             id: 'scenes.login.upgrade.googleAuthVerify.6digitcode.placeholder'
//           })}
//         />

//       <Button
//         disabled={!isInputValid}
//         nature='primary'
//         data-e2e='nextButton'
//         fullwidth
//         height='48px'
//         onClick={handleSubmit}
//       >
//         <FormattedMessage id='buttons.next' defaultMessage='Next' />
//       </Button>
//     </>
//   )
// }

// export default AuthenticatorVerify
