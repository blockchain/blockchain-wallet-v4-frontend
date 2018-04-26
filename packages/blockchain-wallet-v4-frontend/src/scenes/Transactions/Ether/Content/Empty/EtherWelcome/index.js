import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions, selectors } from 'data'
import EtherWelcome from './template.js'

class EtherWelcomeContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick () {
    this.props.preferencesActions.setEtherWelcome(false)
  }

  render () {
    const { showEtherWelcome } = this.props
    return <EtherWelcome displayed={showEtherWelcome} handleClick={this.handleClick} />
  }
}

const mapStateToProps = state => ({
  showEtherWelcome: selectors.preferences.getShowEtherWelcome(state)
})

const mapDispatchToProps = dispatch => ({
  preferencesActions: bindActionCreators(actions.preferences, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(EtherWelcomeContainer)
