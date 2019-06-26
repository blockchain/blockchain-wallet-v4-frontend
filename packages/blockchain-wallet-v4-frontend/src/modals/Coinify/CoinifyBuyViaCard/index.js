import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { actions } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'

import {
  Button,
  Icon,
  Modal,
  ModalHeader,
  ModalBody,
  Text
} from 'blockchain-info-components'

const WelcomeModalHeader = styled(ModalHeader)`
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
    margin-bottom: 12px;
  }
`
const BuyNowButton = styled(Button)`
  height: 56px;
  margin-top: 24px;
  font-size: 18px;
`
const IconContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 20px 0;
`

class CoinifyBuyViaCard extends React.PureComponent {
  onBuyNow = () => {
    this.props.modalActions.closeModal()
    this.props.routerActions.push('/buy-sell')
  }

  render () {
    const { close, position, total } = this.props
    return (
      <Modal size='xsmall' position={position} total={total}>
        <WelcomeModalHeader onClose={close} />
        <ModalBody>
          <Container>
            <IconContainer>
              <Icon name='cart-filled' size='72px' color='brand-secondary' />
            </IconContainer>
            <Text size='22px' weight={600}>
              <FormattedMessage
                id='modals.coinifybuyviacard.title2'
                defaultMessage='Buy with Cards'
              />
            </Text>
            <Text size='14px' weight={400}>
              <FormattedMessage
                id='modals.coinifybuyviacard.intro2'
                defaultMessage='Introducing buy Bitcoin with cards within your Wallet. Buying & selling with bank is temporarily unavailable.'
              />
            </Text>
            <BuyNowButton nature='primary' fullwidth onClick={this.onBuyNow}>
              <FormattedMessage
                id='modals.coinifybuyviacard.buynow'
                defaultMessage='Buy Now'
              />
            </BuyNowButton>
          </Container>
        </ModalBody>
      </Modal>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  routerActions: bindActionCreators(actions.router, dispatch)
})

const enhance = compose(
  modalEnhancer('CoinifyBuyViaCard'),
  connect(
    null,
    mapDispatchToProps
  )
)

export default enhance(CoinifyBuyViaCard)
