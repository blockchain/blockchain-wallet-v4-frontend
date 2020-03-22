import { actions, selectors } from 'data'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import React from 'react'
import Template from './template'

class Table extends React.PureComponent {
  render () {
    const { supportedCoins, viewType } = this.props

    return <Template viewType={viewType} supportedCoins={supportedCoins} />
  }
}

const mapStateToProps = (state, ownProps) => ({
  supportedCoins: selectors.core.walletOptions
    .getSupportedCoins(state)
    .getOrFail()
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.refresh, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Table)
