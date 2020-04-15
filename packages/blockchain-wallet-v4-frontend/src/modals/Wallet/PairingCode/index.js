import { actions } from 'data'
import { bindActionCreators, compose } from 'redux'
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader
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
    const { data, position, total, close, closeAll } = this.props

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
            id='modals.pairingcode.title'
            defaultMessage='Scan Pairing Code'
          />
        </ModalHeader>
        <ModalBody>
          <QRCodeContainer>{PairingCode}</QRCodeContainer>
        </ModalBody>
        <ModalFooter>
          <Button nature='primary' fullwidth onClick={close}>
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
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)

export default enhance(PairingCodeContainer)
