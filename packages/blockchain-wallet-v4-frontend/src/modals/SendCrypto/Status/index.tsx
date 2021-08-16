import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'

import { Icon, SpinningLoader, Text } from 'blockchain-info-components'
import { FlyoutWrapper } from 'components/Flyout'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

import { Props as OwnProps } from '..'

const CustomFlyout = styled(FlyoutWrapper)`
  min-height: 100%;
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
        Err: {e}
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
      <IconBox>
        <Icon size='72px' name={props.formValues.selectedAccount.coin} />
        <StatusIcon>{icon}</StatusIcon>
      </IconBox>
      <Text style={{ marginTop: '32px' }} size='20px' weight={600} color='grey800'>
        {msg}
      </Text>
    </CustomFlyout>
  )
}

const mapStateToProps = (state: RootState) => ({
  transaction: selectors.components.sendCrypto.getTransaction(state)
})

const connector = connect(mapStateToProps)

type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(Status)
