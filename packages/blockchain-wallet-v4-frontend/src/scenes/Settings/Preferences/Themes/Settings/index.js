import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { formValueSelector } from 'redux-form'
import { isNil, equals } from 'ramda'

import { actions, selectors } from 'data'
import Settings from './template.js'

class SettingsContainer extends React.PureComponent {
  componentWillMount () {
    this.props.formActions.initialize('settingTheme', { 'theme': this.props.theme })
  }

  componentWillReceiveProps (nextProps) {
    const { theme, newTheme } = this.props
    if (!isNil(nextProps.newTheme) && !equals(theme, nextProps.newTheme) && !equals(newTheme, nextProps.newTheme)) {
      this.props.preferencesActions.setTheme(nextProps.newTheme)
    }
  }

  render () {
    return <Settings {...this.props} />
  }
}

const mapStateToProps = (state) => ({
  theme: selectors.preferences.getTheme(state),
  newTheme: formValueSelector('settingTheme')(state, 'theme')
})

const mapDispatchToProps = (dispatch) => ({
  preferencesActions: bindActionCreators(actions.preferences, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(SettingsContainer)
