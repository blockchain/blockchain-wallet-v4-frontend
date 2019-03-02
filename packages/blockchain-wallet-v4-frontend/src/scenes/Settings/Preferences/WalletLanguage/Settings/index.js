import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { formValueSelector } from 'redux-form'
import { isNil, equals } from 'ramda'

import { actions, model } from 'data'
import Settings from './template'

const { CHANGE_LANGUAGE } = model.analytics.PREFERENCE_EVENTS.GENERAL
class SettingsContainer extends React.PureComponent {
  componentDidMount () {
    this.props.formActions.initialize('settingLanguage', {
      language: this.props.language
    })
  }

  componentDidUpdate (prevProps) {
    const { language, newLanguage } = this.props
    if (
      !isNil(newLanguage) &&
      !equals(language, newLanguage) &&
      !equals(prevProps.newLanguage, newLanguage)
    ) {
      this.props.settingsActions.updateLanguage(newLanguage)
      this.props.preferencesActions.setLanguage(newLanguage, true)
      this.props.analyticsActions.logEvent([...CHANGE_LANGUAGE, newLanguage])
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
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  settingsActions: bindActionCreators(actions.modules.settings, dispatch),
  preferencesActions: bindActionCreators(actions.preferences, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingsContainer)
