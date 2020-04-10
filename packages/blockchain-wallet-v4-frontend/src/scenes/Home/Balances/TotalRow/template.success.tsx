import { FormattedHTMLMessage } from 'react-intl'
import { OwnProps, SuccessStateType } from '.'
import { Text } from 'blockchain-info-components'
import React from 'react'
import styled from 'styled-components'

type Props = OwnProps & SuccessStateType

const TotalRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
`

const HomeBalanceAmount = styled(Text)`
  position: relative;
  font-size: 24px;
  font-weight: 500;
  color: ${props => props.theme.grey800};
`

const JoyrideSpotlight = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto auto;
  width: 32px;
  height: 32px;
`

const Success: React.FC<Props> = props => {
  return (
    <TotalRow>
      <Text size='16px' weight={500} color='grey400' capitalize>
        <FormattedHTMLMessage
          id='components.balances.home.total'
          defaultMessage='{viewType} Balance'
          values={{ viewType: props.currentTab }}
        />
      </Text>
      <HomeBalanceAmount data-e2e='homeBalanceAmt'>
        <JoyrideSpotlight className='wallet-intro-tour-step-1' />
        {props.totalBalance}
      </HomeBalanceAmount>
    </TotalRow>
  )
}

export default Success
