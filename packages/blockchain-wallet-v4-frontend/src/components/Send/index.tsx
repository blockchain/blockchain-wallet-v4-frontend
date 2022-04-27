import React, { memo } from 'react'
import styled from 'styled-components'

import { ADDRESS_TYPES } from '@core/redux/payment/btc/utils'
import { CustodialFromType } from '@core/types'
import { Banner } from 'blockchain-info-components'
import FormGroup from 'components/Form/FormGroup'
import FormLabel from 'components/Form/FormLabel'
import { media } from 'services/styles'

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

export const CustodyToAccountMessage = memo(({ account }: { account: CustodialFromType }) => {
  if (account?.type !== ADDRESS_TYPES.CUSTODIAL) return null
  return <LockTime />
})
