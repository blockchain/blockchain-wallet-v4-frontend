import { compose } from 'redux'
import { connect } from 'react-redux'
import { FormattedHTMLMessage, FormattedMessage } from 'react-intl'
import React from 'react'
import styled from 'styled-components'

import { actions, model } from 'data'
import {
  Button,
  Image,
  Modal,
  ModalBody,
  ModalHeader,
  Text
} from 'blockchain-info-components'
import modalEnhancer from 'providers/ModalEnhancer'

const { ETH_AIRDROP_MODAL, RESULTS_MODAL } = model.components.exchangeHistory

const AirdropModalHeader = styled(ModalHeader)`
  position: absolute;
  border: none;
  > span {
    &:hover {
      cursor: pointer;
    }
  }
  z-index: 99;
`
const Container = styled.div`
  text-align: center;
  > div:nth-child(2) {
    margin: 8px 0;
  }
`
const SummaryText = styled(Text)`
  margin: 16px 0 24px;
  line-height: 18px;
`

const ViewTradeButton = styled(Button)`
  height: 44px;
  font-size: 16px;
`

class EthAirdrop extends React.PureComponent {
  onViewTradeStatus = () => {
    this.props.closeModal()
    this.props.showExchangeResultsModal(this.props.tradeData)
  }

  render () {
    const { close, position, total } = this.props
    return (
      <Modal size='small' position={position} total={total}>
        <AirdropModalHeader onClose={close} />
        <ModalBody>
          <Container>
            <Image
              name='eth-airdrop'
              srcset={{
                'eth-airdrop2': '2x'
              }}
            />
            <Text size='28px' weight={300} color='brand-primary'>
              <FormattedMessage
                id='modals.exchange.ethairdrop.success'
                defaultMessage='Success!'
              />
            </Text>
            <Text size='14px' weight={300} color='brand-primary'>
              <FormattedMessage
                id='modals.exchange.ethairdrop.firstorder'
                defaultMessage='Your first USD Pax order has been placed!'
              />
            </Text>
            <SummaryText size='13px' weight={300}>
              <FormattedHTMLMessage
                id='modals.exchange.ethairdrop.explain'
                defaultMessage='Even better, since you need <b>ETH</b> to make <b>USD Pax</b> trades, we will airdrop enough <b>ETH</b> into your Wallet to cover your first 3 transactions 🙌🏻'
              />
            </SummaryText>
            <ViewTradeButton
              nature='primary'
              fullwidth
              onClick={this.onViewTradeStatus}
            >
              <FormattedMessage
                id='modals.exchange.ethairdrop.viewtrade'
                defaultMessage='View Trade Status'
              />
            </ViewTradeButton>
          </Container>
        </ModalBody>
      </Modal>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  closeModal: () => dispatch(actions.modals.closeAllModals()),
  showExchangeResultsModal: tradeData =>
    dispatch(actions.modals.showModal(RESULTS_MODAL, tradeData))
})

const enhance = compose(
  modalEnhancer(ETH_AIRDROP_MODAL),
  connect(
    null,
    mapDispatchToProps
  )
)

export default enhance(EthAirdrop)
