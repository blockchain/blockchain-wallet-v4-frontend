
import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actions, selectors } from 'data'
import Settings from './template.js'

class SettingContainer extends React.Component {
  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick () {
    this.props.settingsActions.updateLoggingLevel(Number(!this.props.activityLoggingEnabled))
  }

  render () {
    const { ...rest } = this.props

    return <Settings {...rest} handleClick={this.handleClick} />
  }
}

const mapStateToProps = (state) => ({
  activityLoggingEnabled: selectors.core.settings.getLoggingLevel(state)
})

const mapDispatchToProps = (dispatch) => ({
  settingsActions: bindActionCreators(actions.components.settings, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(SettingContainer)
