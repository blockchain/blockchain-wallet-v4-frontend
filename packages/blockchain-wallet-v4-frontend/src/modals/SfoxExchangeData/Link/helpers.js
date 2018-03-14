import React from 'react'
import styled from 'styled-components'
import { Icon } from 'blockchain-info-components'
import { FormattedHTMLMessage } from 'react-intl'

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
          <FormattedHTMLMessage id='sfoxsignup.link.helper3.question' defaultMessage='What if my bank is not listed?' />
          { this.state.open ? <Icon name='up-arrow-filled' color='brand-secondary' /> : <Icon name='down-arrow-filled' /> }
        </Question>
        { this.state.open ? <Answer> <FormattedHTMLMessage id='sfoxsignup.link.helper3.answer' defaultMessage='Answer3 placeholder' /> </Answer> : null }
      </Container>
    )
  }
}

export { Helper1, Helper2, Helper3 }
