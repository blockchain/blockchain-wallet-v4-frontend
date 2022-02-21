import React from 'react'

import { Flex } from 'components/Flex'

import { Container, Grid } from './styles'
import { PageScaffoldComponent } from './types'

export const PageScaffold: PageScaffoldComponent = ({
  about,
  activity,
  alertCard,
  chart,
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

          {chart}
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
