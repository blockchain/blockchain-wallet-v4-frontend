import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'

class TabsContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick (tab) {
    this.props.preferencesActions.setBalancesChartTab(tab)
  }

  render () {
    return (
      <div>
        <span onClick={() => this.handleClick('total')}>Total</span>
        <span onClick={() => this.handleClick('wallet')}>Wallet</span>
        <span onClick={() => this.handleClick('lockbox')}>Lockbox</span>
      </div>
    )
  }
}

export const mapDispatchToProps = dispatch => ({
  preferencesActions: bindActionCreators(actions.preferences, dispatch)
})

export default connect(
  null,
  mapDispatchToProps
)(TabsContainer)
