import { PaletteColors } from '@blockchain-com/constellation'
import styled from 'styled-components'

import CoinDisplay from 'components/Display/CoinDisplay'
import LazyLoadContainer from 'components/LazyLoadContainer'
import { media } from 'services/styles'

export const maxWidth = '100%'

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
  ${media.mobile`
    margin-top: 0;
  `}
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
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  position: relative;
  flex-direction: column;
  height: 340px;
  ${media.laptopM`
    height: 100%;
  `}
  &:hover {
    box-shadow: 0px 0px 30px 0px ${(props) => props.theme.grey200};
    transition: 0.3s ease-out;
  }
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
  backgroundImage?: string
}>`
  align-items: center;
  display: flex;
  justify-content: center;
  max-height: fit-content;
  max-width: 100%;
  width: 100%;
  overflow: hidden;
  position: relative;
  background-size: cover;
  background-position: center;
  cursor: pointer;
  background-image: ${(props) => props.background};
  background-color: ${(props) => props.backgroundColor};
  transition: height 0.2s ease-in-out;
`
export const AssetDetails = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  padding: 0 0.75em 0;
  flex-direction: column;
  gap: 6px;
  justify-content: center;
  background: linear-gradient(270deg, rgba(25, 14, 60, 0.95) 0%, rgba(14, 18, 27, 0.95) 102.1%);
  ${media.laptopL`
    padding-bottom: 4px;
  `}
`
export const AssetCollection = styled.div`
  overflow: hidden;
`
export const PriceCTA = styled.div`
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
  height: 400px;
  display: flex;
  justify-content: space-between;
  background: center ${(props) => (props.bgUrl ? `url(${props.bgUrl})` : 'unset')};
  background-repeat: no-repeat;
  background-size: cover;
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
  box-sizing: border-box;
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 24px 40px;
  ${media.tablet`
    padding: 12px;
  `}
`

export const CollectionInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  justify-content: center;
  bottom: 0;
  width: 100%;
  margin: 24px;
  ${media.tablet`
    padding: 12px;
    margin: 0;
    margin-bottom: 1em;
    flex-direction: row;
  `}
`

export const StatsWrapper = styled.div`
  display: flex;
  gap: 8px;
  margin: 24px;
  ${media.laptop`
    justify-content: center;
    display: flex;
    flex-direction: column;
    margin: 0 0 1em 0;
    width: 100%;
  `}
`

export const Stat = styled.div`
  padding: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  gap: 16px;
  white-space: nowrap;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid ${PaletteColors['grey-000']};
  ${media.laptop`
    > div {
      font-size: 12px;
    }
  `}
`

export const AvatarGradientColors = [
  PaletteColors['blue-600'],
  PaletteColors['purple-600'],
  PaletteColors['purple-300'],
  PaletteColors['green-300'],
  PaletteColors['grey-900']
]

export const LinksContainer = styled.div`
  display: flex;
  border: 1px solid ${(props) => props.theme.grey000};
  border-radius: 8px;
  justify-content: center;
  > a {
    display: flex;
    align-items: center;
    padding: 8px 16px;
    padding-right: 0px;
    svg {
      fill: ${(props) => props.theme.grey200};
      transition: fill 0.2s ease-in-out;
    }
    &:hover {
      svg {
        fill: ${(props) => props.theme.white};
      }
    }
    &:after {
      content: '';
      display: block;
      height: 90%;
      width: 1px;
      margin-left: 16px;
      background-color: ${(props) => props.theme.grey000};
    }
    &:last-child {
      padding-right: 16px;
    }
    &:last-child:after {
      display: none;
    }
  }
`
