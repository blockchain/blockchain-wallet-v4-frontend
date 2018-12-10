import React from 'react'
import { actions, selectors } from 'data'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { prop } from 'ramda'

import ShowXpubs from './template'

class ShowXPubsContainer extends React.PureComponent {
  onShowXPubs = () => {
    this.props.modalActions.showModal('ShowLockboxXPubs', {
      btcXPub: this.props.btcXPub,
      bchXPub: this.props.bchXPub
    })
  }

  render () {
    return <ShowXpubs onShowXPubs={this.onShowXPubs} />
  }
}

const mapStateToProps = (state, ownProps) => ({
  btcXPub: selectors.core.kvStore.lockbox
    .getLockboxBtcDefaultAccount(state, ownProps.deviceIndex)
    .map(prop('xpub'))
    .getOrFail(),
  bchXPub: selectors.core.kvStore.lockbox
    .getLockboxBchXpub(state, ownProps.deviceIndex)
    .getOrFail()
})

const mapDispatchToProps = dispatch => ({
  modalActions: bindActionCreators(actions.modals, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ShowXPubsContainer)
