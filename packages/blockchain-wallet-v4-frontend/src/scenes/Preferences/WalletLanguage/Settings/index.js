import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { equals } from 'ramda'

import { actions, selectors } from 'data'
import Settings from './template.js'

class SettingsContainer extends React.Component {
  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  componentWillMount () {
    this.props.formActions.initialize('settingLanguage', { 'language': this.props.language })
  }

  componentWillReceiveProps (nextProps) {
    if (!equals(nextProps.language, this.props.language)) {
      this.props.formActions.change('settingLanguage', 'language', nextProps.language)
    }
  }

  handleClick (value) {
    this.props.settingsActions.updateLanguage(value)
  }

  render () {
    return <Settings {...this.props} handleClick={this.handleClick} />
  }
}

const mapStateToProps = (state) => ({
  language: selectors.core.settings.getLanguage(state)
})

const mapDispatchToProps = (dispatch) => ({
  settingsActions: bindActionCreators(actions.settings, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(SettingsContainer)
