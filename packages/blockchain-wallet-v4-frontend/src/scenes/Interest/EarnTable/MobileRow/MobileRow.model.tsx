import { PaletteColors } from '@blockchain-com/constellation'
import styled, { css } from 'styled-components'

const FlexColumn = css`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`
export const Wrapper = styled.div`
  display: flex;
  padding: 16px 0;
  border-bottom: 1px solid ${PaletteColors['grey-100']};
  gap: 16px;
  width: 100%;

  &:hover {
    cursor: pointer;
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
`
export const AmountContainer = styled.div`
  ${FlexColumn}
  align-items: flex-end;
`
