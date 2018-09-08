import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { formValueSelector } from 'redux-form'
import { isNil, equals } from 'ramda'

import { actions } from 'data'
import Settings from './template.js'

class SettingsContainer extends React.PureComponent {
  componentDidMount () {
    this.props.formActions.initialize('settingLanguage', {
      language: this.props.language
    })
  }

  componentDidUpdate (prevProps) {
    const { language, newLanguage } = this.props
    if (
      !isNil(prevProps.newLanguage) &&
      !equals(language, prevProps.newLanguage) &&
      !equals(newLanguage, prevProps.newLanguage)
    ) {
      this.props.settingsActions.updateLanguage(prevProps.newLanguage)
      this.props.preferencesActions.setLanguage(prevProps.newLanguage, true)
    }
  }

  render () {
    return <Settings />
  }
}

const mapStateToProps = state => ({
  newLanguage: formValueSelector('settingLanguage')(state, 'language')
})

const mapDispatchToProps = dispatch => ({
  settingsActions: bindActionCreators(actions.modules.settings, dispatch),
  preferencesActions: bindActionCreators(actions.preferences, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingsContainer)
