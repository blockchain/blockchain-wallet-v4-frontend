import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { actions } from 'data'
import { formValueSelector } from 'redux-form'
import modalEnhancer from 'providers/ModalEnhancer'
import ImportBtcAddress from './template.js'

class ImportBtcAddressContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
  }

  onSubmit (e) {
    e.preventDefault()
    let { addr, priv, to } = this.props
    this.props.walletActions.importLegacyAddress(addr, priv, to)
  }

  render () {
    return <ImportBtcAddress {...this.props} onSubmit={this.onSubmit} />
  }
}

const selectFormValue = formValueSelector('importBtcAddress')

const mapStateToProps = (state) => ({
  addr: selectFormValue(state, 'from'),
  priv: selectFormValue(state, 'priv'),
  to: selectFormValue(state, 'to'),
  addressType: selectFormValue(state, 'address-type')
})

const mapDispatchToProps = (dispatch) => ({
  walletActions: bindActionCreators(actions.wallet, dispatch)
})

const enhance = compose(connect(mapStateToProps, mapDispatchToProps), modalEnhancer('ImportBtcAddress'))

export default enhance(ImportBtcAddressContainer)
