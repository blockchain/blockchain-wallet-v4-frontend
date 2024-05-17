import styled from 'styled-components'

import { media } from 'services/styles'

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 16px;
  background-color: ${({ theme }) => theme.grey000};
  border-radius: 16px;
  cursor: pointer;
  width: 100%;
  box-sizing: border-box;

  ${media.tablet`
    margin-bottom: 8px;
  `}
`

export const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
`

export const LeftContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`
export const SeparatorWrapper = styled.div`
  width: calc(100% - 32px);
  margin: 8px 16px;
  box-sizing: border-box;
`
