// import React from 'react'
// import { Icon } from 'blockchain-info-components'
// import { FormattedMessage } from 'react-intl'
//
// import { Container, Question, Answer } from 'components/BuySell/FAQ'
//
// class FAQ1 extends React.Component {
//   constructor (props) {
//     super(props)
//     this.state = {open: false}
//   }
//
//   render () {
//     return (
//       <Container>
//         <Question onClick={() => this.setState({ open: !this.state.open })}>
//           <FormattedMessage id='sfoxsignup.verify.address.helper1.question' defaultMessage='Why do you need this information?' />
//           { this.state.open ? <Icon name='up-arrow-filled' color='brand-secondary' /> : <Icon name='down-arrow-filled' /> }
//         </Question>
//         { this.state.open ? <Answer> <FormattedMessage id='sfoxsignup.verify.address.helper1.answer' defaultMessage='Answer1 placeholder' /> </Answer> : null }
//       </Container>
//     )
//   }
// }
//
// class FAQ2 extends React.Component {
//   constructor (props) {
//     super(props)
//     this.state = {open: false}
//   }
//
//   render () {
//     return (
//       <Container>
//         <Question onClick={() => this.setState({ open: !this.state.open })}>
//           <FormattedMessage id='sfoxsignup.verify.address.helper2.question' defaultMessage='Where is my information stored?' />
//           { this.state.open ? <Icon name='up-arrow-filled' color='brand-secondary' /> : <Icon name='down-arrow-filled' /> }
//         </Question>
//         { this.state.open ? <Answer> <FormattedMessage id='sfoxsignup.verify.address.helper2.answer' defaultMessage='Answer2 placeholder' /> </Answer> : null }
//       </Container>
//     )
//   }
// }
//
// export { FAQ1, FAQ2 }
