import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { CoinfigType } from '@core/redux/walletOptions/types'
import { Button, SkeletonCircle, SkeletonRectangle } from 'blockchain-info-components'

import {
  BoxContainer,
  BoxRow,
  BoxRowItemSubTitle,
  BoxRowItemTitle,
  BoxRowWithBorder
} from '../CardDashboard.model'

const SkeletonLoader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 12px 0;
  > div:last-child {
    flex: 1;
    margin-left: 16px;
  }
`

const Loading = () => (
  <>
    <SkeletonLoader>
      <SkeletonCircle height='32px' width='32px' />
      <SkeletonRectangle height='40px' width='100%' />
    </SkeletonLoader>
  </>
)

type Props = {
  coins: CoinfigType[] | undefined
}
const FundsBox = ({ coins }: Props) => {
  return (
    <BoxContainer width='380px'>
      <BoxRowWithBorder>
        <BoxRowItemTitle>
          USDC COIN
          <BoxRowItemSubTitle>Trading Account</BoxRowItemSubTitle>
        </BoxRowItemTitle>
        <BoxRowItemTitle style={{ alignItems: 'end' }}>
          $20.45
          <BoxRowItemSubTitle>19.4839 USDC</BoxRowItemSubTitle>
        </BoxRowItemTitle>
      </BoxRowWithBorder>
      <BoxRow>
        <Button data-e2e='addFunds' nature='primary' margin='auto'>
          <FormattedMessage id='buttons.add_funds' defaultMessage='Add Funds' />
        </Button>
        <Button data-e2e='changeSource' nature='empty-blue' margin='auto'>
          <FormattedMessage id='buttons.change_source' defaultMessage='Change Source' />
        </Button>
      </BoxRow>
    </BoxContainer>
  )
}

export default FundsBox
