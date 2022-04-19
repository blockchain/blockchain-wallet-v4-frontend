import React from 'react'

import { Flex } from 'components/Flex'

import { ChartWrapper, Container, Grid } from './styles'
import { CoinPageComponent } from './types'

export const CoinPage: CoinPageComponent = ({
  about,
  activity,
  alertCard,
  chart,
  chartBalancePanel,
  chartTabs,
  favoriteButton,
  header,
  holdings,
  promoCard,
  recurringBuys,
  wallets
}) => {
  return (
    <Container>
      <Grid>
        <Flex flexDirection='column' gap={48}>
          <Flex alignItems='center' gap={16} justifyContent='space-between'>
            {header}
            {favoriteButton}
          </Flex>

          <Flex flexDirection='column' gap={32}>
            <Flex gap={16} alignItems='center' justifyContent='space-between'>
              {chartBalancePanel}
              {chartTabs}
            </Flex>

            <ChartWrapper>{chart}</ChartWrapper>
          </Flex>

          {about}
          {activity}
        </Flex>

        <Flex flexDirection='column' gap={24}>
          {alertCard} {holdings} {wallets} {recurringBuys} {promoCard}
        </Flex>
      </Grid>
    </Container>
  )
}
