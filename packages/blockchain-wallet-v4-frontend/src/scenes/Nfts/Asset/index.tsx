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
  margin-right: 2em;
  height: 100%;
  top: 64px;
  overflow: scroll;
  background: ${(props) => props.theme.white};
  z-index: 1;
  ${media.atLeastTabletL`
  top: 72px;
  max-width: 625px;
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

const PriceHistory = styled(PriceHistoryTitle)`
  height: 340px;
  background: #f0f2f7;
  border: 1px solid #dfe3eb;
  box-sizing: border-box;
  border-radius: 8px;
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

const DetailsBidHistory = styled(HighestBid)`
  font-size: 24px;
  color: #121d33;
`
const EthText = styled(HighestBid)`
  font-size: 24px;
  display: flex;
  line-height: 135%;
  color: #121d33;
  padding: 0.5em;
`

const CreatorOwnerBox = styled(CurrentPriceBox)`
  height: 84px;
  display: flex;
`

const CreatorOwnerLeft = styled(LeftColWrapper)`
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  color: #677184;
  border: unset;
  padding: 1em;
  }
`

const CreatorOwnerAddress = styled(CreatorOwnerLeft)`
  padding: 1em, 0rem, 1em, 0rem;
  text-overflow: ellipsis;
  font-size: 16px;
  line-height: 150%;
  color: #121d33;
  overflow: hidden;
}
`

const CreatorOwnerRight = styled(CreatorOwnerLeft)``

const Divider = styled.div`
  margin-bottom: 2em;
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

// const Traits = styled.div`
//   display: grid;
//   grid-template-columns: 25% 25% 25% 25%;
//   padding: 25px;
//   font-family: Inter;
//   font-style: normal;
//   font-weight: 500;
//   font-size: 12px;
//   line-height: 16px;
// `

const Traits = styled.div`
  padding-top: 4em;
`

const AdditionalDetails = styled(Traits)``

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
          height='60%'
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
        <PriceHistory />
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
        <DetailsBidHistory>TO-DO: Details Bids History</DetailsBidHistory>
        <CreatorOwnerBox>
          <CreatorOwnerLeft>
            Creator
            <CreatorOwnerAddress>
              <img
                alt='Creator Logo'
                height='30px'
                width='auto'
                style={{ borderRadius: '50%', marginBottom: '0.5rem', paddingRight: '2px' }}
                src={asset?.data?.asset?.creator?.profile_img_url || ''}
              />
              {asset?.data?.asset?.creator?.address}
            </CreatorOwnerAddress>
          </CreatorOwnerLeft>
          <CreatorOwnerRight>
            Owner
            <CreatorOwnerAddress>
              <img
                alt='Owner Logo'
                height='30px'
                width='auto'
                style={{ borderRadius: '50%', marginBottom: '0.5rem', paddingRight: '2px' }}
                src={asset?.data?.asset?.owner?.profile_img_url || ''}
              />{' '}
              {asset?.data?.asset?.owner?.address}
            </CreatorOwnerAddress>
          </CreatorOwnerRight>
        </CreatorOwnerBox>
        <Traits>
          <div>TRAITS TO-DO: {JSON.stringify(asset?.data?.asset?.traits)}</div>
        </Traits>
        <AdditionalDetails>
          <div>TO-DO: Additional Details WILL GO HERE</div>
          <div>Contract Address {asset?.data?.asset?.contract_address}</div>
          <div>Token ID {asset?.data?.asset?.token_id}</div>
          <div>Token Standard ERC 721</div>
          <div>Blockchain ETH</div>
        </AdditionalDetails>
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
