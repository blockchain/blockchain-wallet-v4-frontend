import React from 'react'
import { FormattedHTMLMessage, FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Button, Icon, Text } from 'blockchain-info-components'
import { fiatToString } from 'blockchain-wallet-v4/src/exchange/currency'
import { FiatType } from 'blockchain-wallet-v4/src/types'
import { model } from 'data'

import { percentageFormatter } from '../CollateralizationBar'
import { Props } from '../template.success'

const {
  getCollateralAmtRequired,
  getCollateralizationDisplayName,
  isLastTxStatus
} = model.components.borrow

const Container = styled.div<{ bgColor: string; borderColor?: string }>`
  display: flex;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 40px;
  background-color: ${props => props.theme[props.bgColor]};
  border: 1px solid ${props => props.theme[props.borderColor || props.bgColor]};

  .orange900 {
    color: ${props => props.theme.orange900};
  }

  .green600 {
    color: ${props => props.theme.green600};
  }

  .grey900 {
    color: ${props => props.theme.grey900};
  }
`
const CustomIcon = styled(Icon)`
  margin-right: 16px;
  margin-top: 3px;
`
const CustomButton = styled(Button)`
  margin-top: 16px;
`

const AddCollateralCTA: React.FC<Props & { optional?: boolean }> = props => {
  const lastCompletedTx = isLastTxStatus(
    ['FAILED', 'CONFIRMED'],
    props.loan,
    props.loanTransactions
  )
  return lastCompletedTx ? (
    <CustomButton
      data-e2e='goToStepAddCollateral'
      onClick={() =>
        props.borrowActions.setStep({
          step: 'ADD_COLLATERAL',
          loan: props.loan,
          offer: props.offer
        })
      }
      nature='primary'
    >
      <Text color='white' size='14px' weight={600}>
        {props.optional ? (
          <FormattedMessage
            id='scenes.borrow.addcollateral.optional'
            defaultMessage='Add Collateral (Optional)'
          />
        ) : (
          <FormattedMessage
            id='scenes.borrow.addcollateral'
            defaultMessage='Add Collateral'
          />
        )}
      </Text>
    </CustomButton>
  ) : null
}

const CollateralWarning: React.FC<Props> = props => {
  const { offer } = props
  const currentCollateralStatus = getCollateralizationDisplayName(
    props.loan.collateralisationRatio,
    offer
  )

  // eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check
  switch (props.loan.status) {
    case 'CLOSED':
    case 'FAILED':
    case 'LIQUIDATED': {
      return (
        <Container bgColor='grey000'>
          <CustomIcon name='info' color='grey600' />
          <Text size='14px' weight={500} color='grey800' lineHeight={'20px'}>
            <FormattedMessage
              id='scenes.borrow.loanclosed'
              defaultMessage='This loan is no longer active.'
            />
          </Text>
        </Container>
      )
    }
  }

  switch (currentCollateralStatus) {
    case 'unsafe':
      return (
        <Container bgColor='red000'>
          <CustomIcon name='info' color='red600' />
          <div>
            <Text size='14px' weight={500} color='red600' lineHeight={'20px'}>
              <FormattedMessage
                id='scenes.borrow.warning.unsafe'
                defaultMessage='Your collateralization ratio is below {unsafeRatio}. Your loan is in danger of being liquidated.'
                values={{
                  unsafeRatio:
                    props.offer.callTerms.liquidationHardRatio * 100 + '%'
                }}
              />
            </Text>
            <AddCollateralCTA {...props} />
          </div>
        </Container>
      )
    case 'risky':
      return (
        <Container bgColor='orange000'>
          <CustomIcon name='info' color='orange600' />
          <div>
            <Text size='14px' weight={500} color='grey600' lineHeight={'20px'}>
              <FormattedHTMLMessage
                id='scenes.borrow.warning.risky'
                defaultMessage='Your collateralization ratio of <span class="orange900">{currentRatio}</span> is below the recommended level. <span class="grey900">You need to add {collateralAmtRequired} of additional collateral.</span> If it drops below {liquidationHardPerc} we will sell your collateral.'
                values={{
                  currentRatio: percentageFormatter(
                    props.loan.collateralisationRatio
                  ),
                  collateralAmtRequired: fiatToString({
                    unit: props.offer.terms.principalCcy as FiatType,
                    value: getCollateralAmtRequired(props.loan, props.offer)
                  }),
                  liquidationHardPerc: percentageFormatter(
                    props.offer.callTerms.liquidationHardRatio
                  )
                }}
              />
            </Text>
            <AddCollateralCTA {...props} />
          </div>
        </Container>
      )
    case 'safe':
      return (
        <Container bgColor='white' borderColor='grey100'>
          <CustomIcon name='info' color='grey400' />
          <div>
            <Text size='14px' weight={500} color='grey600' lineHeight={'20px'}>
              <FormattedHTMLMessage
                id='scenes.borrow.warning.safe'
                defaultMessage='Your collateralization ratio is <span class="green600">{currentRatio}</span>, no action needed at this time.'
                values={{
                  currentRatio: percentageFormatter(
                    props.loan.collateralisationRatio
                  )
                }}
              />
            </Text>
            <AddCollateralCTA {...props} optional />
          </div>
        </Container>
      )
    default:
      return <div />
  }
}

export default CollateralWarning
