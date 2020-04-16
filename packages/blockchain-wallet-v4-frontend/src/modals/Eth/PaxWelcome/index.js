import { bindActionCreators, compose } from 'redux'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import React from 'react'
import styled from 'styled-components'

import { actions } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'

import {
  Button,
  Image,
  Modal,
  ModalBody,
  ModalHeader,
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
    margin: -8px 0 8px;
  }
`
const GetButton = styled(Button)`
  height: 56px;
  margin-top: 44px;
  font-size: 18px;
`
const BannerImage = styled(Image)`
  height: 25%;
`

class PaxWelcomeContainer extends React.PureComponent {
  onGetPax = () => {
    this.props.modalActions.closeModal()
    this.props.routerActions.push('/usd-d/transactions')
  }

  render () {
    const { close, position, total } = this.props
    return (
      <Modal size='small' position={position} total={total}>
        <WelcomeModalHeader onClose={close} />
        <ModalBody>
          <Container>
            <BannerImage name='coin-pax' />
            <Text size='20px' weight={400}>
              <FormattedMessage
                id='modals.usddwelcome.intro'
                defaultMessage='Introducing USD Digital, a safe and stable digital dollar in your wallet'
              />
            </Text>
            <GetButton nature='primary' fullwidth onClick={this.onGetPax}>
              <FormattedMessage
                id='buttons.learn_more'
                defaultMessage='Learn More'
              />
            </GetButton>
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
  modalEnhancer('PaxWelcome'),
  connect(
    null,
    mapDispatchToProps
  )
)

export default enhance(PaxWelcomeContainer)
