import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import { getData } from './selectors'
import FaqIcon from './template'

class FaqIconContainer extends React.PureComponent {
  render () {
    return (
      <FaqIcon
        highlighted={this.props.highlighted}
        handleClick={() => { this.props.actions.layoutWalletFaqClicked(); this.props.analytics.logClick('faq') }}
      />
    )
  }
}

const mapStateToProps = state => getData(state)

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.layoutWallet, dispatch),
  analytics: bindActionCreators(actions.analytics, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FaqIconContainer)
