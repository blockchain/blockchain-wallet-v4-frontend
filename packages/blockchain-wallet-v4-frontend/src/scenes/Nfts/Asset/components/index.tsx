import { LinkContainer } from 'react-router-bootstrap'
import { colors } from '@blockchain-com/constellation'
import styled from 'styled-components'

import { Text } from 'blockchain-info-components'
import { TableWrapper } from 'components/Table'
import { FIXED_HEADER_HEIGHT } from 'layouts/Nfts/NftsHeader'
import { media } from 'services/styles'

import { NftPage } from '../../components'

export const Wrapper = styled(NftPage)`
  display: block;
  margin: 0 auto;
  padding: 20px 0 0 0;
  box-sizing: border-box;
  margin-top: 8px;
  ${media.atLeastTablet`
    height: 100%;
  `}
  ${media.tablet`
    flex-direction: column;
  `}
`
export const Top = styled.div`
  ${media.atLeastTablet`
  display: flex;
  `}
  display: block;
`

export const LeftColWrapper = styled.div`
  ${media.atLeastTablet`
  box-sizing: border-box;
  max-width: 625px;
  width: 50%;
  `} > form {
    ${media.tablet`
    display: flex;
    > div {
      flex: 1;
    }
  `}
  }
  padding-right: 3em;

  top: ${FIXED_HEADER_HEIGHT + 8}px;
  background: ${(props) => props.theme.white};
  z-index: 1;
  display: block;

  ${media.tablet`
    padding-right: 1em;
    padding-left: 1em;
  `}
`

export const RightColWrapper = styled.div`
  ${media.atLeastTablet`
  height: 100%;
  width: 50%;
  `} > form {
    ${media.tablet`
    display: flex;
    > div {
      flex: 1;
    }
  `}
  }
  background: ${(props) => props.theme.white};
  z-index: 1;
  display: block;
  ${media.tablet`
    padding-right: 1em;
    padding-left: 1em;
  `}
`

export const StickyWrapper = styled.div`
  position: sticky;
  top: calc(${FIXED_HEADER_HEIGHT + 20}px);
`

export const AssetName = styled(Text)`
  font-style: normal;
  font-weight: 600;
  font-size: 40px;
  display: flex;
  margin-top: 30px;
  color: ${colors.grey900};
`

export const CurrentPriceBox = styled.div`
  border: 1px solid ${colors.grey000};
  box-sizing: border-box;
  border-radius: 8px;
  margin-top: 20px;
  padding: 1.2em;
`

export const Divider = styled.div`
  width: 100%;
  height: 1px;
  margin-top: 8px;
  background: ${colors.grey000};
`

export const MoreAssets = styled.div`
  width: 100%;
  ${media.tablet`
    padding-right: 1em;
    padding-left: 1em;
  `}
`

export const MoreAssetsList = styled.div`
  display: flex;
  width: 100%;
  flex-wrap: wrap;
`

export const MoreAssetsListItem = styled.div`
  width: 25%;
  ${media.tablet`width: 50%;`}
`

export const TraitsWrapper = styled.div`
  margin-top: 1.5em;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`

export const Trait = styled.div`
  display: flex;
  cursor: pointer;
  padding: 0.5em 1em;
  flex-direction: column;
  gap: 6px;
  border-radius: 8px;
  background: ${(props) => props.theme.blue000};
  border: 1px solid ${(props) => props.theme.blue600};
  &:hover {
    transform: scale(1.02);
    -webkit-transition: transform 0.1s ease-in-out;
  }
`

export const Highest = styled(Text)`
  margin-bottom: 12px;
  font-weight: 600;
  font-size: 14px;
  color: ${colors.grey600};
`

export const EthText = styled(Highest)`
  font-size: 24px;
  display: flex;
  margin-bottom: 20px;
  align-items: center;
  color: ${colors.grey900};
`

export const CollectionName = styled(Text)`
  font-weight: 600;
  font-size: 16px;
  display: flex;
  align-items: center;
  color: ${colors.grey900};
`

export const CustomLink = styled(LinkContainer)`
  &:hover {
    opacity: 1;
    cursor: pointer;
  }
`

export const NftTableWrapper = styled(TableWrapper)`
  .table {
    .th,
    .td {
      padding: 6px 8px;
    }
    .td {
      height: 42px;
    }
  }
`
