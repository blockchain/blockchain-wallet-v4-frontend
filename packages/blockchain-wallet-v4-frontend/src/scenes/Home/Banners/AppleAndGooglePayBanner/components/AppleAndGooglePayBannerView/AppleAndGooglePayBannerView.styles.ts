import styled, { css } from 'styled-components'

import { Image } from 'blockchain-info-components'

export const CardWrapper = styled.div`
  ${({ theme }) => css`
    border: 1px solid ${theme.grey000};
    border-radius: 4px;
  `}
`

export const GooglePayImage = styled(Image)`
  position: absolute;
  bottom: 0;
  right: 0;
  z-index: 100;
`
export const ApplePayImage = styled(Image)`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 99;
`

export const PaymentImageIcon = styled.div`
  height: 48px;
  width: 54px;
  position: relative;
  display: inline-block;
`
