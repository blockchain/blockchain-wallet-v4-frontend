
import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { actions } from 'data'
import Yubikey from './template.success'
import { getData } from './selectors'
import Error from './template.error'
import Loading from './template.loading'
import ui from 'redux-ui'

class YubikeyContainer extends React.Component {
  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleInput = this.handleInput.bind(this)

    this.state = { yubikeyCode: '' }
  }

  componentWillReceiveProps (nextProps) {
    const next = nextProps.data.data
    const prev = this.props.data.data
    if (next.authType !== prev.authType) {
      this.props.updateUI({ successToggled: true })
      setTimeout(function () {
        nextProps.reset()
        nextProps.goBackOnSuccess()
        nextProps.handleGoBack()
      }, 1500)
    }
  }

  handleClick () {
    this.props.modalActions.showModal('TwoStepSetup')
  }

  handleSubmit (e) {
    e.preventDefault()
    this.props.securityCenterActions.setYubikey(this.state.yubikeyCode)
  }

  handleInput (e) {
    e.preventDefault()
    this.setState({ yubikeyCode: e.target.value })
  }

  render () {
    const { data, ui, ...rest } = this.props

    return data.cata({
      Success: (value) => <Yubikey
        data={value}
        handleClick={this.handleClick}
        handleSubmit={this.handleSubmit}
        goBack={this.props.goBack}
        handleInput={this.handleInput}
        value={this.state.yubikeyCode}
        ui={ui}
      />,
      Failure: (message) => <Error {...rest}
        message={message} />,
      Loading: () => <Loading {...rest} />,
      NotAsked: () => <Loading {...rest} />
    })
  }
}

const mapStateToProps = (state) => ({
  data: getData(state)
})

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  settingsActions: bindActionCreators(actions.core.settings, dispatch),
  securityCenterActions: bindActionCreators(actions.modules.securityCenter, dispatch)
})

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  ui({ key: 'Security_TwoFactor', state: { updateToggled: false, successToggled: false } })
)

export default enhance(YubikeyContainer)
