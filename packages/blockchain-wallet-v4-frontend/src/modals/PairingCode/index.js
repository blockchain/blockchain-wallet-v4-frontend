import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { getData } from './selectors'
import { actions } from 'data'
import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'blockchain-info-components'

import modalEnhancer from 'providers/ModalEnhancer'

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
  componentWillMount () {
    this.props.actions.encodePairingCode()
  }

  render () {
    const { data, position, total, close, closeAll } = this.props

    let PairingCode = data.cata({
      Success: (val) => <Success val={val} />,
      Failure: (message) => <Error>{message}</Error>,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })

    return (
      <Modal size='large' position={position} total={total}>
        <ModalHeader icon='request' onClose={closeAll}>
          <FormattedMessage id='modals.pairingcode.title' defaultMessage='Scan Pairing Code' />
        </ModalHeader>
        <ModalBody>
          <QRCodeContainer>
            {PairingCode}
          </QRCodeContainer>
        </ModalBody>
        <ModalFooter>
          <Button nature='primary' fullwidth onClick={close}>
            <FormattedMessage id='modals.pairingcode.close' defaultMessage='Close' />
          </Button>
        </ModalFooter>
      </Modal>
    )
  }
}

const mapStateToProps = (state) => ({
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
