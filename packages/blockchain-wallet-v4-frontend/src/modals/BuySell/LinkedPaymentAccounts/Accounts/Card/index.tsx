import React, {
  KeyboardEventHandler,
  MouseEventHandler,
  ReactElement,
  useCallback,
  useMemo
} from 'react'
import { FormattedMessage } from 'react-intl'

import { fiatToString } from '@core/exchange/utils'
import { BSPaymentMethodType } from '@core/types'
import { Coin } from '@core/utils'
import { Icon } from 'blockchain-info-components'
import { MultiRowContainer } from 'components/BuySell'
import { Flex } from 'components/Flex'
import { Padding } from 'components/Padding'
import { Tag } from 'components/Tag'
import { convertBaseToStandard } from 'data/components/exchange/services'
import { NabuError } from 'services/errors'

import { DisplayContainer, DisplayIcon, StyledTitle, StyledValue } from './Card.styles'

type Props = {
  icon: ReactElement
  isBlocked: boolean
  onClick: () => void
  onClickNabuErrorInfo?: (error: NabuError) => void
  text: string
  value: BSPaymentMethodType
}

const Card: React.FC<Props> = ({
  icon,
  isBlocked = false,
  onClick,
  onClickNabuErrorInfo,
  text,
  value
}) => {
  const { block, card, currency, limits, type, ux } = value

  const nabuError = useMemo(() => {
    if (!ux) return

    return new NabuError(ux)
  }, [ux])

  const limitAmount = useMemo(() => {
    if (!limits) return null

    return fiatToString({
      unit: currency,
      value: convertBaseToStandard(Coin.FIAT, limits.max)
    })
  }, [currency, limits])

  const handleNabuError = useCallback(
    (event) => {
      event.preventDefault()
      event.stopPropagation()

      if (!nabuError || !onClickNabuErrorInfo) return

      onClickNabuErrorInfo(nabuError)
    },
    [nabuError, onClickNabuErrorInfo]
  )

  const handleClickOnCard: MouseEventHandler<HTMLDivElement> = useCallback(
    (event) => {
      event.preventDefault()
      event.stopPropagation()

      if (isBlocked) return

      onClick()
    },
    [onClick, isBlocked]
  )

  return (
    <DisplayContainer
      data-e2e={`sb${type.toLowerCase()}Cards`}
      role='button'
      onClick={handleClickOnCard}
    >
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
            {text.toLowerCase()}
          </StyledValue>
          {!!card && <StyledTitle asValue>****{card.number}</StyledTitle>}
        </Flex>

        <Flex justifyContent='space-between'>
          <StyledTitle asValue>
            {limitAmount && (
              <FormattedMessage
                id='modals.simplebuy.card_with_limits'
                defaultMessage='{limitAmount} Limit'
                values={{ limitAmount }}
              />
            )}
          </StyledTitle>
          {!!card && (
            <StyledTitle asValue>
              Exp: {card.expireMonth}/{card.expireYear}
            </StyledTitle>
          )}
        </Flex>
        {!!nabuError && (
          <Padding top={8}>
            <Flex gap={8} alignItems='center'>
              <Tag variant={block ? 'error' : 'warning'}>{nabuError.title}</Tag>

              <div
                role='button'
                tabIndex={-1}
                onClick={handleNabuError}
                onKeyPress={handleNabuError}
              >
                <Icon name='info' size='12px' color='grey600' />
              </div>
            </Flex>
          </Padding>
        )}
      </MultiRowContainer>
    </DisplayContainer>
  )
}

export default Card
