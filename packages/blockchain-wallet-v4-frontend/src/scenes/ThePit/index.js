import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import ThePit from './template'

class ThePitContainer extends React.PureComponent {
  onSignup = () => {
    this.props.modalActions.showModal('LinkToPitAccount')
  }

  render () {
    return <ThePit onSignup={this.onSignup} />
  }
}

const mapDispatchToProps = dispatch => ({
  modalActions: bindActionCreators(actions.modals, dispatch)
})

export default connect(
  null,
  mapDispatchToProps
)(ThePitContainer)
