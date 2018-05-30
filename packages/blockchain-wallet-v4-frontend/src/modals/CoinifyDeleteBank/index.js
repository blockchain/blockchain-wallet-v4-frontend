import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { actions } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'
import CoinifyDeleteBank from './template.js'

class CoinifyDeleteBankContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit () {
    this.props.close()
    this.props.coinifyActions.deleteBankAccount(this.props.bankAccount)
  }

  render () {
    return <CoinifyDeleteBank {...this.props} handleSubmit={this.handleSubmit} />
  }
}

const mapDispatchToProps = (dispatch) => ({
  coinifyActions: bindActionCreators(actions.modules.coinify, dispatch)
})

const enhance = compose(
  modalEnhancer('CoinifyDeleteBank'),
  connect(undefined, mapDispatchToProps)
)

export default enhance(CoinifyDeleteBankContainer)
