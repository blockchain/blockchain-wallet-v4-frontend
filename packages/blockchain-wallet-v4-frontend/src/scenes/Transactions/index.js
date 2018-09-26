import React from 'react'
import styled from 'styled-components'
import Content from './Content'

const Wrapper = styled.div`
  width: 100%;
`

export default class TransactionsContainer extends React.PureComponent {
  render () {
    return (
      <Wrapper>
        <Content coin={this.props.coin} />
      </Wrapper>
    )
  }
}
