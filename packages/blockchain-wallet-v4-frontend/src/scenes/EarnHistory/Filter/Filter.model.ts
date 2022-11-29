import styled from 'styled-components'

import { media } from 'services/styles'

export const MenuRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  gap: 8px;
  align-items: center;
  margin-bottom: 16px;

  ${media.laptop`
    flex-direction: column;
    gap: 16px;
  `}
`
export const LeftContainer = styled.div`
  display: flex;
  width: 100%;

  & > div > div {
    padding: 4px 2px;
  }

  ${media.laptopM`
    & > div {
      width: 100%;
    }
  `}
`
export const RightContainer = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  width: 100%;

  ${media.laptopM`
    & > div {
      width: 100%;
    }
  `}

  ${media.mobile`
    flex-direction: column;
    gap: 16px;
  `}
`
