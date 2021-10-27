import React, { memo } from 'react'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'

import { ADDRESS_TYPES } from '@core/redux/payment/btc/utils'
import { CoinType, CustodialFromType } from '@core/types'
import { Banner } from 'blockchain-info-components'
import { FormGroup, FormLabel } from 'components/Form'
import { media } from 'services/styles'

import ExchangePromo from './ExchangePromo'
import LockTime from './LockTime'

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
`
export const ColLeft = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 50%;
  ${media.mobile`
    width: 100%;
  `};
`
export const ColRight = styled(ColLeft)`
  align-items: flex-end;
`
export const AddressButton = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  box-sizing: border-box;
  border: 1px solid ${(props) => props.theme.grey200};

  &:hover {
    background-color: ${(props) => props.theme.grey000};
  }
`
export const FeeFormContainer = styled.div<{ toggled: boolean }>`
  display: flex;
  flex-direction: ${(props) => (props.toggled ? 'column' : 'row')};
  align-items: center;
  justify-content: space-between;
  width: 100%;
`
export const FeeFormGroup = styled(FormGroup)`
  ${media.mobile`
    flex-direction: column;
  `};
`
export const FeeFormLabel = styled(FormLabel)`
  width: 100%;
  display: flex;
  white-space: nowrap;
  > div {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
`
export const FeeOptionsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`
export const FeePerByteContainer = styled.div`
  width: 100%;
  margin-bottom: 10px;
`
export const CustomFeeAlertBanner = styled(Banner)`
  margin-bottom: 18px;
`

export const CustodyToAccountMessage = memo(
  ({
    account
  }: {
    account: CustodialFromType
    // eslint-disable-next-line
  amount?: {
      coin: string
      coinCode: CoinType
      fiat: string
    }
  }) => {
    if (account.type !== ADDRESS_TYPES.CUSTODIAL) return null
    const isAvailableNone = new BigNumber(account.available).isLessThanOrEqualTo('0')
    const isWithdrawableNone = new BigNumber(account.withdrawable).isLessThanOrEqualTo('0')
    const isAvailableEqualToWithdrawable = new BigNumber(account.available).isEqualTo(
      account.withdrawable
    )

    switch (true) {
      // all funds are 'locked'
      case isWithdrawableNone && !isAvailableNone:
      case !isWithdrawableNone && !isAvailableEqualToWithdrawable:
        return <LockTime />
      default:
        return <ExchangePromo />
    }
  }
)
