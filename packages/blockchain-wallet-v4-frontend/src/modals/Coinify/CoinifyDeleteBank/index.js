import { actions } from 'data'
import { bindActionCreators, compose } from 'redux'
import { connect } from 'react-redux'
import CoinifyDeleteBank from './template.js'
import modalEnhancer from 'providers/ModalEnhancer'
import React from 'react'

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
    return (
      <CoinifyDeleteBank {...this.props} handleSubmit={this.handleSubmit} />
    )
  }
}

const mapDispatchToProps = dispatch => ({
  coinifyActions: bindActionCreators(actions.components.coinify, dispatch)
})

const enhance = compose(
  modalEnhancer('CoinifyDeleteBank'),
  connect(
    undefined,
    mapDispatchToProps
  )
)

export default enhance(CoinifyDeleteBankContainer)
