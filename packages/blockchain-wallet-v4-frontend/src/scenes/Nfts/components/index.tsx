import styled from 'styled-components'

import CoinDisplay from 'components/Display/CoinDisplay'
import { media } from 'services/styles'

export const CollectionWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  margin-top: 8px;
  gap: 20px;
  margin-bottom: 20px;
  ${media.laptopM`
    gap: 16px;
    margin-bottom: 12px;
    grid-template-columns: repeat(3, minmax(0, 1fr));
  `}
  ${media.tabletL`
    gap: 12px;
    margin-bottom: 12px;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  `}
`
export const Asset = styled.div`
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border: ${(props) => `1px solid ${props.theme.grey100}`};
`
export const ImageContainer = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  max-height: 100%;
  max-width: 100%;
  height: 285px;
  overflow: hidden;
  position: relative;
`
export const AssetImage = styled.img`
  object-fit: contain;
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
  border-radius: 0px;
`
export const AssetDetails = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 8px;
  background: ${(props) => props.theme.white};
  > div {
    width: 50%;
  }
`
export const AssetCollection = styled.div`
  overflow: hidden;
`
export const PriceInfo = styled.div`
  text-align: right;
`
export const StyledCoinDisplay = styled(CoinDisplay)`
  justify-content: flex-end;
`
