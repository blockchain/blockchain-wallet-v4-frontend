import styled from 'styled-components'

import { media } from 'services/styles'

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  box-sizing: border-box;
  width: 550px;
  margin-top: 72px;
  background-color: ${(props) => props.theme.white};
  padding: 24px;
  border-radius: 24px;
  border: 1px solid ${(props) => props.theme.grey100};
  min-height: 268px;

  ${media.tablet`
    width: 100%;
  `}

  ${media.mobile`
    padding: 20px;
  `}
`
export const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`
