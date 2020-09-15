import { bindActionCreators, compose } from 'redux'
import { connect } from 'react-redux'
import React from 'react'
import styled from 'styled-components'

import { actions, model } from 'data'
import {
  BlockchainLoader,
  Modal,
  ModalBody,
  ModalHeader
} from 'blockchain-info-components'
import { getData } from './selectors'
import DataError from 'components/DataError'
import ExchangeConfirm from './template'
import modalEnhancer from 'providers/ModalEnhancer'

const { CONFIRM_MODAL } = model.components.exchange

const Loader = styled(BlockchainLoader)`
  align-self: center;
  margin: 50px auto;
`
const Body = styled(ModalBody)`
  padding-top: 0px;
`
const Header = styled(ModalHeader)`
  padding: 20px 20px 0 0;
  border-bottom: 0px;
`
class ExchangeConfirmContainer extends React.PureComponent {
  state = {
    showOrderInfo: false
  }

  toggleShowOrderInfo = () => {
    this.setState({ showOrderInfo: !this.state.showOrderInfo })
  }

  render () {
    const { showOrderInfo } = this.state
    const { data, actions, close, position, total } = this.props
    const ConfirmCata = data.cata({
      Success: value => (
        <ExchangeConfirm
          {...value}
          close={close}
          onSubmit={actions.confirmExchange}
          showOrderInfo={showOrderInfo}
          toggleShowOrderInfo={this.toggleShowOrderInfo}
        />
      ),
      Failure: message => <DataError message={message} />,
      Loading: () => <Loader width='100px' height='100px' />,
      NotAsked: () => <Loader width='100px' height='100px' />
    })

    return (
      <Modal size='small' total={total} position={position}>
        <Header onClose={close} />
        <Body>{ConfirmCata}</Body>
      </Modal>
    )
  }
}

const mapStateToProps = state => ({
  data: getData(state)
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.exchange, dispatch)
})

const enhance = compose(
  modalEnhancer(CONFIRM_MODAL),
  connect(mapStateToProps, mapDispatchToProps)
)

export default enhance(ExchangeConfirmContainer)
