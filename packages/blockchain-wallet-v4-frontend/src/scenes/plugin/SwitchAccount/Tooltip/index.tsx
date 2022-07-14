import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Text } from 'blockchain-info-components'

interface TooltipProps {
  backgroundColor: string
  index: number
  leftBlockPosition: number
  leftTrianglePosition: number
  text: string
  textColor: string
}

const Tooltip: React.FC<{ tooltipProperties: TooltipProps }> = ({ tooltipProperties }) => {
  const TooltipText = styled(Text)`
    white-space: nowrap;
    color: ${tooltipProperties.textColor};
  `
  const TooltipWrapper = styled.div`
    position: absolute;
    top: -40px;
    left: ${tooltipProperties.leftBlockPosition}%;
    transform: translate(-${tooltipProperties.leftBlockPosition}%, 0);
    border-radius: 4px;
    padding: 6px;
    background: ${tooltipProperties.backgroundColor};
    &:before {
      content: '';
      position: absolute;
      top: 30px;
      left: ${tooltipProperties.leftTrianglePosition}%;
      transform: translate(-50%, 0);
      width: 0;
      height: 0;
      border-left: 6px solid transparent;
      border-right: 6px solid transparent;
      border-top: 6px solid ${tooltipProperties.backgroundColor};
    }
  `
  const formattedMessageText = tooltipProperties.text.split(' ').join('-')

  return (
    <TooltipWrapper id='tooltip'>
      <TooltipText size='12px' lineHeight='150%' weight={500}>
        <FormattedMessage
          defaultMessage={tooltipProperties.text}
          id={`modals.airdropsuccess.${formattedMessageText}`}
        />
      </TooltipText>
    </TooltipWrapper>
  )
}

export default Tooltip
