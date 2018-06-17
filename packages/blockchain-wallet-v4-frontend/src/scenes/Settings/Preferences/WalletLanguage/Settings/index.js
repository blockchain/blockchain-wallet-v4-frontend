import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { formValueSelector } from 'redux-form'
import { isNil, equals } from 'ramda'

import { actions } from 'data'
import Settings from './template.js'

class SettingsContainer extends React.PureComponent {
  componentWillMount () {
    this.props.formActions.initialize('settingLanguage', { 'language': this.props.language })
  }

  componentWillReceiveProps (nextProps) {
    const { language, newLanguage } = this.props
    if (!isNil(nextProps.newLanguage) && !equals(language, nextProps.newLanguage) && !equals(newLanguage, nextProps.newLanguage)) {
      this.props.settingsActions.updateLanguage(nextProps.newLanguage)
      this.props.preferencesActions.setLanguage(nextProps.newLanguage)
    }
  }

  render () {
    return <Settings />
  }
}

const mapStateToProps = (state) => ({
  newLanguage: formValueSelector('settingLanguage')(state, 'language')
})

const mapDispatchToProps = (dispatch) => ({
  settingsActions: bindActionCreators(actions.modules.settings, dispatch),
  preferencesActions: bindActionCreators(actions.preferences, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(SettingsContainer)
