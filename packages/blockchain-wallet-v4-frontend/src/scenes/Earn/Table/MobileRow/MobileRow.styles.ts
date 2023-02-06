import { PaletteColors } from '@blockchain-com/constellation'
import styled, { css } from 'styled-components'

const FlexColumn = css`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 4px;
`
export const Wrapper = styled.button<WrapperProps>`
  display: flex;
  align-items: center;
  padding: 16px;
  border: none;
  background-color: transparent;
  gap: 16px;
  width: 100%;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};

  &:hover {
    background-color: ${({ disabled }) => (disabled ? 'transparent' : PaletteColors['grey-100'])};
  }
`
export const RightContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
`
export const CoinContainer = styled.div`
  ${FlexColumn}
  align-items: flex-start;
`
export const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
`
export const AmountContainer = styled.div`
  ${FlexColumn}
  align-items: flex-end;
`
interface WrapperProps {
  disabled?: boolean
}
