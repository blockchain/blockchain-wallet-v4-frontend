import { actions } from 'data'
import { bindActionCreators, compose } from 'redux'
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Text
} from 'blockchain-info-components'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import React from 'react'
import styled from 'styled-components'

import { getData } from './selectors'
import Error from './template.error'
import Loading from './template.loading'
import modalEnhancer from 'providers/ModalEnhancer'
import Success from './template.success'

const QRCodeContainer = styled.div`
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  width: 100;
  height: 256px;
  padding: 30px 0;
`

class PairingCodeContainer extends React.PureComponent {
  componentDidMount () {
    this.props.actions.encodePairingCode()
  }

  render () {
    const { data, position, total, closeAll } = this.props

    let PairingCode = data.cata({
      Success: val => <Success val={val} />,
      Failure: message => <Error>{message}</Error>,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })

    return (
      <Modal size='large' position={position} total={total}>
        <ModalHeader icon='request' onClose={closeAll}>
          <FormattedMessage
            id='modals.pairingcode.title1'
            defaultMessage='Mobile Pairing Code'
          />
        </ModalHeader>
        <ModalBody>
          <Text color='grey800' size='14px' weight={500}>
            <FormattedMessage
              id='modals.pairingcode.description'
              defaultMessage='Scan the QR code below with your Blockchain Wallet mobile application.'
            />
          </Text>
          <Text color='error' size='14px' weight={600}>
            <FormattedMessage
              id='modals.pairingcode.warning'
              defaultMessage='Do not share this QR Code with others.'
            />
          </Text>
          <QRCodeContainer>{PairingCode}</QRCodeContainer>
        </ModalBody>
        <ModalFooter>
          <Button
            data-e2e='closeBtn'
            nature='primary'
            fullwidth
            onClick={closeAll}
          >
            <FormattedMessage id='buttons.close' defaultMessage='Close' />
          </Button>
        </ModalFooter>
      </Modal>
    )
  }
}

const mapStateToProps = state => ({
  data: getData(state)
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.core.data.misc, dispatch)
})

const enhance = compose(
  modalEnhancer('PairingCode'),
  connect(mapStateToProps, mapDispatchToProps)
)

export default enhance(PairingCodeContainer)
