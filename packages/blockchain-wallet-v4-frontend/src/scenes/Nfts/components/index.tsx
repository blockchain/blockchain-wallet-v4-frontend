import styled from 'styled-components'

import CoinDisplay from 'components/Display/CoinDisplay'
import LazyLoadContainer from 'components/LazyLoadContainer'
import { media } from 'services/styles'

export const maxWidth = '1200px'

export const opensea_event_types = [
  'bid_entered',
  'bid_withdrawn',
  'cancelled',
  'created',
  'offer_entered',
  'successful',
  'transfer'
]

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
  margin: 8px auto;
  box-sizing: border-box;
`

export const NftPageFullWidth = styled.div`
  padding: 0px !important;
`

export const LeftColWrapper = styled.div`
  position: sticky;
  height: 100%;
  top: 64px;
  overflow: scroll;
  background: ${(props) => props.theme.white};
  z-index: 1;
  ${media.atLeastTablet`
  top: 72px;
  margin-right: 20px;
  max-width: 320px;
  width: 25%;
`} > form {
    ${media.tablet`
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

export const GridWrapper = styled.div`
  display: flex;
  padding: 0 24px;
  align-items: flex-start;
  ${media.tablet`
    padding: 0px;
  `}
`

export const CTAWrapper = styled.div`
  padding: 8px;
`

// asset
export const Asset = styled.div`
  padding: 12px;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border: ${(props) => `1px solid ${props.theme.grey000}`};
`

export const InfoStatsWrapper = styled.div`
  padding: 12px;
  border-radius: 8px;
  border: 1px solid ${(props) => props.theme.grey000};
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
  margin-top: 12px;
  overflow: hidden;
  position: relative;
  background-size: cover;
  background-position: center;
  border-radius: 6px;
  cursor: pointer;
  background-image: ${(props) => props.background};
  background-color: ${(props) => props.backgroundColor};
  transition: height 0.2s ease-in-out;
`
export const AssetDetails = styled.div`
  margin-top: 12px;
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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
  width: 100%;
  align-items: center;
  flex-wrap: wrap-reverse;
  gap: 8px;
  justify-content: space-between;
`
export const StyledCoinDisplay = styled(CoinDisplay)`
  justify-content: flex-end;
`

// collection
export const CollectionHeader = styled.div<{ bgUrl?: string }>`
  height: 300px;
  display: flex;
  justify-content: space-between;
  background-size: cover;
  background-position: center;
  background-image: ${(props) => (props.bgUrl ? `url(${props.bgUrl})` : 'none')};
  position: relative;
  ${media.tablet`
    flex-direction: column;
  `}
`

export const Centered = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
`
//
export const NftBannerWrapper = styled.div`
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.24) 0%, #000000 100%);
  backdrop-filter: blur(10px);
  box-sizing: border-box;
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 24px 40px;
  ${media.tablet`
    padding: 12px;
  `}
`

export const StatsWrapper = styled.div`
  display: flex;
  gap: 8px;
`

export const Stat = styled.div`
  padding: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  gap: 16px;
  background: rgba(255, 255, 255, 0.08);
  ${media.tablet`
    padding: 10px;
    > div {
      font-size: 12px;
    }
  `}
`
