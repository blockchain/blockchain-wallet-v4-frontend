import React, { Component } from 'react'
import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import modalEnhancer from 'providers/ModalEnhancer'
import { actions } from 'data'
import ShowPrivateKeyTemplate from './template'

const formats = [{
  group: '',
  items: [
    { text: 'WIF', value: 'wif' },
    { text: 'Base-58', value: 'base58' }
  ]
}]

class ShowPrivateKeyContainer extends Component {
  constructor (props) {
    super(props)
    this.state = { format: 'wif' }
    this.handleChangeFormat = this.handleChangeFormat.bind(this)
  }

  componentWillUnmount () {
    this.props.actions.clearShownPrivateKey()
  }

  handleChangeFormat (format) {
    this.setState({ format })
  }

  render () {
    let step = this.props.priv == null ? 0 : 1
    let nextStep = () => this.props.actions.showPrivateKey(this.props.addr)
    return (
      <ShowPrivateKeyTemplate
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

const mapState = (state) => ({
  priv: state.securityCenter.shownPrivKey
})

const mapDispatch = (dispatch) => ({
  actions: bindActionCreators(actions.modules.settings, dispatch)
})

const enhance = compose(
  connect(mapState, mapDispatch),
  modalEnhancer('ShowPrivateKey')
)

export default enhance(ShowPrivateKeyContainer)
