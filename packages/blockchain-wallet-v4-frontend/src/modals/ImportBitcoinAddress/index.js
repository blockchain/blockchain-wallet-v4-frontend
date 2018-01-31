import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { actions } from 'data'
import { formValueSelector } from 'redux-form'
import modalEnhancer from 'providers/ModalEnhancer'
import ImportBitcoinAddress from './template.js'

class ImportBitcoinAddressContainer extends React.Component {
  constructor (props) {
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
  }

  onSubmit (e) {
    e.preventDefault()
    this.props.walletActions.createLegacyAddress({addr: this.props.address})
  }

  render () {
    return <ImportBitcoinAddress {...this.props} onSubmit={this.onSubmit} />
  }
}

const mapStateToProps = (state) => ({
  address: formValueSelector('importBitcoinAddress')(state, 'address')
})

const mapDispatchToProps = (dispatch) => ({
  walletActions: bindActionCreators(actions.wallet, dispatch)
})

const enhance = compose(connect(mapStateToProps, mapDispatchToProps), modalEnhancer('ImportBitcoinAddress'))

export default enhance(ImportBitcoinAddressContainer)
