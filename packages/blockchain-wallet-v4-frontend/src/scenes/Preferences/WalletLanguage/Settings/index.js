import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { formValueSelector } from 'redux-form'
import { isNil, equals } from 'ramda'

import { actions, selectors } from 'data'
import Settings from './template.js'

class SettingsContainer extends React.Component {
  componentWillMount () {
    this.props.formActions.initialize('settingLanguage', { 'language': this.props.language })
  }

  componentWillReceiveProps (nextProps) {
    const { language, newLanguage } = this.props
    if (!isNil(nextProps.newLanguage) && !equals(language, nextProps.newLanguage) && !equals(newLanguage, nextProps.newLanguage)) {
      this.props.settingsActions.updateLanguage(nextProps.newLanguage)
    }
  }

  render () {
    return <Settings {...this.props} />
  }
}

const mapStateToProps = (state) => ({
  language: selectors.core.settings.getLanguage(state),
  newLanguage: formValueSelector('settingLanguage')(state, 'language')
})

const mapDispatchToProps = (dispatch) => ({
  settingsActions: bindActionCreators(actions.modules.settings, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(SettingsContainer)
