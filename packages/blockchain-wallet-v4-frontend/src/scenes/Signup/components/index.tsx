import styled from 'styled-components'

import { Text } from 'blockchain-info-components'
import { media } from 'services/styles'

export const CardWrapper = styled.div<{ hideMargin?: boolean }>`
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 32rem;

  &:first-child {
    margin-right: ${(props) => (props.hideMargin ? '0' : '2.5rem')};
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
export const PaddingWrapper = styled.div`
  padding: 2rem 2rem 0;
`
export const Card = styled.div`
  background: ${(props) => props.theme.white};
  border-radius: 0.75rem;
  box-sizing: border-box;

  ${media.tablet`
    width: 100%;
    padding: 1.5rem;
  `}
  ${media.mobile`
  padding: 0;
`}
`
export const CardHeader = styled.div`
  align-items: center;
  display: flex;
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
export const CardTitle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
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
