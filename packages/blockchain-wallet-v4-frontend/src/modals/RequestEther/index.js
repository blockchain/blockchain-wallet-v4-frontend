import React from 'react'
import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { formValueSelector } from 'redux-form'

import modalEnhancer from 'providers/ModalEnhancer'

import { actions, selectors } from 'data'
import RequestEther from './template'

class RequestEtherContainer extends React.Component {
  constructor (props) {
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
  }

  componentWillMount () {
    this.props.formActions.initialize('requestEther', this.props.initialValues)
  }

  componentWillReceiveProps (nextProps) {
    const { coin } = nextProps
    if (coin === 'BTC') {
      this.props.modalActions.closeAllModals()
      this.props.modalActions.showModal('RequestBitcoin')
    }
  }

  onSubmit (e) {
    e.preventDefault()
    this.props.modalActions.closeAllModals()
  }

  render () {
    const { closeAll, selection, coins } = this.props
    return <RequestEther
      {...this.props}
      closeAll={closeAll}
      coins={coins}
      selection={selection}
      onSubmit={this.onSubmit}
    />
  }
}

const mapStateToProps = (state, ownProps) => {
  const getReceive = (state) => selectors.core.kvStore.ethereum.getContext(state)
  const receiveAddress = getReceive(state)[0]
  return {
    initialValues: {
      coin: 'ETH'
    },
    receiveAddress,
    coin: formValueSelector('requestEther')(state, 'coin')
  }
}

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  modalEnhancer('RequestEther')
)

export default enhance(RequestEtherContainer)
