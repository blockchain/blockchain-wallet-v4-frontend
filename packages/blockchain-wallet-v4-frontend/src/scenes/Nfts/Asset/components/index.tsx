import { LinkContainer } from 'react-router-bootstrap'
import { PaletteColors } from '@blockchain-com/constellation'
import styled from 'styled-components'

import { Text } from 'blockchain-info-components'
import { TableWrapper } from 'components/Table'
import { FIXED_HEADER_HEIGHT } from 'layouts/Nfts/NftsHeader'
import { media } from 'services/styles'

import { NftPage } from '../../components'

export const Wrapper = styled(NftPage)`
  display: block;
  margin: 0 auto;
  box-sizing: border-box;
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
  width: 66%;
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
    padding-left: 1.5em;
    padding-right: 1.5em;
  `}
`

export const RightColWrapper = styled.div`
  ${media.atLeastTablet`
  height: 100%;
  width: 34%;
  margin-right: 2em;
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
    padding-left: 1.5em;
    padding-right: 1.5em;
  `}
`

export const AssetName = styled(Text)`
  font-style: normal;
  font-weight: 600;
  font-size: 40px;
  display: flex;
  margin-top: 30px;
  color: ${PaletteColors['grey-900']};
`

export const CurrentPriceBox = styled.div`
  border: 1px solid ${PaletteColors['grey-000']};
  box-sizing: border-box;
  border-radius: 8px;
  margin-top: 20px;
  background: ${(props) => props.theme.greyFade000};
  padding: 1.2em;
`

export const Divider = styled.div`
  width: 100%;
  height: 1px;
  margin-top: 8px;
  background: ${PaletteColors['grey-000']};
`

export const MoreAssets = styled.div`
  width: 100%;
  padding: 40px;
  ${media.tablet`
    padding-right: 0.5em;
    padding-left: 0.5em;
  `}
`

export const MoreAssetsWrapper = styled.div`
  padding: 1em 0em;
`

export const TraitsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`

export const Trait = styled.div`
  display: flex;
  padding: 0.5em 1em;
  flex-direction: column;
  gap: 6px;
  border-radius: 8px;
  background: ${(props) => props.theme.greyFade000};
  border: 1px solid ${(props) => props.theme.grey100};
`

export const Highest = styled(Text)`
  margin-bottom: 12px;
  font-weight: 600;
  line-height: 32px;
  color: ${PaletteColors['grey-900']};
`

export const EthText = styled(Highest)`
  font-size: 24px;
  display: flex;
  margin-bottom: 20px;
  align-items: center;
  color: ${PaletteColors['grey-900']};
`

export const CollectionName = styled(Text)`
  font-weight: 600;
  font-size: 16px;
  display: flex;
  align-items: center;
  color: ${PaletteColors['grey-900']};
`

export const CustomLink = styled(LinkContainer)`
  &:hover {
    opacity: 1;
    cursor: pointer;
  }
`

export const NftTableWrapper = styled(TableWrapper)`
  .table {
    overflow: scroll;
    &.no-border {
      border: 0px;
    }
    .tr {
      border-top: 1px solid ${(props) => props.theme.grey000};
    }
    .th,
    .td {
      padding: 6px 8px;
    }
    .th {
      background: ${PaletteColors['grey-000']};
    }
    .td {
      height: 42px;
    }
  }
`
