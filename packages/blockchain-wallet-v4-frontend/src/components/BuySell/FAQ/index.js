import styled from 'styled-components'
import React from 'react'
import { Icon } from 'blockchain-info-components'

const Container = styled.div`
  border-bottom: 1px solid #979797;
  padding: 20px 0px;
  font-size: 13px;
  font-weight: 300;
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
  transform: rotate(0deg);
  transition: transform 0.3s;
  transform: ${props => props.toggled && 'rotate(180deg)'};
  color: ${props => props.toggled ? props.theme['brand-secondary'] : props.theme['gray-5']};
`

export default class Helper extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {open: false}
  }

  render () {
    return (
      <Container>
        <Question onClick={() => this.setState({ open: !this.state.open })}>
          { this.props.question }
          <ToggleIcon name='down-arrow-filled' toggled={this.state.open} />
        </Question>
        { this.state.open ? <Answer> { this.props.answer } </Answer> : null }
      </Container>
    )
  }
}
