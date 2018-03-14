import React from 'react'
import styled from 'styled-components'
import { Icon } from 'blockchain-info-components'
import { FormattedMessage } from 'react-intl'

const Container = styled.div`
  border-bottom: 1px solid #979797;
  padding: 20px 10px;
  width: 70%;
  font-size: 14px;
  font-weight: 300;
`
const Question = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  cursor: pointer;
`
const Answer = styled.div`
  margin-top: 15px;
  font-size: 12px;
`

class Helper1 extends React.Component {
  constructor (props) {
    super(props)
    this.state = {open: false}
  }

  render () {
    return (
      <Container>
        <Question onClick={() => this.setState({ open: !this.state.open })}>
          <FormattedMessage id='sfoxsignup.verify.address.helper1.question' defaultMessage='Why do you need this information?' />
          { this.state.open ? <Icon name='up-arrow-filled' color='brand-secondary' /> : <Icon name='down-arrow-filled' /> }
        </Question>
        { this.state.open ? <Answer> <FormattedMessage id='sfoxsignup.verify.address.helper1.answer' defaultMessage='Answer1 placeholder' /> </Answer> : null }
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
          <FormattedMessage id='sfoxsignup.verify.address.helper2.question' defaultMessage='Where is my information stored?' />
          { this.state.open ? <Icon name='up-arrow-filled' color='brand-secondary' /> : <Icon name='down-arrow-filled' /> }
        </Question>
        { this.state.open ? <Answer> <FormattedMessage id='sfoxsignup.verify.address.helper2.answer' defaultMessage='Answer2 placeholder' /> </Answer> : null }
      </Container>
    )
  }
}

export { Helper1, Helper2 }
