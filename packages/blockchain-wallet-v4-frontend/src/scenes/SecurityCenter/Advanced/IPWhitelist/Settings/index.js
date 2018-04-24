
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { formValueSelector } from 'redux-form'
import ui from 'redux-ui'
import { equals, isEmpty } from 'ramda'

import { actions, selectors } from 'data'
import Settings from './template.js'

class SettingsContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
    this.handleToggle = this.handleToggle.bind(this)
  }

  componentWillMount () {
    if (!isEmpty(this.props.currentWhitelist)) {
      this.props.formActions.initialize('settingIPWhitelist', { IPWhitelist: this.props.currentWhitelist.data })
    }
  }

  componentWillReceiveProps (nextProps) {
    if (!equals(this.props.currentWhitelist, nextProps.currentWhitelist)) {
      this.props.updateUI({ updateToggled: false })
    }
  }

  handleClick () {
    this.props.settingsActions.updateIpLock(this.props.IPWhitelist)
    this.handleToggle()
  }

  handleToggle () {
    this.props.updateUI({ updateToggled: !this.props.ui.updateToggled })
  }

  render () {
    const { ui, ...rest } = this.props
    return <Settings
      {...rest}
      updateToggled={ui.updateToggled}
      handleToggle={this.handleToggle}
      handleClick={this.handleClick}
      handleCancel={() => { this.props.formActions.reset('settingIPWhitelist'); this.handleToggle() }}
    />
  }
}

const mapStateToProps = (state) => ({
  currentWhitelist: selectors.core.settings.getIpLock(state),
  IPWhitelist: formValueSelector('settingIPWhitelist')(state, 'IPWhitelist')
})

const mapDispatchToProps = (dispatch) => ({
  settingsActions: bindActionCreators(actions.modules.settings, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  ui({ key: 'Setting_IPWhitelist', state: { updateToggled: false, verifyToggled: false } })
)

SettingsContainer.propTypes = {
  currentWhitelist: PropTypes.string
}

export default enhance(SettingsContainer)
