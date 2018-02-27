import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { actions, selectors } from 'data'
import { formValueSelector } from 'redux-form'
import modalEnhancer from 'providers/ModalEnhancer'
import ImportBtcAddress from './template.js'
import { getData } from './selectors'
import { Remote } from 'blockchain-wallet-v4/src'
import { updateUnspent, updateEffectiveBalance, updateSelection } from './services'

class ImportBtcAddressContainer extends React.Component {
  constructor (props) {
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
  }

  componentWillMount () {
    this.props.dataBitcoinActions.fetchFee()
    this.props.dataBitcoinActions.fetchUnspent(this.props.defaultAccountIndex)
  }

  componentWillReceiveProps (nextProps) {
    if (Remote.Success.is(nextProps.data)) {
      // We fetch the unspent
      updateUnspent(this.props, nextProps)
      // update effective Balance
      updateEffectiveBalance(this.props, nextProps)
      // update selection
      updateSelection(this.props, nextProps, this.seed)
    }
  }

  onSubmit (e) {
    e.preventDefault()
    const { to, priv, from, selection } = this.props
    if (to) this.props.sendBitcoinActions.sendBitcoin(selection)
    else this.props.walletActions.createLegacyAddress({addr: from, priv: priv})
  }

  render () {
    return <ImportBtcAddress {...this.props} onSubmit={this.onSubmit} />
  }
}

const mapStateToProps = (state) => ({
  data: getData(state),
  from: formValueSelector('importBtcAddress')(state, 'from'),
  to: formValueSelector('importBtcAddress')(state, 'to'),
  priv: formValueSelector('importBtcAddress')(state, 'priv'),
  selection: selectors.core.data.bitcoin.getSelection(state),
  defaultAccountIndex: selectors.core.wallet.getDefaultAccountIndex(state),
  addressType: formValueSelector('importBtcAddress')(state, 'address-type')
})

const mapDispatchToProps = (dispatch) => ({
  walletActions: bindActionCreators(actions.wallet, dispatch),
  dataBitcoinActions: bindActionCreators(actions.core.data.bitcoin, dispatch),
  sendBitcoinActions: bindActionCreators(actions.modules.sendBitcoin, dispatch)
})

const enhance = compose(connect(mapStateToProps, mapDispatchToProps), modalEnhancer('ImportBtcAddress'))

export default enhance(ImportBtcAddressContainer)
