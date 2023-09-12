import { SemanticColors } from '@blockchain-com/constellation'
import styled, { css } from 'styled-components'

import { Icon } from 'blockchain-info-components'

const ContainerCss = css`
  display: flex;
  justify-content: space-between;
  border-radius: 32px;
  padding: 16px;
  background-color: ${SemanticColors['background-light']};
`

export const CloseIcon = styled.div`
  > :first-child {
    cursor: pointer;
  }
`
export const EthIcon = styled(Icon)`
  width: 32px;
  height: 32px;

  & > img {
    width: 32px;
  }
`
export const ButtonContainer = styled.div`
  display: flex;
  gap: 16px;

  button {
    border-radius: 32px !important;
  }
`
export const TopContainer = styled.div`
  ${ContainerCss}
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
`
export const BottomContainer = styled.div`
  ${ContainerCss}
  border-top-right-radius: 0;
  border-top-left-radius: 0;
`
export const ErrorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin: 42px 0 20px;
`
