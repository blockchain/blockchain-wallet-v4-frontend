import { SemanticColors } from '@blockchain-com/constellation'
import styled, { css } from 'styled-components'

import { media } from 'services/styles'

export const IconCss = css`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
`
export const DetailsWrapper = styled.div`
  position: relative;
  display: flex;
  gap: 16px;
  flex-grow: 1;

  ${media.mobile`
    flex-direction: column;
  `}
`
export const DetailsContainer = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 24px;
  overflow: hidden;
  background-color: ${SemanticColors['background-light']};
  min-width: 200px;
  width: 100%;
`

export const DetailItem = styled.div<{ isFirstRow: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  height: ${({ isFirstRow }) => (isFirstRow ? '22px' : '46px')};

  &:not(:last-child) {
    border-bottom: 1px solid ${SemanticColors.medium};
  }
`
export const IconContainer = styled.div`
  ${IconCss}
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  height: fit-content;
  width: fit-content;
  padding: 8px;
  margin: auto;
  background-color: ${SemanticColors.background};
  z-index: 1;
`
export const IconCircle = styled.div`
  ${IconCss}
  padding: 4px;
  background-color: ${SemanticColors['background-light']};
`
