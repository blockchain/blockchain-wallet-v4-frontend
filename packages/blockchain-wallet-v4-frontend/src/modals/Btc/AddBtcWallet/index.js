import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { actions } from 'data'
import { formValueSelector } from 'redux-form'
import modalEnhancer from 'providers/ModalEnhancer'
import AddBtcWallet from './template.js'

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
