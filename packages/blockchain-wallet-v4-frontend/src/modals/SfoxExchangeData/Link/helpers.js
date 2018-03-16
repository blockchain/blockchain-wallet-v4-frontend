import React from 'react'
import { Icon } from 'blockchain-info-components'
import { FormattedHTMLMessage } from 'react-intl'

import { Container, Question, Answer } from '../styled'

class Helper1 extends React.Component {
  constructor (props) {
    super(props)
    this.state = {open: false}
  }

  render () {
    return (
      <Container>
        <Question onClick={() => this.setState({ open: !this.state.open })}>
          <FormattedHTMLMessage id='sfoxsignup.link.helper1.question' defaultMessage='How is my payment method used?' />
          { this.state.open ? <Icon name='up-arrow-filled' color='brand-secondary' /> : <Icon name='down-arrow-filled' /> }
        </Question>
        { this.state.open ? <Answer> <FormattedHTMLMessage id='sfoxsignup.link.helper1.answer' defaultMessage='Answer1 placeholder' /> </Answer> : null }
      </Container>
    )
  }
}

class Helper2 extends React.Component {
  constructor (props) {
    super(props)
    this.state = {open: false}
  }

  render () {
    return (
      <Container>
        <Question onClick={() => this.setState({ open: !this.state.open })}>
          <FormattedHTMLMessage id='sfoxsignup.link.helper2.question' defaultMessage='Are there transaction fees?' />
          { this.state.open ? <Icon name='up-arrow-filled' color='brand-secondary' /> : <Icon name='down-arrow-filled' /> }
        </Question>
        { this.state.open ? <Answer> <FormattedHTMLMessage id='sfoxsignup.link.helper2.answer' defaultMessage='Answer2 placeholder' /> </Answer> : null }
      </Container>
    )
  }
}

class Helper3 extends React.Component {
  constructor (props) {
    super(props)
    this.state = {open: false}
  }

  render () {
    return (
      <Container>
        <Question onClick={() => this.setState({ open: !this.state.open })}>
          <FormattedHTMLMessage id='sfoxsignup.link.helper3.question' defaultMessage='How will this account be used?' />
          { this.state.open ? <Icon name='up-arrow-filled' color='brand-secondary' /> : <Icon name='down-arrow-filled' /> }
        </Question>
        { this.state.open ? <Answer> <FormattedHTMLMessage id='sfoxsignup.link.helper3.answer' defaultMessage='Answer3 placeholder' /> </Answer> : null }
      </Container>
    )
  }
}

class Helper4 extends React.Component {
  constructor (props) {
    super(props)
    this.state = {open: false}
  }

  render () {
    return (
      <Container>
        <Question onClick={() => this.setState({ open: !this.state.open })}>
          <FormattedHTMLMessage id='sfoxsignup.link.helper4.question' defaultMessage='Can I change this later?' />
          { this.state.open ? <Icon name='up-arrow-filled' color='brand-secondary' /> : <Icon name='down-arrow-filled' /> }
        </Question>
        { this.state.open ? <Answer> <FormattedHTMLMessage id='sfoxsignup.link.helper4.answer' defaultMessage='Answer4 placeholder' /> </Answer> : null }
      </Container>
    )
  }
}

export { Helper1, Helper2, Helper3, Helper4 }
