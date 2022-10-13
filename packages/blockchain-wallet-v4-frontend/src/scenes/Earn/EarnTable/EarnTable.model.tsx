import { PaletteColors } from '@blockchain-com/constellation'
import styled, { css } from 'styled-components'

const ProductContainerCss = css`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4px 8px;
  border-radius: 4px;
`

export const RewardsTextContainer = styled.div`
  ${ProductContainerCss}
  border: 1px solid ${PaletteColors['grey-100']};
`
export const StakingTextContainer = styled.div`
  ${ProductContainerCss}
  background-color: ${PaletteColors['grey-100']};
`
