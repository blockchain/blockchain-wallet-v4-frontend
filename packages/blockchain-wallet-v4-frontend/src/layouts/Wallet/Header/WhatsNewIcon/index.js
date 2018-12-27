import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import { getData } from './selectors'
import WhatsNewIcon from './template'

class WhatsNewIconContainer extends React.PureComponent {
  render () {
    return this.props.data.cata({
      Success: val => (
        <WhatsNewIcon
          highlighted={val.highlighted}
          handleClick={this.props.actions.layoutWalletWhatsnewClicked}
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
  actions: bindActionCreators(actions.components.layoutWallet, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WhatsNewIconContainer)
