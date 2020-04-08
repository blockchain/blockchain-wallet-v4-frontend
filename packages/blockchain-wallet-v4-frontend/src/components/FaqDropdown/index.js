import { Icon } from 'blockchain-info-components'
import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  border-bottom: 1px solid #979797;
  padding: 20px 0px;
  font-size: 13px;
  font-weight: 400;
  opacity: 0.7;
`
const Question = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  cursor: pointer;
  padding: 0px 10px;
`
const Answer = styled.div`
  margin-top: 15px;
  font-size: 12px;
  padding: 0px 10px;
`
const ToggleIcon = styled(Icon)`
  cursor: pointer;
  transform: ${props => props.toggled && 'rotate(180deg)'};
  transition: transform 0.3s;
  color: ${props =>
    props.toggled ? props.theme.blue600 : props.theme.grey700};
  max-height: min-content;
`

export class FaqDropdown extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = { open: false }
  }

  render () {
    return (
      <Container>
        <Question onClick={() => this.setState({ open: !this.state.open })}>
          {this.props.question}
          <ToggleIcon
            name={this.state.open ? 'chevron-up-large' : 'chevron-down-large'}
            size='10px'
            toggled={this.state.open}
          />
        </Question>
        {this.state.open ? <Answer> {this.props.answer} </Answer> : null}
      </Container>
    )
  }
}

const renderFaq = faqQuestions =>
  faqQuestions.map((el, i) => (
    <FaqDropdown key={i} question={el.question} answer={el.answer} />
  ))

export default renderFaq
