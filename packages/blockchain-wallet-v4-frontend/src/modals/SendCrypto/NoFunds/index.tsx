import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { IconCloseCircleV2, Padding, PaletteColors } from '@blockchain-com/constellation'
import { bindActionCreators } from 'redux'
import styled from 'styled-components'

import { Button, Image, Text } from 'blockchain-info-components'
import { FlyoutWrapper } from 'components/Flyout'
import {
  FlyoutContainer,
  FlyoutContent,
  FlyoutFooter,
  FlyoutSubHeader
} from 'components/Flyout/Layout'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { ModalName } from 'data/types'

import { Title } from '../../components'
import { Props as OwnProps } from '..'

const HeaderWrapper = styled(FlyoutWrapper)`
  flex-direction: row;
  justify-content: space-between;
  display: flex;
  max-width: 480px;
  background-color: ${(props) => props.theme.white};
`

const CloseIconContainer = styled.div`
  cursor: pointer;
`

const ImageWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-bottom: 18px;
`

const NoFunds = (props: Props) => {
  const { close, isKycVerificationEnabled } = props
  return (
    <FlyoutContainer>
      <HeaderWrapper>
        <Title color='textBlack'>
          <FormattedMessage id='buttons.send' defaultMessage='Send' />
        </Title>
        <CloseIconContainer onClick={() => close()}>
          <IconCloseCircleV2 color={PaletteColors['grey-600']} label='close' size='medium' />
        </CloseIconContainer>
      </HeaderWrapper>

      <FlyoutContent mode='top'>
        <ImageWrapper>
          <Image name='send-no-funds' size='254px' />
        </ImageWrapper>

        <FlyoutSubHeader
          data-e2e='sendCryptoSubHeader'
          title={
            <Text size='20px' color='grey900' weight={600} style={{ textAlign: 'center' }}>
              <FormattedMessage
                id='modals.sendcrypto.no_funds.title'
                defaultMessage='Looks like you don’t have funds yet'
              />
            </Text>
          }
          subTitle={
            <>
              <Text size='16px' color='grey600' weight={500} style={{ textAlign: 'center' }}>
                <FormattedMessage
                  id='modals.sendcrypto.no_funds.subtitle'
                  defaultMessage='Buy or Receive crypto to fund your wallet.'
                />
              </Text>
            </>
          }
        />
      </FlyoutContent>

      <FlyoutFooter collapsed>
        {isKycVerificationEnabled && (
          <Padding bottom={0.5}>
            <Button
              data-e2e='sendNoFundsBuyCrypto'
              nature='primary'
              onClick={() => {
                props.modalActions.closeModal(ModalName.SEND_CRYPTO_MODAL)
                props.modalActions.showModal(ModalName.SIMPLE_BUY_MODAL, {
                  origin: 'Send'
                })
              }}
              fullwidth
            >
              <FormattedMessage id='buttons.buy_crypto' defaultMessage='Buy Crypto' />
            </Button>
          </Padding>
        )}
        <Button
          data-e2e='sendNoFundsReceiveCrypto'
          nature='empty-blue'
          onClick={() => {
            props.modalActions.closeModal(ModalName.SEND_CRYPTO_MODAL)
            props.modalActions.showModal(ModalName.REQUEST_CRYPTO_MODAL, {
              origin: 'Send'
            })
          }}
          fullwidth
        >
          <FormattedMessage id='buttons.receive_crypto' defaultMessage='Receive Crypto' />
        </Button>
      </FlyoutFooter>
    </FlyoutContainer>
  )
}

const mapStateToProps = (state: RootState) => ({
  isKycVerificationEnabled: selectors.custodial.isKycVerificationEnabled(state)
})

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type Props = ConnectedProps<typeof connector> & OwnProps

export default connector(NoFunds)
