import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { formValueSelector } from 'redux-form'
import { isNil, equals } from 'ramda'

import { actions, selectors } from 'data'
import Settings from './template.js'

class SettingsContainer extends React.PureComponent {
  componentDidMount () {
    this.props.formActions.initialize('settingTheme', {
      theme: this.props.theme
    })
  }

  componentDidUpdate (prevProps) {
    const { theme, newTheme } = this.props
    if (
      !isNil(prevProps.newTheme) &&
      !equals(theme, prevProps.newTheme) &&
      !equals(newTheme, prevProps.newTheme)
    ) {
      this.props.preferencesActions.setTheme(prevProps.newTheme)
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
  preferencesActions: bindActionCreators(actions.preferences, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingsContainer)
