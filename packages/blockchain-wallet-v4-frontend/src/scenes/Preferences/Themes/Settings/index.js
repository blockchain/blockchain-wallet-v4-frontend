import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { actions as reduxFormActions } from 'redux-form'
import { singleForm } from 'providers/FormProvider'
import { equals } from 'ramda'

import { actions, selectors } from 'data'
import Settings from './template.js'

class SettingsContainer extends React.Component {
  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  componentWillMount () {
    this.props.reduxFormActions.initialize('settingTheme', { 'theme': this.props.theme })
  }

  componentWillReceiveProps (nextProps) {
    if (!equals(nextProps.currency, this.props.currency)) {
      this.props.reduxFormActions.change('settingTheme', 'theme', nextProps.currency)
    }
  }

  handleClick (value) {
    this.props.preferencesActions.setTheme(value)
  }

  render () {
    return <Settings {...this.props} handleClick={this.handleClick} />
  }
}

const mapStateToProps = (state) => ({
  theme: selectors.preferences.getTheme(state)
})

const mapDispatchToProps = (dispatch) => ({
  preferencesActions: bindActionCreators(actions.preferences, dispatch),
  reduxFormActions: bindActionCreators(reduxFormActions, dispatch)
})

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  singleForm('settingTheme')
)

export default enhance(SettingsContainer)
