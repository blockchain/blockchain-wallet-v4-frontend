import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from 'redux'
import styled from 'styled-components'

import { Button, Icon, SkeletonRectangle, Text } from 'blockchain-info-components'
import CopyClipboardButton from 'components/Clipboard/CopyClipboardButton'
import { FlyoutWrapper } from 'components/Flyout'
import { StepHeader } from 'components/Flyout/SendRequestCrypto'
import { CoinAccountListOption } from 'components/Form'
import QRCodeWrapper from 'components/QRCode/Wrapper'
import { actions, selectors } from 'data'
import { SwapBaseCounterTypes } from 'data/types'

import { Props as OwnProps } from '../index'
import { ClipboardWrapper } from '../model'
import { RequestSteps } from '../types'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`
const AddressWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 16px 40px;
  border-bottom: ${(props) => `1px solid ${props.theme.grey000}`};
  &:first-child {
    border-top: ${(props) => `1px solid ${props.theme.grey000}`};
  }
`
const AddressDisplay = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  overflow-wrap: anywhere;
  word-break: break-all;
  hyphens: none;
`
const InfoContainer = styled.div`
  background: ${(props) => props.theme.grey000};
  margin: 16px 40px 0px 40px;
  padding: 16px;
  border-radius: 8px;
`
const QRCodeContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 40px 0 36px;
  width: 100%;
`
const ButtonsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 40px;

  & > :last-child {
    margin-top: 16px;
  }
`
const AlertWrapper = styled.div`
  flex-direction: column;
  display: flex;
  height: 100%;
  width: 100%;
  justify-content: center;
  align-items: center;
`

class RequestShowAddress extends React.PureComponent<Props> {
  componentDidMount() {
    this.props.requestActions.getNextAddress(this.props.formValues.selectedAccount)
  }

  render() {
    const { formValues, handleClose, setStep, walletCurrency } = this.props
    const { selectedAccount } = formValues
    const { coinfig } = window.coins[selectedAccount.coin]

    return (
      <Wrapper>
        <FlyoutWrapper>
          <StepHeader>
            <Icon
              cursor
              onClick={() => setStep(RequestSteps.COIN_SELECT)}
              name='arrow-back'
              color='grey600'
              size='24px'
              style={{ marginRight: '20px' }}
            />
            <Text size='24px' color='grey800' weight={600}>
              <FormattedMessage
                id='modals.requestcrypto.showaddress.title'
                defaultMessage='Scan or Share'
              />
            </Text>
          </StepHeader>
        </FlyoutWrapper>
        <CoinAccountListOption
          account={selectedAccount}
          coin={selectedAccount.coin}
          displayOnly
          hideActionIcon
          walletCurrency={walletCurrency}
        />
        <AddressWrapper>
          <AddressDisplay>
            <Text color='grey600' size='14px' lineHeight='21px' weight={500}>
              <FormattedMessage id='copy.address' defaultMessage='Address' />
            </Text>
            <Text color='grey800' size='16px' weight={600} lineHeight='24px'>
              {this.props.addressR.cata({
                Failure: () => (
                  <FormattedMessage
                    id='components.alerts.unknown_error'
                    defaultMessage='An error has occurred.'
                  />
                ),
                Loading: () => <SkeletonRectangle width='280px' height='24px' />,
                NotAsked: () => <SkeletonRectangle width='280px' height='24px' />,
                Success: (val) => val.address
              })}
            </Text>
          </AddressDisplay>
          <ClipboardWrapper>
            {this.props.addressR.cata({
              Failure: () => <></>,
              Loading: () => <></>,
              NotAsked: () => <></>,
              Success: (val) => (
                <CopyClipboardButton
                  onClick={() => this.props.requestActions.setAddressCopied()}
                  textToCopy={val.address}
                  color='blue600'
                  size='24px'
                />
              )
            })}
          </ClipboardWrapper>
        </AddressWrapper>
        {this.props.addressR.cata({
          Failure: () => null,
          Loading: () => null,
          NotAsked: () => null,
          Success: (val) =>
            val.extras
              ? Object.keys(val.extras).map((extra) => (
                  <AddressWrapper key={extra}>
                    <AddressDisplay>
                      <Text color='grey600' size='14px' lineHeight='21px' weight={500}>
                        {extra}
                      </Text>
                      <Text color='grey800' size='16px' weight={600} lineHeight='24px'>
                        {val.extras[extra as string]}
                      </Text>
                    </AddressDisplay>
                    <ClipboardWrapper>
                      <CopyClipboardButton
                        onClick={() => this.props.requestActions.setAddressCopied()}
                        textToCopy={val.extras[extra as string]}
                        color='blue600'
                        size='24px'
                      />
                    </ClipboardWrapper>
                  </AddressWrapper>
                ))
              : null
        })}
        {coinfig.type.isMemoBased && selectedAccount.type === SwapBaseCounterTypes.CUSTODIAL && (
          <InfoContainer>
            <Text color='grey600' size='12px' weight={500}>
              <FormattedMessage
                id='modals.requestcrypto.showaddress.memo_required'
                defaultMessage='If you send funds without the {coin} Memo Text, your funds will be lost and not credited to your account. Please send only {coin} to this address.'
                values={{ coin: selectedAccount.coin }}
              />
            </Text>
          </InfoContainer>
        )}
        <QRCodeContainer>
          {this.props.addressR.cata({
            Failure: (err) => (
              <SkeletonRectangle width='306px' height='306px'>
                <AlertWrapper>
                  <Icon name='alert-filled' size='40px' color='red600' />
                  <Text size='16px' weight={500} color='red600'>
                    {err}
                  </Text>
                </AlertWrapper>
              </SkeletonRectangle>
            ),
            Loading: () => <SkeletonRectangle width='306px' height='306px' />,
            NotAsked: () => <SkeletonRectangle width='306px' height='306px' />,
            Success: (val) => (
              <QRCodeWrapper data-e2e='requestAddressQrCode' size={280} value={val.address} />
            )
          })}
        </QRCodeContainer>
        <ButtonsWrapper>
          <Button
            data-e2e='copyRequestLink'
            fullwidth
            height='48px'
            nature='primary'
            onClick={handleClose}
          >
            <Text color='white' size='16px' weight={600}>
              <FormattedMessage id='copy.close' defaultMessage='Close' />
            </Text>
          </Button>
        </ButtonsWrapper>
      </Wrapper>
    )
  }
}

const mapStateToProps = (state, ownProps: OwnProps) => ({
  addressR: selectors.components.request.getNextAddress(state, ownProps.formValues.selectedAccount)
})

const mapDispatchToProps = (dispatch) => ({
  requestActions: bindActionCreators(actions.components.request, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)
type Props = ConnectedProps<typeof connector> &
  OwnProps & {
    handleClose: () => void
    setStep: (step: RequestSteps) => void
  }

export default connector(RequestShowAddress)
