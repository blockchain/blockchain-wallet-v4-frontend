import React from 'react'
import PropTypes from 'prop-types'

import Content from './Content'

class TransactionsContainer extends React.PureComponent {
  render () {
    return <Content coin={this.props.coin} location={this.props.location} />
  }
}

TransactionsContainer.propTypes = {
  coin: PropTypes.oneOf(['BTC', 'BCH', 'ETH', 'XLM', 'BSV']).isRequired
}

export default TransactionsContainer
