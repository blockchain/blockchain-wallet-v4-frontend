import React, { memo, useState } from 'react'
import styled, { css } from 'styled-components'

import { Icon } from '../Icons'
import { Text } from '../Text'

const Row = styled.div`
  padding: 0 40px;
  box-sizing: border-box;
  border-top: 1px solid ${(props) => props.theme.grey000};

  &:last-child {
    border-bottom: 1px solid ${(props) => props.theme.grey000};
  }
`

const RowVisible = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  height: 60px;
  align-items: center;
`

const FlatRow = styled.div`
  display: flex;
`

const RowTitle = styled(Text)`
  font-size: 14px;
  font-weight: 500;
  color: ${(props) => props.theme.grey900};
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const RowValue = styled.div`
  text-align: right;
`

const RowText = styled(RowTitle)`
  font-weight: 600;
`

const AdditionalText = styled(Text)`
  font-weight: 500;
  color: ${(props) => props.theme.grey400};
  text-align: right;
  font-size: 12px;
`

const IconWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  cursor: pointer;
  margin-left: 4px;
`

const ToolTipContainer = styled.div`
  display: flex;
  flex-direction: row;
  border-radius: 8px;
  margin-top: 8px;
  margin-bottom: 8px;
  padding: 16px;
  background-color: ${(props) => props.theme.grey000};

  animation: fadeIn 0.3s ease-in-out;
  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`
const CheckoutRow = (props: Props) => {
  const [isActiveTooltip, setToolTip] = useState(false)
  return (
    <Row>
      <RowVisible>
        <FlatRow>
          <RowTitle>{props.title}</RowTitle>
          {props.toolTip && (
            <IconWrapper>
              <Icon
                name='question-in-circle-filled'
                size='16px'
                color={isActiveTooltip ? 'blue600' : 'grey300'}
                onClick={() => setToolTip(!isActiveTooltip)}
              />
            </IconWrapper>
          )}
        </FlatRow>
        <RowValue>
          <RowText>{props.text}</RowText>
          {props.additionalText && (
            <AdditionalText>{props.additionalText}</AdditionalText>
          )}
        </RowValue>
      </RowVisible>
      {props.toolTip && isActiveTooltip && (
        <ToolTipContainer>
          {props.toolTip}
        </ToolTipContainer>
      )}
    </Row>
  )
}

export type Props = {
  title: string | React.ReactNode
  text: string | React.ReactNode
  additionalText?: string | React.ReactNode
  toolTip?: string | React.ReactNode
}

export default memo(CheckoutRow)
