import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  border: 1px solid ${props => props.theme['gray-1']};
`

class OrderHistory extends React.Component {
  constructor () {
    super()
    this.state = {}
  }

  render () {
    const { trades } = this.props

    return (
      <Wrapper>
        {
          trades.map((trade) => {
            return <div>{ trade.inAmount }</div>
          })
        }
      </Wrapper>
    )
  }
}

export default OrderHistory
