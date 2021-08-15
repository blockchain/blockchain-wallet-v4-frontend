import styled, { DefaultTheme } from 'styled-components'

import { Text } from 'blockchain-info-components'
import { media } from 'services/styles'

export const CardWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 29rem;

  &:first-child {
    margin-right: 2.5rem;
  }

  ${media.tabletL`
    &:first-child {
      margin-right: 0;
    }
  `}

  ${media.tablet`
    width: 100%;
  `}
`
export const Card = styled.div`
  padding: 2rem;
  background: ${(props) => props.theme.white};
  border-radius: 0.75rem;
  box-sizing: border-box;

  ${media.tablet`
    width: 100%;
    padding: 1.5rem;
  `}
`
export const CardHeader = styled.div`
  align-items: center;
  display: flex;
`
export const IconWrapper = styled.div<{ color: keyof DefaultTheme }>`
  display: flex;
  background: ${(props) => props.theme[props.color]};
  height: 3rem;
  width: 3rem;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  margin-right: 1.25rem;

  ${media.tablet`
    height: 2.5rem;
    width: 2.5rem;
    flex-shrink: 0;
  `}
`
export const CardsWrapper = styled.div`
  display: flex;

  ${media.tabletL`
    flex-direction: column;
    justify-content: center;
  `}

  ${media.tablet`
    width: 100%;
  `}
`
export const CardInfo = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 2rem;
`
export const InfoTitle = styled(Text)`
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
`
export const InfoItem = styled.div`
  display: flex;
  margin-bottom: 0.75rem;
  justify-content: flex-start;
  flex-wrap: wrap;

  > div:first-child {
    margin-right: 8px;

    ${media.tablet`
      margin-bottom: 4px;
    `}
  }
`
export const SubCard = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1.25rem;
  margin-bottom: 2.5rem;
`
export const SignInText = styled(Text)`
  &:hover {
    color: ${(props) => props.theme.white};
    font-weight: 600;
  }
`
