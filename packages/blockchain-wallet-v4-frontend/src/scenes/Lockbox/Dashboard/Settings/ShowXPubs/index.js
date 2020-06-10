import { actions } from 'data'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import React from 'react'

import ShowXpubs from './template'

class ShowXPubsContainer extends React.PureComponent {
  onShowXPubs = () => {
    this.props.modalActions.showModal('LockboxShowXPubs', {
      deviceIndex: this.props.deviceIndex
    })
  }

  render () {
    return <ShowXpubs onShowXPubs={this.onShowXPubs} />
  }
}

const mapDispatchToProps = dispatch => ({
  modalActions: bindActionCreators(actions.modals, dispatch)
})

export default connect(null, mapDispatchToProps)(ShowXPubsContainer)
