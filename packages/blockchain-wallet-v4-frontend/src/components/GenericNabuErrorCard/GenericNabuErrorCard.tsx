import React, { useCallback, useMemo } from 'react'

import { Button, Icon, Text } from 'blockchain-info-components'
import { useDeepLink } from 'services/deepLinkListener'
import { NabuErrorAction } from 'services/errors'

import {
  ActionsContainer,
  CloseButton,
  Container,
  Header,
  HeaderTitle,
  MessageContainer
} from './GenericNabuErrorCard.styles'
import {
  GenericNabuErrorCardComponent,
  GenericNabuErrorCardVariant
} from './GenericNabuErrorCard.types'

export const GenericNabuErrorCard: GenericNabuErrorCardComponent = ({
  error,
  onActionClick,
  onClickClose,
  variant = 'warning'
}) => {
  const { actions, message, title } = error
  const { onClickDeepLink } = useDeepLink()

  const titleColor = useMemo(() => {
    const titleColorMap: Record<GenericNabuErrorCardVariant, string> = {
      error: 'error',
      warning: 'orange600'
    }

    return titleColorMap[variant]
  }, [variant])

  const handleOnClickAction = useCallback(
    (action: NabuErrorAction) => {
      const { url } = action

      onActionClick?.(action)

      if (url) {
        onClickDeepLink(url)
      }
    },
    [onClickDeepLink, onActionClick]
  )

  return (
    <Container variant={variant}>
      <Header>
        {!!title && (
          <HeaderTitle>
            <Text color={titleColor} weight={600} size='14px' lineHeight='20px'>
              {title}
            </Text>
          </HeaderTitle>
        )}

        {!!onClickClose && (
          <CloseButton tabIndex={-1} onClick={onClickClose}>
            <Icon name='close' />
          </CloseButton>
        )}
      </Header>

      {!!message && (
        <MessageContainer>
          <Text weight={500} size='12px' lineHeight='16px' color='grey900'>
            {message}
          </Text>
        </MessageContainer>
      )}

      {!!actions?.length && (
        <ActionsContainer>
          {actions.map((action) => (
            <Button
              key={action.title}
              data-e2e={action.title}
              nature='dark-grey'
              small
              onClick={() => handleOnClickAction(action)}
            >
              {action.title}
            </Button>
          ))}
        </ActionsContainer>
      )}
    </Container>
  )
}
