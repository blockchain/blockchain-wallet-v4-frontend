import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions, model, selectors } from 'data'
import ThePit from './template'

const { AB_TESTS } = model.analytics

class ThePitContainer extends React.PureComponent {
  componentDidMount () {
    this.props.preferencesActions.hideThePitPulse()
  }

  onSignup = () => {
    this.props.modalActions.showModal('LinkToPitAccount')
  }

  render () {
    return <ThePit onSignup={this.onSignup} {...this.props} />
  }
}

const mapStateToProps = state => ({
  pitSideNavTest: selectors.analytics.selectAbTest(AB_TESTS.PIT_SIDE_NAV_TEST)(
    state
  )
})

const mapDispatchToProps = dispatch => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  preferencesActions: bindActionCreators(actions.preferences, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ThePitContainer)
