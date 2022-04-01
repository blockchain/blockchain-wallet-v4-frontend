import styled from 'styled-components'

import CoinDisplay from 'components/Display/CoinDisplay'
import LazyLoadContainer from 'components/LazyLoadContainer'
import { media } from 'services/styles'

export const maxWidth = '1200px'

export const NftPage = styled.div`
  width: 100%;
  max-width: ${maxWidth};
  margin: 0px auto;
  position: relative;
  box-sizing: border-box;
  background: ${(props) => props.theme.white};
`

export const NftPageV2 = styled.div`
  width: 100%;
  padding: 24px;
`

export const LeftColWrapper = styled.div`
  position: sticky;
  height: 100%;
  top: 64px;
  overflow: scroll;
  background: ${(props) => props.theme.white};
  z-index: 1;
  ${media.atLeastTabletL`
  top: 72px;
  margin-right: 20px;
  max-width: 320px;
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
  max-width: ${maxWidth};
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

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  overflow: scroll;
  gap: 20px;
  margin-bottom: 20px;
  ${media.atLeastTablet`
    grid-template-columns: repeat(2, minmax(0, 1fr));
  `}
  ${media.atLeastLaptopL`
    grid-template-columns: repeat(3, minmax(0, 1fr));  
  `}
`

export const CTAWrapper = styled.div`
  padding: 8px;
`

// asset
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

export const AssetImageContainer = styled.div<{
  background?: string
  backgroundColor?: string
}>`
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
  border-radius: 6px;
  cursor: pointer;
  background-image: ${(props) => props.background};
  background-color: ${(props) => props.backgroundColor};
`
export const AssetDetails = styled.div`
  padding: 12px 8px;
  background: ${(props) => props.theme.white};
  ${media.laptopL`
    padding-bottom: 4px;
  `}
`
export const AssetCollection = styled.div`
  overflow: hidden;
`
export const PriceCTA = styled.div`
  margin-top: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`
export const StyledCoinDisplay = styled(CoinDisplay)`
  justify-content: flex-end;
`

// collection
export const Collection = styled.div<{ onClick: () => void }>`
  cursor: pointer;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
  padding: 24px;
  border: ${(props) => `1px solid ${props.theme.grey100}`};
  ${media.tabletL`
    padding: 12px;
  `}
`

export const CollectionBanner = styled.div<{ background?: string; large?: boolean }>`
  height: ${(props) => (props.large ? '180px' : '74px')};
  overflow: hidden;
  position: relative;
  background-size: cover;
  background-position: center;
  border-radius: 8px;
  background-image: ${(props) => props.background};
`

export const CollectionImage = styled.img`
  border-radius: 50%;
  position: absolute;
  height: 62px;
  width: 62px;
  top: 60px;
  left: calc(50% - 31px);
  ${media.tabletL`
    height: 40px;
    width: 40px;
    top: 60px;
    left: calc(50% - 20px);
  `}
`
