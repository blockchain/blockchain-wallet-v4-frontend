import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { actions } from 'data'
import { formValueSelector } from 'redux-form'
import modalEnhancer from 'providers/ModalEnhancer'
import AddBitcoinWallet from './template.js'

class AddBitcoinWalletContainer extends React.PureComponent {
  constructor(props) {
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
  }

  onSubmit() {
    this.props.actions.newHDAccount(this.props.wallet)
  }

  render() {
    return <AddBitcoinWallet {...this.props} onSubmit={this.onSubmit} />
  }
}

const mapStateToProps = state => ({
  wallet: formValueSelector('addBitcoinWallet')(state, 'wallet')
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.modules.settings, dispatch)
})

const enhance = compose(
  modalEnhancer('AddBitcoinWallet'),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)

export default enhance(AddBitcoinWalletContainer)
