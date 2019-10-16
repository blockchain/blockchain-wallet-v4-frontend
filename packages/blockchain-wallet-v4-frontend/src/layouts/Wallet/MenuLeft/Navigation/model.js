import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled, { keyframes } from 'styled-components'
import { LinkContainer } from 'react-router-bootstrap'
import { Button, Icon, Text } from 'blockchain-info-components'

const Scale = () => {
  return keyframes`
    0% {
      opacity: 0;
      transform: scale(0);
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  `
}

const TooltipBody = styled.div`
  position: relative;
  width: 100%;
  max-width: 256px;
  background-color: ${props => props.theme['white']};
  border-radius: 8px;
  box-shadow: 0 4px 32px rgba(5, 24, 61, 0.4);
  padding: 32px;
  animation: ${Scale} 0.3s ease-in-out;
  > span:first-child {
    position: absolute;
    top: 24px;
    right: 24px;
    &:hover {
      cursor: pointer;
    }
  }
`
const TooltipContent = styled.div`
  color: ${props => props.theme['white']};
  margin-bottom: 24px;
  text-align: center;
`
const TooltipFooter = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: ${props =>
    props.isLastStep ? 'flex-end' : 'space-between'};
  align-content: center;
  align-items: center;
  color: ${props => props.theme['white']};
`
const CloseTourIcon = styled(Icon)`
  &:hover {
    color: ${({ theme }) => theme['grey600']};
  }
  &:active {
    color: ${({ theme }) => theme['grey800']};
  }
`

export const PitTooltip = props => {
  const { skipProps, step, tooltipProps } = props
  return (
    <TooltipBody {...tooltipProps}>
      <CloseTourIcon
        color='grey400'
        data-e2e='modalCloseButton'
        name='close'
        size='16px'
        weight={600}
        {...skipProps}
      />
      {step.content && <TooltipContent>{step.content}</TooltipContent>}
      <TooltipFooter>
        <Button width='110px' height='48px' nature='primary' fullwidth>
          <LinkContainer to='/thepit'>
            <Text color='white' size='14px' weight={600}>
              <FormattedMessage
                id='the.pit.tooltip.checkitout'
                defaultMessage='Check It Out'
              />
            </Text>
          </LinkContainer>
        </Button>
      </TooltipFooter>
    </TooltipBody>
  )
}
