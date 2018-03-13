import React from 'react'
import styled from 'styled-components'
import { Text, Icon } from 'blockchain-info-components'
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

class Helper extends React.Component {
  constructor (props) {
    super(props)

    this.state = {open: false}
  }

  render () {
    return (
      <Container>
        <Question onClick={() => this.setState({ open: !this.state.open })}>
          <FormattedHTMLMessage id={this.props.questionId} defaultMessage='{question}' values={{question: this.props.question}} />
          {
            this.state.open
              ? <Icon name='up-arrow-filled' color='brand-secondary' />
              : <Icon name='down-arrow-filled' />
          }
        </Question>
        {
          this.state.open
            ? <Answer>
              <FormattedHTMLMessage id='sfoxsignup.link.helper.identity.usedanswer' defaultMessage='{question}' values={{question: this.props.answer}} />
            </Answer>
            : null
        }
      </Container>
    )
  }
}

export default Helper
