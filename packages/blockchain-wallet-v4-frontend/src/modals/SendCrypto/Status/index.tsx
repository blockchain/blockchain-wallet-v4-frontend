import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'

import { Button, Icon, SpinningLoader, Text } from 'blockchain-info-components'
import { FlyoutWrapper } from 'components/Flyout'
import { selectors } from 'data'
import { SendCryptoStepType } from 'data/components/sendCrypto/types'
import { RootState } from 'data/rootReducer'

import { Props as OwnProps } from '..'

const CustomFlyout = styled(FlyoutWrapper)`
  min-height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
`
const CloseWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  width: 100%;
`
const IconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`
const IconBox = styled.div`
  position: relative;
`
const StatusIcon = styled.div`
  position: absolute;
  top: -9px;
  right: -9px;
  padding: 2px;
  border-radius: 50%;
  background: ${({ theme }) => theme.white};
`

const Status: React.FC<Props> = (props) => {
  const icon = props.transaction.cata({
    Failure: () => <Icon name='close-circle' size='24px' color='red600' />,
    Loading: () => <SpinningLoader height='14px' width='14px' />,
    NotAsked: () => <SpinningLoader height='14px' width='14px' />,
    Success: () => <Icon name='checkmark-circle-filled' size='24px' color='green600' />
  })
  const msg = props.transaction.cata({
    Failure: (e) => (
      <Text color='red600' weight={600}>
        Error: {e}
      </Text>
    ),
    Loading: () => <FormattedMessage id='copy.loading' defaultMessage='Loading...' />,
    NotAsked: () => <FormattedMessage id='copy.loading' defaultMessage='Loading...' />,
    Success: (val) => (
      <>
        {new BigNumber(val.amount.value).plus(val.fee?.value || 0).toString()} {val.amount.symbol}{' '}
        <FormattedMessage id='copy.sent' defaultMessage='Sent' />
      </>
    )
  })

  return (
    <CustomFlyout>
      <CloseWrapper>
        <Icon onClick={props.close} cursor name='close-circle' size='20px' color='grey400' />
      </CloseWrapper>
      <IconWrapper>
        <IconBox>
          <Icon size='72px' name={props.formValues.selectedAccount.coin} />
          <StatusIcon>{icon}</StatusIcon>
        </IconBox>
        <Text style={{ marginTop: '32px' }} size='20px' weight={600} color='grey800'>
          {msg}
        </Text>
      </IconWrapper>
      {props.transaction.cata({
        Failure: () => (
          <Button
            nature='light-red'
            data-e2e='sendTryAgain'
            fullwidth
            jumbo
            onClick={() => props.sendCryptoActions.setStep({ step: SendCryptoStepType.ENTER_TO })}
          >
            <FormattedMessage id='copy.try_again' defaultMessage='Try Again' />
          </Button>
        ),
        Loading: () => <Button hidden fullwidth jumbo data-e2e='' />,
        NotAsked: () => <Button hidden fullwidth jumbo data-e2e='' />,
        Success: (val) => (
          <Button
            nature='light'
            data-e2e='viewDetails'
            fullwidth
            jumbo
            onClick={() => props.routerActions.push(`/${val.amount.symbol}/transactions`)}
          >
            <FormattedMessage id='copy.view_details' defaultMessage='View Details' />
          </Button>
        )
      })}
    </CustomFlyout>
  )
}

const mapStateToProps = (state: RootState) => ({
  transaction: selectors.components.sendCrypto.getTransaction(state)
})

const connector = connect(mapStateToProps)

type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(Status)
