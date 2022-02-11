import React, { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { useAssetQuery } from 'blockchain-wallet-v4-frontend/src/generated/graphql'
import { bindActionCreators } from 'redux'
import styled from 'styled-components'
import { CombinedError } from 'urql'

import { Button, Icon, SpinningLoader } from 'blockchain-info-components'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { media } from 'services/styles'

export const CoinIcon = styled(Icon).attrs({ className: 'coin-icon' })``

export const LeftColWrapper = styled.div`
  position: sticky;
  height: 100%;
  top: 64px;
  overflow: scroll;
  background: ${(props) => props.theme.white};
  z-index: 1;
  ${media.atLeastTabletL`
  top: 72px;
  max-width: 550px;
  width: 60%;
`} > form {
    ${media.tabletL`
    display: flex;
    > div {
      flex: 1;
    }
  `}
  }
`

export const RightColWrapper = styled.div`
  position: sticky;
  height: 100%;
  top: 64px;
  overflow: scroll;
  background: ${(props) => props.theme.white};
  z-index: 1;
  ${media.atLeastTabletL`
  top: 72px;
  margin-right: 20px;
  max-width: 500px;
  width: 40%;
`} > form {
    ${media.tabletL`
    display: flex;
    > div {
      flex: 1;
    }
  `}
  }
`

const CollectionName = styled.div`
  padding-top: 1em;
  font-family: Inter, sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 150%;
  display: flex;
  align-items: left;
  color: #121d33;
`

const AssetName = styled.div`
  height: 20px;
  font-family: Inter, sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 40px;
  line-height: 125%;
  display: flex;
  align-items: left;
  color: #121d33;
`

const PriceHistoryTitle = styled(AssetName)`
  font-size: 24px;
  line-height: 135%;
  padding: 2em 0em 2em 0em;
`
const CurrentPriceBox = styled.div`
  width: 436px;
  height: 156px;
  border: 1px solid #dfe3eb;
  box-sizing: border-box;
  border-radius: 8px;
`
const HighestBid = styled.div`
  padding: 1em;
  font-family: Inter, sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  color: #677184;
`

const EthText = styled(HighestBid)`
  font-size: 24px;
  display: flex;
  line-height: 135%;
  color: #121d33;
  padding: 0.5em;
`

const Divider = styled.div`
  position: static;
  width: 727px;
  height: 1px;
  left: 48px;
  top: 51px;
  background: #f0f2f7;
`

const Description = styled.div`
  padding: 3em 0em 3em 0em;
  font-family: Inter, sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  color: #677184;
`

const NftAsset: React.FC<Props> = ({ defaultEthAddr, nftsActions, ...rest }) => {
  const { contract, id } = rest.computedMatch.params
  // @ts-ignore
  const [asset] = useAssetQuery({
    variables: { filter: { contract_address: contract, token_id: id } }
  })
  return (
    <>
      <LeftColWrapper>
        <img
          alt='Asset Logo'
          height='50%'
          width='auto'
          style={{
            border: '1px solid #dfe3eb',
            borderRadius: '10%',
            borderWidth: '1px',
            marginBottom: '0.5rem',
            padding: '10px'
          }}
          src={asset?.data?.asset?.image_url || ''}
        />
        <PriceHistoryTitle>Price History</PriceHistoryTitle>
        <Divider />
      </LeftColWrapper>
      <RightColWrapper>
        <CollectionName>
          <img
            alt='Dapp Logo'
            height='30px'
            width='auto'
            style={{ borderRadius: '50%', marginBottom: '0.5rem', paddingRight: '2px' }}
            src={asset?.data?.asset?.collection?.image_url || ''}
          />
          {asset?.data?.asset?.collection?.name}
        </CollectionName>
        <AssetName>{asset?.data?.asset?.name}</AssetName>
        <Description>{asset?.data?.asset?.collection?.description}</Description>
        <CurrentPriceBox>
          <HighestBid>Highest Bid</HighestBid>
          <EthText>
            <CoinIcon name='ETH' style={{ padding: '0.5em' }} />
            ETH
          </EthText>
        </CurrentPriceBox>
      </RightColWrapper>
    </>
  )
}

const mapStateToProps = (state: RootState) => ({
  defaultEthAddr: selectors.core.kvStore.eth.getDefaultAddress(state).getOrElse('')
})

const mapDispatchToProps = (dispatch) => ({
  nftsActions: bindActionCreators(actions.components.nfts, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type Props = ConnectedProps<typeof connector> & {
  computedMatch: { params: { contract: string; id: string } }
}

export default connector(NftAsset)
