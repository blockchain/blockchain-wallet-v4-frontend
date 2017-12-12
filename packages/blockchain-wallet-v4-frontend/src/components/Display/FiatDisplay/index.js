import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions, selectors } from 'data'
import FiatDisplay from './template.js'

class FiatDisplayContainer extends React.Component {
  componentWillMount () {
    this.props.actions.initFiatDisplay(this.props.coin)
  }

  render () {
    const { fiatDisplay, ...rest } = this.props
    return <FiatDisplay {...rest}>{fiatDisplay.value}</FiatDisplay>
  }
}

FiatDisplayContainer.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  coin: PropTypes.oneOf(['BTC', 'ETH']).isRequired
}

const mapStateToProps = (state, ownProps) => ({
  fiatDisplay: selectors.modules.fiatDisplay.getFiatDisplay(state, ownProps.coin, ownProps.children)
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.modules.fiatDisplay, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(FiatDisplayContainer)
