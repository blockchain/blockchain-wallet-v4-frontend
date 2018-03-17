import React from 'react'
import { Icon } from 'blockchain-info-components'
import { FormattedMessage } from 'react-intl'

import { Container, Question, Answer } from '../styled'

export default class Helper extends React.Component {
  constructor (props) {
    super(props)
    this.state = {open: false}
  }

  render () {
    return (
      <Container>
        <Question onClick={() => this.setState({ open: !this.state.open })}>
          <FormattedMessage id='sfoxsignup.create.helper1.question' defaultMessage='What is SFOX?' />
          { this.state.open ? <Icon name='up-arrow-filled' color='brand-secondary' /> : <Icon name='down-arrow-filled' /> }
        </Question>
        { this.state.open ? <Answer> <FormattedMessage id='sfoxsignup.create.helper1.answer' defaultMessage='Answer placeholder' /> </Answer> : null }
      </Container>
    )
  }
}
