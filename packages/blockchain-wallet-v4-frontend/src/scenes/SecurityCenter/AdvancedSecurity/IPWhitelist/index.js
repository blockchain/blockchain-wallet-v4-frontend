import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { isEmpty } from 'ramda'
import { bindActionCreators } from 'redux'
import { formValueSelector } from 'redux-form'

import { actions, selectors } from 'data'

import IPWhitelist from './template'

class IPWhitelistContainer extends React.PureComponent {
  state = { updateToggled: false }

  componentDidMount(prevProps) {
    if (!isEmpty(this.props.currentWhitelist)) {
      this.props.formActions.initialize('settingIPWhitelist', {
        IPWhitelist: this.props.currentWhitelist
      })
    }
  }

  onSubmit = () => {
    this.props.settingsActions.updateIpLock(this.props.IPWhitelist)
    this.handleToggle()
  }

  handleToggle = () => {
    this.setState({
      updateToggled: !this.state.updateToggled
    })
  }

  render() {
    return (
      <IPWhitelist
        {...this.props}
        onSubmit={this.onSubmit}
        updateToggled={this.state.updateToggled}
        handleToggle={this.handleToggle}
        handleCancel={() => {
          this.props.formActions.reset('settingIPWhitelist')
          this.handleToggle()
        }}
      />
    )
  }
}

const mapStateToProps = state => ({
  currentWhitelist: selectors.core.settings.getIpLock(state).getOrElse(''),
  IPWhitelist: formValueSelector('settingIPWhitelist')(state, 'IPWhitelist')
})

const mapDispatchToProps = dispatch => ({
  settingsActions: bindActionCreators(actions.modules.settings, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})

IPWhitelistContainer.propTypes = {
  currentWhitelist: PropTypes.string
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(IPWhitelistContainer)
