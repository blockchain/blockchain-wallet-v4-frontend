import { Exchange } from 'blockchain-wallet-v4/src'
import { FormattedMessage } from 'react-intl'
import { OwnProps, SuccessStateType } from '..'
import { Text } from 'blockchain-info-components'
import FiatDisplay from 'components/Display/FiatDisplay'
import React from 'react'
import styled from 'styled-components'

const AmountsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 40px 0;
  > div {
    width: 50%;
  }
`
const AmountsHeader = styled(Text)`
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
  color: ${props => props.theme.grey600};
`

type Props = OwnProps & SuccessStateType

const Info: React.FC<Props> = props => {
  const principalDisplayName =
    props.supportedCoins[props.loan.principal.amount[0].symbol].displayName
  const collateralSatoshi = Exchange.convertBtcToBtc({
    value: Number(props.loan.collateral.amounts[0].value),
    fromUnit: 'BTC',
    toUnit: 'SAT'
  }).value

  return (
    <AmountsContainer>
      <div>
        <AmountsHeader>
          <FormattedMessage
            id='scenes.borrow.details.info.amount'
            defaultMessage='Borrow Amount'
          />
        </AmountsHeader>
        <Text color='grey800' size='20px' weight={600}>
          {props.loan.principal.amount[0].value} {principalDisplayName}
        </Text>
      </div>
      <div>
        <AmountsHeader>
          <FormattedMessage
            id='scenes.borrow.details.info.collateral'
            defaultMessage='Collateral Value'
          />
        </AmountsHeader>
        <FiatDisplay
          color='grey800'
          size='20px'
          weight={600}
          currency='USD'
          coin={props.loan.collateral.amounts[0].symbol}
        >
          {collateralSatoshi}
        </FiatDisplay>
      </div>
    </AmountsContainer>
  )
}

export default Info
