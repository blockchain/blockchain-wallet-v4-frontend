import { actions } from 'data'
import { bindActionCreators, compose } from 'redux'
import { connect } from 'react-redux'
import { formValueSelector } from 'redux-form'
import AddBtcWallet from './template.js'
import modalEnhancer from 'providers/ModalEnhancer'
import React from 'react'

class AddBtcWalletContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
  }

  onSubmit () {
    this.props.actions.newHDAccount(this.props.wallet)
  }

  render () {
    return <AddBtcWallet {...this.props} onSubmit={this.onSubmit} />
  }
}

const mapStateToProps = state => ({
  wallet: formValueSelector('addBtcWallet')(state, 'wallet')
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.modules.settings, dispatch)
})

const enhance = compose(
  modalEnhancer('AddBtcWallet'),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)

export default enhance(AddBtcWalletContainer)
