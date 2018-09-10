import React from 'react'
import { connect } from 'react-redux'
import { compose, bindActionCreators } from 'redux'
import { withRouter } from 'react-router-dom'

import { actions } from 'data'
import { getData } from './selectors'
import Navigation from './template.js'

class NavigationContainer extends React.PureComponent {
  render () {
    const { actions, ...props } = this.props
    return (
      <Navigation
        {...props}
        handleCloseMenu={actions.layoutWalletMenuCloseClicked}
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
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)

export default enhance(NavigationContainer)
