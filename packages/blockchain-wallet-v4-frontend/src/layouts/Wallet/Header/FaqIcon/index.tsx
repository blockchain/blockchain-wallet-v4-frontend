import { actions, model } from 'data'
import { bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'
import FaqIcon from './template'
import React from 'react'

const { GENERAL_EVENTS } = model.analytics

type LinkDispatchPropsType = {
  analyticsActions: typeof actions.analytics,
  modalActions: typeof actions.modals
}

class FaqIconContainer extends React.PureComponent<LinkDispatchPropsType> {
  handleClick = () => {
    this.props.modalActions.showModal('FAQ_MODAL')
    this.props.analyticsActions.logEvent(GENERAL_EVENTS.VIEW_WHATS_NEW)
  }
  render () {
    return (
      <FaqIcon
        onClick={this.handleClick}
      />
    )
  }
}

const mapDispatchToProps = (dispatch: Dispatch): LinkDispatchPropsType => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch)
})

export default connect(
  null,
  mapDispatchToProps
)(FaqIconContainer)
