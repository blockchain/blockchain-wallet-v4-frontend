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
    this.state = {
      language: this.props.language
    }

    this.handleClick = this.handleClick.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    if (!equals(nextProps.language, this.props.language)) {
      this.props.reduxFormActions.change('settingLanguage', this.props.language)
    }
  }

  handleClick (item) {
    this.setState({ language: item })
  }

  render () {
    const { ...rest } = this.props
    return <Settings
      {...rest}
      handleClick={this.handleClick}
      language={this.state.language}
        />
  }
}

const mapStateToProps = (state) => ({
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
