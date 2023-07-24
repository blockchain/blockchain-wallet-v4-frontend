import styled, { keyframes } from 'styled-components'

import { SkeletonRectangle, Text } from 'blockchain-info-components'

const slideInTopAnimation = keyframes`
  0% {
    transform: scaleY(0.25);
    transform-origin: 100% 0;
  }
  100% {
    transform: scaleY(1);
    transform-origin: 100% 0;
  }
`

export const QuoteWrapper = styled.div<{ animate: boolean }>`
  display: flex;
  flex-direction: column;
  margin-bottom: 24px;
  animation: ${slideInTopAnimation} 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
  border: 1px solid ${(props) => props.theme.grey000};
  border-radius: 16px;
  > :last-child {
    border-bottom: none;
  }
`

export const RowDetails = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 45px;
  padding: 8px 16px;
  border-bottom: 1px solid ${(props) => props.theme.grey000};
`

export const RowTitle = styled(Text)`
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: 500;
  font-size: 14px;
  line-height: 150%;
  color: ${(props) => props.theme.textBlack};
`

export const ValueText = styled(Text)`
  font-weight: 600;
  font-size: 14px;
  line-height: 150%;
  color: ${(props) => props.theme.textBlack};
`

export const EditSlippageText = styled(Text)`
  font-weight: 500;
  font-size: 12px;
  line-height: 150%;
  color: ${(props) => props.theme.blue600};
  &:hover {
    cursor: pointer;
  }
`
