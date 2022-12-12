import React from 'react'
import { useIntl } from 'react-intl'
import { Flex, Tooltip } from '@blockchain-com/constellation'
import styled, { createGlobalStyle } from 'styled-components'

// TODO: Fix z-index and offset in constellation and remove that CSS file
const GlobalStyleTooltipZIndexFix = createGlobalStyle`
  div[data-radix-popper-content-wrapper] {
    z-index: 99999 !important;
    margin-left: 3px;
  }
`

const Container = styled.div<{ ml: number }>`
  margin-left: ${({ ml }) => `${ml}px`};
`

const Star = styled.div`
  background: ${({ theme }) => theme.blue400};
  width: 12px;
  height: 12px;
  position: absolute;
  text-align: center;
  transform: rotate(20deg);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 12px;
    width: 12px;
    background: ${({ theme }) => theme.blue400};
    transform: rotate(135deg);
  }
`

const CheckmarkContainer = styled.div`
  margin-top: -6px;
`

const Checkmark = styled.div`
  display: inline-block;
  transform: rotate(45deg);
  height: 5px;
  width: 2px;
  border-bottom: 2px solid #fff;
  border-right: 2px solid #fff;
`

const VerificationCheckmarkTrigger = ({ ml = 0 }: { ml?: number }) => (
  <Container ml={ml}>
    <GlobalStyleTooltipZIndexFix />
    <Flex justifyContent='center' alignItems='center'>
      <Star />
      <CheckmarkContainer>
        <Checkmark />
      </CheckmarkContainer>
    </Flex>
  </Container>
)

export const VerificationCheckmark = ({ ml = 0, sources }: { ml?: number; sources: number }) => {
  const { formatMessage } = useIntl()
  return (
    <Tooltip
      side='top'
      delay={400}
      avoidCollisions
      sideOffset={8}
      trigger={<VerificationCheckmarkTrigger ml={ml} />}
      text={formatMessage(
        {
          defaultMessage: 'Verified by at least {{sources}} source(s) from https://tokenlists.org',
          id: 'dex.coinVerification.description'
        },
        { sources }
      )}
    />
  )
}
