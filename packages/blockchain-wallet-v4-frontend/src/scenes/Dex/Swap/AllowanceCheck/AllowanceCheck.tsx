import React, { useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import {
  Button,
  IconCheckCircle,
  IconQuestionCircle,
  SemanticColors,
  Tooltip
} from '@blockchain-com/constellation'
import styled, { createGlobalStyle } from 'styled-components'

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

const InformationIcon = ({ coinSymbol }: { coinSymbol }) => {
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
            'You must give the Blockchain.com Dex smart contracts permission to use your {coinSymbol}. You only have to do this once per token.',
          id: 'dex.allowSwap.tooltip'
        },
        { coinSymbol }
      )}
    />
  )
}

export const AllowanceCheck = ({
  coinSymbol,
  onApprove
}: {
  coinSymbol: string
  onApprove: () => void
}) => {
  const [isApproved, setIsApproved] = useState(false)
  const onClick = () => {
    // TODO: Interact with a chain
    setIsApproved(true)
    onApprove()
  }

  return (
    <>
      <GlobalStyleTooltipZIndexFix />
      {isApproved ? (
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
                defaultMessage='Approved {coinSymbol}'
                values={{ coinSymbol }}
              />
            }
          />
        </GreenButtonWrapper>
      ) : (
        <Button
          size='large'
          width='full'
          variant='minimal'
          onClick={onClick}
          icon={<InformationIcon coinSymbol={coinSymbol} />}
          text={
            <FormattedMessage
              id='dex.allowSwap.action'
              defaultMessage='Allow {coinSymbol}'
              values={{ coinSymbol }}
            />
          }
        />
      )}
    </>
  )
}
