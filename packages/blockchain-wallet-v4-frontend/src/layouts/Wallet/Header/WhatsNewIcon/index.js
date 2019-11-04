import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import React from 'react'

import { actions, model } from 'data'
import { getData } from './selectors'
import WhatsNewIcon from './template'

const { GENERAL_EVENTS } = model.analytics
class WhatsNewIconContainer extends React.PureComponent {
  onWhatsNewClick = () => {
    this.props.actions.layoutWalletWhatsnewClicked()
    this.props.analyticsActions.logEvent(GENERAL_EVENTS.VIEW_FAQ)
  }
  render () {
    return this.props.data.cata({
      Success: val => (
        <WhatsNewIcon
          highlighted={val.highlighted}
          handleClick={this.onWhatsNewClick}
          numOfNewAnnouncements={val.numOfNewAnnouncements}
        />
      ),
      Failure: () => <WhatsNewIcon />,
      Loading: () => <WhatsNewIcon />,
      NotAsked: () => <WhatsNewIcon />
    })
  }
}

const mapStateToProps = state => ({
  data: getData(state)
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.layoutWallet, dispatch),
  analyticsActions: bindActionCreators(actions.analytics, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WhatsNewIconContainer)
