import React from 'react'
import { connect } from 'react-redux'
import { compose, bindActionCreators } from 'redux'
import { toLower, path } from 'ramda'
import { withRouter } from 'react-router-dom'

import { actions } from 'data'
import { getData } from './selectors'
import Navigation from './template.js'

const extractText = compose(
  toLower,
  path(['target', 'textContent'])
)

class NavigationContainer extends React.PureComponent {
  render () {
    const { actions, analytics, ...props } = this.props
    return (
      <Navigation
        {...props}
        handleCloseMenu={actions.layoutWalletMenuCloseClicked}
        logClick={compose(
          analytics.logLeftNavClick,
          extractText
        )}
      />
    )
  }
}

const mapStateToProps = state => ({
  data: getData(state)
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.layoutWallet, dispatch),
  analytics: bindActionCreators(actions.analytics, dispatch)
})

const enhance = compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)

export default enhance(NavigationContainer)
