import React from 'react'
import { connect } from 'react-redux'
import { compose, bindActionCreators } from 'redux'

import settings from 'config'

import { getData } from './selectors'
import { actions } from 'data'
import SendConfirm from './template.js'

import modalEnhancer from 'providers/ModalEnhancer'

class SendConfirmContainer extends React.Component {
  constructor (props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.state = { coin: this.props.coin, total: null }
  }

  componentWillMount () {
    console.log('comp will mount', this.props)
  }

  handleSubmit (e) {
    e.preventDefault()
    const { selection } = this.props.data.data
    const network = settings.NETWORK_ETHEREUM

    switch (this.state.coin) {
      case 'BTC':
        this.props.sendBitcoinActions.sendBitcoin(selection)
        break
      case 'ETH':
        // this.props.sendEtherActions.sendEther(network, data)
        break
      default:
        break
    }
    // this.props.sendBitcoinActions.sendBitcoin(selection)
  }

  render () {
    const { data, ...rest } = this.props
    
    return <SendConfirm {...rest} {...data} handleSubmit={this.handleSubmit} />
  }
}

const mapStateToProps = state => ({
  data: getData(state, this.props),
  initialValues: {
    something: 'hello'
  }
})

const mapDispatchToProps = (dispatch) => ({
  sendBitcoinActions: bindActionCreators(actions.modules.sendBitcoin, dispatch),
  sendEtherActions: bindActionCreators(actions.modules.sendEther, dispatch)
})

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  modalEnhancer('SendConfirm')
)

export default enhance(SendConfirmContainer)
