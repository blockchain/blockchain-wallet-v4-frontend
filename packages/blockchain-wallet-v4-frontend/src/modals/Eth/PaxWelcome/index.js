import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { actions } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'

import {
  Button,
  Image,
  Modal,
  ModalHeader,
  ModalBody
} from 'blockchain-info-components'

const WelcomeModalHeader = styled(ModalHeader)`
  position: absolute;
  border: 0;
  > span {
    color: ${props => props.theme['gray-1']};
  }
`
const Container = styled.div`
  text-align: center;
  > div:nth-child(2) {
    margin: 10px 0 20px 0;
  }
`

class PaxWelcomeContainer extends React.PureComponent {
  onGetPax = () => {
    this.props.modalActions.closeModal()
    this.props.routerActions.push('/swap')
  }

  render () {
    const { close, position, total } = this.props
    return (
      <Modal size='medium' position={position} total={total}>
        <WelcomeModalHeader onClose={close} />
        <Image name='airdrop-welcome' width='100%' />
        <ModalBody>
          <Container>
            <Button nature='primary' fullwidth onClick={this.onGetPax}>
              <FormattedMessage
                id='modals.paxwelcome.getpax'
                defaultMessage='Get USD Pax'
              />
            </Button>
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
