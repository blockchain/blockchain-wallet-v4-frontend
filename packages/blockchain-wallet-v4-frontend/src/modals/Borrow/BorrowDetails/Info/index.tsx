import { Exchange } from 'blockchain-wallet-v4/src'
import { FormattedMessage } from 'react-intl'
import { OfferType } from 'core/types'
import { OwnProps, SuccessStateType } from '..'
import { Props } from '../template.success'
import { Text } from 'blockchain-info-components'
import CollateralizationBar from '../CollateralizationBar'
import CollateralWarning from '../CollateralWarning'
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

const Info: React.FC<Props & { offer: OfferType }> = props => {
  const principalDisplayName =
    props.supportedCoins[props.loan.principal.amount[0].symbol].displayName
  const collateralSatoshi = Exchange.convertBtcToBtc({
    value: Number(props.loan.collateral.amounts[0].value),
    fromUnit: 'BTC',
    toUnit: 'SAT'
  }).value

  return (
    <>
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
      <Text size='16px' color='grey600' weight={600}>
        <FormattedMessage
          id='scenes.borrow.details.info.collateralization'
          defaultMessage='Collateralization'
        />
      </Text>
      <CollateralizationBar {...props} showPercentages />
      <CollateralWarning {...props} />
    </>
  )
}

export default Info
