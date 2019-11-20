import { actions } from 'data'
import { bindActionCreators, compose } from 'redux'
import { connect } from 'react-redux'
import modalEnhancer from 'providers/ModalEnhancer'
import React, { Component } from 'react'
import ShowBchPrivateKeyTemplate from './template'

const formats = [
  {
    group: '',
    items: [{ text: 'WIF', value: 'wif' }, { text: 'Base-58', value: 'base58' }]
  }
]

class ShowBchPrivateKeyContainer extends Component {
  constructor (props) {
    super(props)
    this.state = { format: 'wif' }
    this.handleChangeFormat = this.handleChangeFormat.bind(this)
  }

  componentWillUnmount () {
    this.props.actions.clearShownBchPrivateKey()
  }

  handleChangeFormat (format) {
    this.setState({ format })
  }

  render () {
    let step = this.props.priv == null ? 0 : 1
    let nextStep = () =>
      this.props.actions.showBchPrivateKey(this.props.addr, this.props.bchAddr)
    return (
      <ShowBchPrivateKeyTemplate
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
  priv: state.securityCenter.shownBchPrivKey
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.modules.settings, dispatch)
})

const enhance = compose(
  modalEnhancer('ShowBchPrivateKey'),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)

export default enhance(ShowBchPrivateKeyContainer)
