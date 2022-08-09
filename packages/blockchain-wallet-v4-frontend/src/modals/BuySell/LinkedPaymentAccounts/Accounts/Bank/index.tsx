import React, { ReactElement, useMemo } from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { fiatToString } from '@core/exchange/utils'
import { BSPaymentMethodType } from '@core/types'
import { Coin } from '@core/utils'
import { DisplayContainer, DisplayIcon, MultiRowContainer } from 'components/BuySell'
import { Flex } from 'components/Flex'
import { Title, Value } from 'components/Flyout'
import { convertBaseToStandard } from 'data/components/exchange/services'

const StyledTitle = styled(Title)`
  text-transform: capitalize;
  color: ${(p) => p.theme.grey600};
  font-weight: 500;
  font-size: 14px;
`

const StyledValue = styled(Value)`
  color: ${(p) => p.theme.grey900};
  font-weight: 600;
  font-size: 16px;
`

type Props = {
  icon: ReactElement
  onClick: () => void
  text: string | ReactElement
  value: BSPaymentMethodType
}

const Bank = ({ icon, onClick, text, value }: Props) => {
  const { currency, details, limits, type } = value

  const limitAmount = useMemo(() => {
    if (!limits) return null

    return fiatToString({
      unit: currency,
      value: convertBaseToStandard(Coin.FIAT, limits.max)
    })
  }, [limits, currency])

  return (
    <DisplayContainer data-e2e={`sb${type.toLowerCase()}Banks`} role='button' onClick={onClick}>
      <DisplayIcon>{icon}</DisplayIcon>
      <MultiRowContainer style={{ minWidth: 0 }}>
        <Flex justifyContent='space-between'>
          <StyledValue
            asTitle
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {text}
          </StyledValue>

          {!!details && <StyledTitle asValue>***{details.accountNumber}</StyledTitle>}
        </Flex>

        <Flex justifyContent='space-between'>
          <StyledTitle asValue>
            {limitAmount && (
              <FormattedMessage
                id='modals.simplebuy.band_item_with_limits'
                defaultMessage='{limitAmount} Limit'
                values={{
                  limitAmount
                }}
              />
            )}
          </StyledTitle>
          {!!details?.bankAccountType && (
            <StyledTitle asValue>{details.bankAccountType.toLowerCase()}</StyledTitle>
          )}
        </Flex>
      </MultiRowContainer>
    </DisplayContainer>
  )
}

export default Bank
