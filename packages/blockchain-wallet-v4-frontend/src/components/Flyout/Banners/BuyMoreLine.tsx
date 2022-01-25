import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Button, Icon, Text } from 'blockchain-info-components'
import { media } from 'services/styles'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border: 1px solid ${(props) => props.theme.blue400};
  border-radius: 12px;
  padding: 16px 18px;
  margin: 10px 0;

  ${media.atLeastLaptop`
    height: 72px;
    padding: 0 20px;
  `}
  ${media.mobile`
    padding: 12px;
    flex-direction: column;
  `}
`
const Row = styled.div`
  display: flex;
  align-items: center;
`

const SpacedRow = styled(Row)`
  justify-content: space-between;
  width: 100%;
`

const Column = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`
const PendingIconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  width: 40px;
  min-width: 40px;
  border-radius: 20px;
`

const BannerButton = styled(Button)`
  height: 32px;
  width: 46px;
  font-size: 14px;
  border-radius: 42px;
  min-width: 0;
  text-transform: uppercase;
`

const BuyMoreLine = ({ buyAmount, coin, startBuy }: Props) => {
  return (
    <Wrapper>
      <SpacedRow>
        <PendingIconWrapper>
          <Icon size='32px' color={coin} name={coin} />
        </PendingIconWrapper>
        <Column>
          <Text size='12px' weight={500} color='grey900'>
            <FormattedMessage
              id='copy.get_more_coin'
              defaultMessage='Get More {coin}'
              values={{
                coin
              }}
            />
          </Text>
          <Text size='14px' weight={500} color='grey900'>
            <FormattedMessage
              id='buttons.buy_coin'
              defaultMessage='Buy {displayName}'
              values={{
                displayName: buyAmount
              }}
            />
          </Text>
        </Column>
        <BannerButton onClick={startBuy} data-e2e='continueToBuy' nature='primary'>
          <FormattedMessage id='buttons.buy' defaultMessage='Buy' />
        </BannerButton>
      </SpacedRow>
    </Wrapper>
  )
}

type Props = { buyAmount: string; coin: string; startBuy: () => void }

export default BuyMoreLine
