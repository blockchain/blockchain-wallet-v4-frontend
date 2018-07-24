import styled from 'styled-components'
import React from 'react'
import { Icon } from 'blockchain-info-components'

const Container = styled.div`
  border-bottom: 1px solid #979797;
  padding: 20px 0px;
  font-size: 13px;
  font-weight: 300;
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
          { this.state.open ? <Icon name='up-arrow-filled' color='brand-secondary' /> : <Icon name='down-arrow-filled' /> }
        </Question>
        { this.state.open ? <Answer> { this.props.answer } </Answer> : null }
      </Container>
    )
  }
}
