import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actions, model, selectors } from 'data'
import ThePit from './template'

const { AB_TESTS, PIT_EVENTS } = model.analytics

class ThePitContainer extends React.PureComponent {
  componentDidMount () {
    this.props.preferencesActions.hideThePitPulse()
  }

  onSignup = () => {
    this.props.modalActions.showModal('LinkToPitAccount')
    this.props.analyticsActions.logEvent(PIT_EVENTS.CONNECT_NOW)
  }

  onLearnMore = () => {
    this.props.analyticsActions.logEvent(PIT_EVENTS.LEARN_MORE)
  }

  render () {
    return (
      <ThePit
        onSignup={this.onSignup}
        onLearnMore={this.onLearnMore}
        {...this.props}
      />
    )
  }
}

const mapStateToProps = state => ({
  pitSideNavTest3: selectors.analytics.selectAbTest(
    AB_TESTS.PIT_SIDE_NAV_TEST3
  )(state)
})

const mapDispatchToProps = dispatch => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch),
  preferencesActions: bindActionCreators(actions.preferences, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ThePitContainer)
