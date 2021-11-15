import styled from 'styled-components'

import CoinDisplay from 'components/Display/CoinDisplay'
import LazyLoadContainer from 'components/LazyLoadContainer'
import { media } from 'services/styles'

export const NftPageWrapper = styled.div`
  display: flex;
  width: 100%;
  ${media.tabletL`
    flex-direction: column;
  `}
`

export const LeftColWrapper = styled.div`
  position: sticky;
  height: 100%;
  top: 48px;
  overflow: scroll;
  background: ${(props) => props.theme.white};
  z-index: 1;
  ${media.atLeastTabletL`
  top: 61px;
  margin-right: 20px;
  max-width: 300px;
  width: 25%;
`} > form {
    ${media.tabletL`
    display: flex;
    > div {
      flex: 1;
    }
  `}
  }
`

export const LazyLoadWrapper = styled(LazyLoadContainer)`
  max-width: 1000px;
  ${media.atLeastTabletL`
    width: 75%;
  `}
  > div {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    overflow: scroll;
    gap: 20px;
    margin-bottom: 20px;
  }
  ${media.atLeastLaptopL`
    > div {
      grid-template-columns: repeat(3, minmax(0, 1fr));  
    }
  `}
`

export const CTAWrapper = styled.div`
  padding: 8px;
`

export const Asset = styled.div`
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border: ${(props) => `1px solid ${props.theme.grey100}`};
`

export const InfoStatsWrapper = styled.div`
  padding: 12px;
  border-radius: 8px;
  border: 1px solid ${(props) => props.theme.grey100};
  margin-bottom: 16px;
`

export const ImageContainer = styled.div<{ background?: string; backgroundColor?: string }>`
  align-items: center;
  display: flex;
  justify-content: center;
  max-height: 100%;
  max-width: 100%;
  height: 285px;
  overflow: hidden;
  position: relative;
  background-size: cover;
  background-position: center;
  border-radius: 8px;
  background-image: ${(props) => props.background};
  background-color: ${(props) => props.backgroundColor};
`
export const AssetDetails = styled.div`
  padding: 12px 8px;
  background: ${(props) => props.theme.white};
`
export const AssetCollection = styled.div`
  overflow: hidden;
`
export const PriceInfo = styled.div`
  margin-top: 16px;
`
export const StyledCoinDisplay = styled(CoinDisplay)`
  justify-content: flex-end;
`
