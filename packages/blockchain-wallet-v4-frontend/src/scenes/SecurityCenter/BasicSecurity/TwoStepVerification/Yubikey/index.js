import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'

import { getData } from './selectors'
import Yubikey from './template'

class YubikeyContainer extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      successToggled: false,
      updateToggled: false,
      yubikeyCode: ''
    }
    this.handleClick = this.handleClick.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.handleInput = this.handleInput.bind(this)
  }

  componentDidUpdate(prevProps) {
    const next = this.props.data.getOrElse({})
    const prev = prevProps.data.getOrElse({})
    if (next.authType !== prev.authType) {
      this.handleUpdate()
      this.props.triggerSuccess()
      this.props.goBackOnSuccess()
    }
  }

  handleUpdate() {
    this.setState({ successToggled: true })
  }

  handleClick() {
    this.props.modalActions.showModal('TWO_STEP_SETUP_MODAL')
  }

  onSubmit() {
    this.props.securityCenterActions.setYubikey(this.state.yubikeyCode)
  }

  handleInput(e) {
    e.preventDefault()
    this.setState({ yubikeyCode: e.target.value })
  }

  render() {
    return this.props.data.cata({
      Failure: () => null,
      Loading: () => null,
      NotAsked: () => null,
      Success: (value) => (
        <Yubikey
          data={value}
          handleClick={this.handleClick}
          onSubmit={this.onSubmit}
          goBack={this.props.goBack}
          handleInput={this.handleInput}
          value={this.state.yubikeyCode}
          uiState={this.state}
        />
      )
    })
  }
}

const mapStateToProps = (state) => ({
  data: getData(state)
})

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  securityCenterActions: bindActionCreators(actions.modules.securityCenter, dispatch),
  settingsActions: bindActionCreators(actions.core.settings, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(YubikeyContainer)
