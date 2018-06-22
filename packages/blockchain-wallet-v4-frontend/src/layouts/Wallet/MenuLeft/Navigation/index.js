import React from 'react'
import { connect } from 'react-redux'
import { compose, bindActionCreators } from 'redux'
import { withRouter } from 'react-router-dom'

import { actions } from 'data'
import { getData } from './selectors'
import Navigation from './template.js'

class NavigationContainer extends React.PureComponent {
  render () {
    return (
      <Navigation
        canTrade={this.props.canTrade}
        settingsOpened={this.props.settingsOpened}
        menuOpened={this.props.menuOpened}
        pathname={this.props.pathname}
        handleCloseMenu={() => this.props.actions.layoutWalletMenuCloseClicked()}
      />
    )
  }
}

const mapStateToProps = state => getData(state)

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.layoutWallet, dispatch)
})

const enhance = compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)

export default enhance(NavigationContainer)
