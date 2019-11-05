import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import React from 'react'

import { actions, model } from 'data'
import { getData } from './selectors'
import FaqIcon from './template'

const { GENERAL_EVENTS } = model.analytics
class FaqIconContainer extends React.PureComponent {
  onFaqClick = () => {
    this.props.actions.layoutWalletFaqClicked()
    this.props.analyticsActions.logEvent(GENERAL_EVENTS.VIEW_WHATS_NEW)
  }
  render () {
    return (
      <FaqIcon
        highlighted={this.props.highlighted}
        handleClick={this.onFaqClick}
      />
    )
  }
}

const mapStateToProps = state => getData(state)

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.layoutWallet, dispatch),
  analyticsActions: bindActionCreators(actions.analytics, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FaqIconContainer)
