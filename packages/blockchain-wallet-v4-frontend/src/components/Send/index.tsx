import React from 'react'
import BigNumber from 'bignumber.js'
import styled, { css } from 'styled-components'

import { Banner } from 'blockchain-info-components'
import { ADDRESS_TYPES } from 'blockchain-wallet-v4/src/redux/payment/btc/utils'
import { CoinType, CustodialFromType } from 'blockchain-wallet-v4/src/types'
import { BlueCartridge } from 'components/Cartridge'
import { FormGroup, FormLabel } from 'components/Form'
import { convertBaseToStandard } from 'data/components/exchange/services'
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
const customCartridge = css`
  display: flex;
  align-items: center;
  font-size: 14px;
`
export const CustomBlueCartridge = styled(BlueCartridge)`
  ${customCartridge}
`

export const CustodyToAccountMessage = ({
  account,
  coin
}: {
  account: CustodialFromType
  // eslint-disable-next-line
  amount?: {
    coin: string
    coinCode: CoinType
    fiat: string
  }
  coin: CoinType
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
      return <LockTime coin={coin} />
    case !isWithdrawableNone && !isAvailableEqualToWithdrawable:
      return (
        <LockTime coin={coin} withdrawable={convertBaseToStandard(coin, account.withdrawable)} />
      )
    default:
      return <ExchangePromo />
  }
}
