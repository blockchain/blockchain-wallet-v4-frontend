import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'

import { actions } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'

import ShowBtcPrivateKeyTemplate from './template'

const formats = [
  {
    group: '',
    items: [
      { text: 'WIF', value: 'wif' },
      { text: 'Base-58', value: 'base58' }
    ]
  }
]

class ShowBtcPrivateKeyContainer extends Component {
  constructor(props) {
    super(props)
    this.state = { format: 'wif' }
    this.handleChangeFormat = this.handleChangeFormat.bind(this)
  }

  componentWillUnmount() {
    this.props.actions.clearShownBtcPrivateKey()
  }

  handleChangeFormat(format) {
    this.setState({ format })
  }

  render() {
    let step = this.props.priv == null ? 0 : 1
    let nextStep = () => this.props.actions.showBtcPrivateKey(this.props.addr)
    return (
      <ShowBtcPrivateKeyTemplate
        {...this.props}
        step={step}
        format={this.state.format}
        formats={formats}
        onContinue={nextStep}
        onChangeFormat={this.handleChangeFormat}
      />
    )
  }
}

const mapStateToProps = state => ({
  priv: state.securityCenter.shownBtcPrivKey
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.modules.settings, dispatch)
})

const enhance = compose(
  modalEnhancer('ShowBtcPrivateKey'),
  connect(mapStateToProps, mapDispatchToProps)
)

export default enhance(ShowBtcPrivateKeyContainer)
