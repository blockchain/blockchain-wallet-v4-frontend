import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { formValueSelector } from 'redux-form'
import { isNil, equals } from 'ramda'

import { actions, model, selectors } from 'data'
import Settings from './template'

const { CHANGE_THEME } = model.analytics.PREFERENCE_EVENTS.GENERAL
class SettingsContainer extends React.PureComponent {
  componentDidMount () {
    this.props.formActions.initialize('settingTheme', {
      theme: this.props.theme
    })
  }

  componentDidUpdate (prevProps) {
    const { theme, newTheme } = this.props
    if (
      !isNil(newTheme) &&
      !equals(theme, newTheme) &&
      !equals(prevProps.newTheme, newTheme)
    ) {
      this.props.preferencesActions.setTheme(newTheme)
      this.props.analyticsActions.logEvent([...CHANGE_THEME, newTheme])
    }
  }

  render () {
    return <Settings />
  }
}

const mapStateToProps = state => ({
  theme: selectors.preferences.getTheme(state),
  newTheme: formValueSelector('settingTheme')(state, 'theme')
})

const mapDispatchToProps = dispatch => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  preferencesActions: bindActionCreators(actions.preferences, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingsContainer)
