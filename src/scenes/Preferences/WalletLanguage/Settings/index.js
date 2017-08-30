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
    this.props.reduxFormActions.initialize('settingLanguage', { 'language': this.props.language })
  }

  componentWillReceiveProps (nextProps) {
    if (!equals(nextProps.language, this.props.language)) {
      this.props.reduxFormActions.change('settingLanguage', 'language', nextProps.language)
    }
  }

  handleClick (value) {
    const { guid, sharedKey } = this.props
    this.props.settingsActions.updateLanguage(guid, sharedKey, value)
  }

  render () {
    return <Settings {...this.props} handleClick={this.handleClick} />
  }
}

const mapStateToProps = (state) => ({
  guid: selectors.core.wallet.getGuid(state),
  sharedKey: selectors.core.wallet.getSharedKey(state),
  language: selectors.core.settings.getLanguage(state)
})

const mapDispatchToProps = (dispatch) => ({
  settingsActions: bindActionCreators(actions.core.settings, dispatch),
  reduxFormActions: bindActionCreators(reduxFormActions, dispatch)
})

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  singleForm('settingLanguage')
)

export default enhance(SettingsContainer)
