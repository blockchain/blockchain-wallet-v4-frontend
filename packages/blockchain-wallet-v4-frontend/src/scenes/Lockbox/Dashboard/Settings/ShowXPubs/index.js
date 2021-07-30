import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'

import ShowXpubs from './template'

class ShowXPubsContainer extends React.PureComponent {
  onShowXPubs = () => {
    this.props.modalActions.showModal('LOCKBOX_SHOW_XPUBS', {
      deviceIndex: this.props.deviceIndex
    })
  }

  render() {
    return <ShowXpubs onShowXPubs={this.onShowXPubs} />
  }
}

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch)
})

export default connect(null, mapDispatchToProps)(ShowXPubsContainer)
