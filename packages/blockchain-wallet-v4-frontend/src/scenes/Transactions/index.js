import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import Content from './Content'

const Wrapper = styled.div`
  width: 100%;
`

class TransactionsContainer extends React.PureComponent {
  render () {
    return (
      <Wrapper>
        <Content coin={this.props.coin} />
      </Wrapper>
    )
  }
}

TransactionsContainer.propTypes = {
  coin: PropTypes.oneOf(['BTC', 'BCH', 'ETH'])
}

export default TransactionsContainer
