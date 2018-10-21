import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'

import { actions } from 'data'
import Empty from './template.js'

class EmptyContainer extends React.PureComponent {
  render () {
    return <Empty coin={this.props.coin} />
  }
}

const mapDispatchToProps = dispatch => ({
  modalActions: bindActionCreators(actions.modals, dispatch)
})

EmptyContainer.propTypes = {
  coin: PropTypes.oneOf(['BTC', 'BCH', 'ETH']).isRequired
}

export default connect(
  undefined,
  mapDispatchToProps
)(EmptyContainer)
