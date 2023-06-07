import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import {
  Button,
  IconAlert,
  IconCheckCircle,
  IconQuestionCircle,
  SemanticColors,
  Text,
  Tooltip
} from '@blockchain-com/constellation'
import styled, { createGlobalStyle } from 'styled-components'

import { SpinningLoader } from 'blockchain-info-components'
import { selectors } from 'data'
import { useRemote } from 'hooks'

import { ButtonContainer } from './styles'

// TODO: Fix z-index and props and offset in constellation and remove that CSS file
const GlobalStyleTooltipZIndexFix = createGlobalStyle`
  div[data-radix-popper-content-wrapper] {
    z-index: 99999 !important;
    width: 286px !important;
    min-width: 286px !important;
  }
`

// TODO: Update constellation Button to accept text color
const GreenButtonWrapper = styled.div`
  > button {
    color: ${() => SemanticColors.success} !important;
  }
`

const InformationIcon = ({ baseToken }) => {
  const { formatMessage } = useIntl()

  return (
    <Tooltip
      side='top'
      delay={400}
      avoidCollisions
      sideOffset={4}
      data-align='center'
      trigger={<IconQuestionCircle />}
      text={formatMessage(
        {
          defaultMessage:
            'You must give the Blockchain.com Dex smart contracts permission to use your {baseToken}. You only have to do this once per token.',
          id: 'dex.allowSwap.tooltip'
        },
        { baseToken }
      )}
    />
  )
}

export const AllowanceCheck = ({
  baseToken,
  onApprove
}: {
  baseToken: string
  onApprove: () => void
}) => {
  const {
    data: isTokenAllowed,
    hasError,
    isLoading
  } = useRemote(selectors.components.dex.getTokenAllowanceStatusAfterPolling)

  if (isLoading)
    return (
      <ButtonContainer>
        <Button
          disabled
          size='large'
          width='full'
          variant='minimal'
          text={<SpinningLoader borderWidth='4px' height='24px' width='24px' />}
        />
      </ButtonContainer>
    )

  if (hasError)
    return (
      <ButtonContainer>
        <Button
          disabled
          size='large'
          width='full'
          variant='minimal'
          icon={<IconAlert color={SemanticColors.error} />}
          text={
            <Text color={SemanticColors.error} variant='title3'>
              <FormattedMessage
                id='dex.allowSwap.approved'
                defaultMessage='{baseToken} approval failed. Try again.'
                values={{ baseToken }}
              />
            </Text>
          }
        />
      </ButtonContainer>
    )

  return (
    <ButtonContainer>
      <GlobalStyleTooltipZIndexFix />
      {isTokenAllowed ? (
        <GreenButtonWrapper>
          <Button
            disabled
            size='large'
            width='full'
            variant='minimal'
            icon={<IconCheckCircle color={SemanticColors.success} />}
            text={
              <FormattedMessage
                id='dex.allowSwap.approved'
                defaultMessage='Approved {baseToken}'
                values={{ baseToken }}
              />
            }
          />
        </GreenButtonWrapper>
      ) : (
        <Button
          size='large'
          width='full'
          variant='minimal'
          onClick={onApprove}
          icon={<InformationIcon baseToken={baseToken} />}
          text={
            <FormattedMessage
              id='dex.allowSwap.action'
              defaultMessage='Allow {baseToken}'
              values={{ baseToken }}
            />
          }
        />
      )}
    </ButtonContainer>
  )
}
