import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import styled from 'styled-components'

import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Text
} from 'blockchain-info-components'
import { actions } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'

import { getData } from './selectors'
import Error from './template.error'
import Loading from './template.loading'
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
const WarningBody = styled.div`
  display: flex;
`
const WarningCopy = styled.div`
  margin-left: 16px;
  > div {
    margin-bottom: 15px;
  }
`
const WarningCircle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: ${(props) => props.size};
  height: ${(props) => props.size};
  border-radius: ${(props) => props.size};
  background: ${(props) => props.theme[props.color]};
`
class PairingCodeContainer extends React.PureComponent {
  state = { showCode: false }

  componentDidMount() {
    this.props.actions.encodePairingCode()
  }

  handleClick = () => {
    this.setState({ showCode: !this.state.showCode })
  }

  render() {
    const { closeAll, data, position, total } = this.props

    const PairingCode = data.cata({
      Failure: (message) => <Error>{message}</Error>,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />,
      Success: (val) => <Success val={val} />
    })

    return (
      <Modal size='large' position={position} total={total}>
        <ModalHeader onClose={closeAll}>
          {this.state.showCode ? (
            <FormattedMessage
              id='scenes.settings.general.pairingcode.settings.scan'
              defaultMessage='Scan Pairing Code'
            />
          ) : (
            <FormattedMessage id='modals.pairingcode.title' defaultMessage='Pairing Code' />
          )}
        </ModalHeader>
        <ModalBody>
          <WarningBody>
            <WarningCircle color='red100' size='35px'>
              <WarningCircle color='red400' size='20px'>
                <Text color='white' size='14px' weight={600}>
                  !
                </Text>
              </WarningCircle>
            </WarningCircle>
            <WarningCopy>
              <Text color='error' weight={600} lineHeight='1.5'>
                <FormattedMessage
                  id='scenes.settings.general.pairingcode.warningone'
                  defaultMessage='Never share your mobile pairing QR code with anyone.'
                />
              </Text>
              <Text color='error' weight={600} lineHeight='1.5'>
                <FormattedMessage
                  id='scenes.settings.general.pairingcode.warningtwo'
                  defaultMessage='Anyone who can view this QR code can withdraw funds.'
                />
              </Text>
              <Text color='error' weight={600} lineHeight='1.5'>
                <FormattedMessage
                  id='scenes.settings.general.pairingcode.warningthree'
                  defaultMessage='Blockchain.com will never ask to view or receive your mobile pairing QR code.'
                />
              </Text>
            </WarningCopy>
          </WarningBody>
          {this.state.showCode && <QRCodeContainer>{PairingCode}</QRCodeContainer>}
        </ModalBody>
        <ModalFooter>
          {!this.state.showCode && (
            <Button data-e2e='showCode' nature='primary' fullwidth onClick={this.handleClick}>
              <FormattedMessage
                id='scenes.settings.general.pairingcode.settings.show'
                defaultMessage='Show Pairing Code'
              />
            </Button>
          )}
          {this.state.showCode && (
            <Button data-e2e='closeBtn' nature='primary' fullwidth onClick={closeAll}>
              <FormattedMessage id='buttons.close' defaultMessage='Close' />
            </Button>
          )}
        </ModalFooter>
      </Modal>
    )
  }
}

const mapStateToProps = (state) => ({
  data: getData(state)
})

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions.core.data.misc, dispatch)
})

const enhance = compose(
  modalEnhancer('PAIRING_CODE_MODAL'),
  connect(mapStateToProps, mapDispatchToProps)
)

export default enhance(PairingCodeContainer)
