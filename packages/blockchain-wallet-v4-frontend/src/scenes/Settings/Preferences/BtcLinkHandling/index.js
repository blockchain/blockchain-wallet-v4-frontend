import React from 'react'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'

import BitcoinLinkHandling from './template.js'

class BitcoinLinkHandlingContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }
  getDerivedStateFromProps () {}

  handleClick () {
    this.props.uiActions.warningDisplayed()
    window.navigator.registerProtocolHandler(
      'bitcoin',
      '/open/%s',
      'Blockchain'
    )
  }

  render () {
    return (
      <BitcoinLinkHandling
        warningDisplayed={this.props.warningDisplayed}
        handleClick={this.handleClick}
      />
    )
  }
}

const mapStateToProps = state => ({
  warningDisplayed: state.preferences.warningDisplayed
})

const mapDispatchToProps = dispatch => ({
  uiActions: bindActionCreators(actions.preferences, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BitcoinLinkHandlingContainer)
