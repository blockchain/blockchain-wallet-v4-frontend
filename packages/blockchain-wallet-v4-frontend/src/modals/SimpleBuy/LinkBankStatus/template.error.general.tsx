// import { Button, Icon, Image, Link, Text } from 'blockchain-info-components'
// import { FlyoutWrapper } from 'components/Flyout'
// import { FormattedMessage } from 'react-intl'
// import { Props as OwnProps, SuccessStateType } from '.'
// import React from 'react'
// import styled from 'styled-components'

// export type Props = OwnProps & SuccessStateType

// const Top = styled(FlyoutWrapper)`
//   padding-bottom: 0px;
//   position: relative;
//   height: 100%;
//   display: flex;
// `

// const CloseIcon = styled(Icon)`
//   position: absolute;
//   padding: inherit;
//   left: 0px;
//   top: 0px;
// `

// const Container = styled.div`
//   display: flex;
//   flex-direction: column;
//   justify-content: center;
//   align-items: center;
//   width: 100%;
//   height: 100%;
// `

// const Title = styled(Text)`
//   margin: 56px 0 16px 0;
//   text-align: center;
// `

// const Subcontent = styled(Text)`
//   margin-bottom: 56px;
//   text-align: center;
// `

// const Unsupported: React.FC<Props> = props => {
//   const { paymentAccountEligible } = props.eligibility
//   // add prop here, bank linked vs. failure, use to check things
//   return (
//     <Top>
//       <CloseIcon
//         cursor
//         name='close'
//         size='20px'
//         color='grey600'
//         role='button'
//         // onClick={() =>
//         //   close modal
//         // }
//       />
//       <Container>
//         <Image width='100px' name='bank-error' />
//         <Title color='grey800' size='20px' weight={600}>
//           <FormattedMessage
//             id='scenes.exchange.confirm.oopsheader'
//             defaultMessage='Oops! Something went wrong.'
//           />
//         </Title>
//         <Subcontent color='grey600' weight={500}>
//             <>
//               <FormattedMessage
//                 id='copy.bank_linked_error'
//                 defaultMessage='Please try linking your bank again. If this keeps happening, please'
//               />
//           {' '}
//                 <Link
//                   size='16px'
//                   weight={500}
//                   target='_blank'
//                   href='https://support.blockchain.com/hc/en-us/'
//                 >
//                   <FormattedMessage
//                     id='buttons.contact_support'
//                     defaultMessage='Contact Support'
//                   />
//                 </Link>
//                 {'.'}
//               </>
//         </Subcontent>
//         <Button
//           data-e2e='bankLinkTryAgain'
//           height='48px'
//           size='16px'
//           nature='primary'
//           // onClick={() =>
//           //   send user back to bank link step
//           // }
//           fullwidth
//         >
//           <FormattedMessage id='buttons.tryagain' defaultMessage='Try Again' />
//         </Button>
//         <Button
//           data-e2e='bankLinkCancel'
//           height='48px'
//           size='16px'
//           nature='light'
//           style={{ marginTop: '16px' }}
//           // onClick={() =>
//           //   cancel and go back where?
//           // }
//           fullwidth
//         >
//           <FormattedMessage id='buttons.cancel_goback' defaultMessage="Cancel & Go Back"/>
//         </Button>
//       </Container>
//     </Top>
//   )
// }

// export default Unsupported
