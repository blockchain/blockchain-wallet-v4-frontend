import React, { ReactElement, useMemo } from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { fiatToString } from '@core/exchange/utils'
import { BSPaymentMethodType } from '@core/types'
import { DisplayContainer, DisplayIcon, MultiRowContainer } from 'components/BuySell'
import { Flex } from 'components/Flex'
import { Title, Value } from 'components/Flyout'
import { convertBaseToStandard } from 'data/components/exchange/services'
import { Coin } from 'middleware/analyticsMiddleware/types'

const StyledValue = styled(Value)`
  text-transform: capitalize;
`

const StyledTitle = styled(Title)`
  color: ${(p) => p.theme.grey600};
  font-size: 14px;
  font-weight: 500;
`

type Props = {
  icon: ReactElement
  onClick: (string) => void
  text: string
  value: BSPaymentMethodType
}

const Card: React.FC<Props> = ({ icon, onClick, text, value }) => {
  const { card, currency, limits, type } = value

  const limitAmount = useMemo(() => {
    if (!limits) return null

    return fiatToString({
      unit: currency,
      value: convertBaseToStandard(Coin.FIAT, limits.max)
    })
  }, [currency, limits])

  return (
    <DisplayContainer data-e2e={`sb${type.toLowerCase()}Cards`} role='button' onClick={onClick}>
      <DisplayIcon>{icon}</DisplayIcon>
      <MultiRowContainer>
        <Flex justifyContent='space-between'>
          <StyledValue asTitle>{text.toLowerCase()}</StyledValue>
          {!!card && <StyledTitle asValue>***{card.number}</StyledTitle>}
        </Flex>

        <Flex justifyContent='space-between'>
          <StyledTitle asValue>
            {limitAmount && (
              <FormattedMessage
                id='modals.simplebuy.card_with_limits'
                defaultMessage='{limitAmount} Limit'
                values={{
                  limitAmount
                }}
              />
            )}
          </StyledTitle>
          {!!card && (
            <StyledTitle asValue>
              Exp: {card.expireMonth}/{card.expireYear}
            </StyledTitle>
          )}
        </Flex>
      </MultiRowContainer>
    </DisplayContainer>
  )
}

export default Card
