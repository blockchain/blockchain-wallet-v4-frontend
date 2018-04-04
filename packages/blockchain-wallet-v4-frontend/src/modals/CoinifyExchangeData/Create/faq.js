// import React from 'react'
// import { Icon } from 'blockchain-info-components'
// import { FormattedHTMLMessage } from 'react-intl'
//
// import { Container, Question, Answer } from 'components/BuySell/FAQ'
//
// export default class FAQ1 extends React.Component {
//   constructor (props) {
//     super(props)
//     this.state = {open: false}
//   }
//
//   render () {
//     return (
//       <Container>
//         <Question onClick={() => this.setState({ open: !this.state.open })}>
//           <FormattedHTMLMessage id='coinify.create.helper1.question' defaultMessage='Create account placeholder 1?' />
//           { this.state.open ? <Icon name='up-arrow-filled' color='brand-secondary' /> : <Icon name='down-arrow-filled' /> }
//         </Question>
//         { this.state.open ? <Answer> <FormattedHTMLMessage id='coinify.payment.helper1.answer' defaultMessage='Answer1 placeholder' /> </Answer> : null }
//       </Container>
//     )
//   }
// }
