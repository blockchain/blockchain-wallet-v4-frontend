import styled, { css } from 'styled-components'

import { GenericNabuErrorCardVariant } from './GenericNabuErrorCard.types'

export const Container = styled.div<{ variant: GenericNabuErrorCardVariant }>`
  ${({ theme, variant }) => {
    const borderColorMap: Record<GenericNabuErrorCardVariant, string> = {
      error: theme.error,
      warning: theme.orange600
    }

    return css`
      background-color: ${theme.grey000};
      border: 1px solid ${borderColorMap[variant]};
      border-radius: 0.5rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    `
  }}
`

export const Header = styled.div`
  display: flex;
  padding: 0.5rem 0.5rem 0 1rem;
  justify-content: space-between;
`

export const HeaderTitle = styled.div`
  min-height: 28px;
  display: flex;
  align-items: flex-end;
`

export const MessageContainer = styled.div`
  padding: 0 1rem;
`

export const CloseButton = styled.button`
  ${({ theme }) => css`
    outline: none;
    border: none;
    border-radius: 50%;
    height: 1.5rem;
    width: 1.5rem;
    background-color: ${theme.grey100};
    color: ${theme.grey500};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    cursor: pointer;
    padding: 0;
    margin: 0;
  `}
`

export const ActionsContainer = styled.div`
  padding: 0 1rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`
