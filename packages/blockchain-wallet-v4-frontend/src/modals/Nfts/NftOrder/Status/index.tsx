import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps, useDispatch } from 'react-redux'
import { bindActionCreators } from 'redux'
import styled from 'styled-components'

import { Button, Icon as BlockchainIcon, SpinningLoader, Text } from 'blockchain-info-components'
import { actions, selectors } from 'data'
import { Analytics } from 'data/types'
import { useRemote } from 'hooks'

import { NftOrderStatusEnum } from '../../../../data/components/nfts/types'
import NftFlyoutFailure from '../../components/NftFlyoutFailure'
import NftFlyoutLoader from '../../components/NftFlyoutLoader'
import { Props as OwnProps } from '..'

const Wrapper = styled(Text)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-style: normal;
  height: 100%;
  font-weight: 600;
  font-size: 24px;
`

const ButtonWrapper = styled.div`
  display: block;
  padding: 0 40px;
  position: absolute;
  bottom: 2em;
  width: 100%;
  box-sizing: border-box;
`

const StyledImage = styled.img`
  border-radius: 8px;
  height: 120px;
  margin-right: 12px;
  padding: 12px;
  width: auto;
`

const NftOrderStatus: React.FC<Props> = (props) => {
  const { analyticsActions, defaultEthAddr, openSeaAssetR, routerActions } = props
  const dispatch = useDispatch()

  const returnToMarketPlace = () => {
    analyticsActions.trackEvent({
      key: Analytics.NFT_RETURN_TO_MARKETPLACE_CLICKED,
      properties: {}
    })
    props.close()
  }

  const closeAndViewItem = () => {
    analyticsActions.trackEvent({
      key: Analytics.NFT_CLOSE_AND_VIEW_ITEM_CLICKED,
      properties: {}
    })
    props.close()
  }

  const goToMyPortfolio = () => {
    dispatch(
      actions.analytics.trackEvent({
        key: Analytics.NFT_GO_TO_PORTFOLIO_CLICKED,
        properties: {}
      })
    )
    routerActions.push(`/nfts/address/${defaultEthAddr}`)
    props.close()
  }
  const openSeaAsset = useRemote(() => openSeaAssetR)
  if (openSeaAsset.isLoading) return <NftFlyoutLoader close={props.close} />
  if (openSeaAsset.error)
    return <NftFlyoutFailure error={openSeaAsset.error || ''} close={props.close} />

  const val = openSeaAsset.data

  if (!val) return <NftFlyoutFailure error='Error fetching asset data.' close={props.close} />

  return (
    <div style={{ height: '100%' }}>
      <BlockchainIcon
        onClick={() => props.close()}
        name='arrow-left'
        cursor
        role='button'
        style={{ left: '40px', position: 'absolute', top: '40px' }}
      />
      {props.orderFlow.status === NftOrderStatusEnum.WRAP_ETH && (
        <Wrapper>
          <SpinningLoader width='14px' height='14px' borderWidth='3px' />
        </Wrapper>
      )}
      {props.orderFlow.status === NftOrderStatusEnum.APPROVE_ERC20 && (
        <Wrapper>
          <StyledImage alt='nft-asset' src={val.image_url} />
          <Text size='24px' weight={600} style={{ marginBottom: '8px' }}>
            <FormattedMessage
              id='copy.approving_erc20_spending'
              defaultMessage='Approving ERC-20 for Spending'
            />
          </Text>
          <SpinningLoader height='14px' width='14px' borderWidth='3px' />
        </Wrapper>
      )}
      {props.orderFlow.status === NftOrderStatusEnum.POST_OFFER && (
        <Wrapper>
          <StyledImage alt='nft-asset' src={val.image_url} />
          <Text size='24px' weight={600}>
            <FormattedMessage
              id='buttons.submitting_your_offer_for'
              defaultMessage='Submitting Your Offer For'
            />
          </Text>
          <Text style={{ marginBottom: '8px' }} size='24px' weight={600}>
            {val.name}
          </Text>
          <SpinningLoader height='14px' width='14px' borderWidth='3px' />
        </Wrapper>
      )}
      {props.orderFlow.status === NftOrderStatusEnum.POST_BUY_ORDER && (
        <Wrapper>
          <StyledImage alt='nft-asset' src={val.image_url} />
          <Text size='24px' weight={600}>
            <FormattedMessage id='buttons.buying' defaultMessage='Buying' />
          </Text>
          <Text style={{ marginBottom: '8px' }} size='24px' weight={600}>
            {val.name}
          </Text>
          <SpinningLoader height='14px' width='14px' borderWidth='3px' />
        </Wrapper>
      )}
      {props.orderFlow.status === NftOrderStatusEnum.POST_LISTING && (
        <Wrapper>
          <StyledImage alt='nft-asset' src={val.image_url} />
          <Text size='24px' weight={600}>
            Preparing to list
          </Text>
          <Text size='24px' weight={600}>
            {val.name}
          </Text>
          <Text style={{ marginBottom: '8px' }} size='24px' weight={600}>
            for sale
          </Text>
          <SpinningLoader height='14px' width='14px' borderWidth='3px' />
        </Wrapper>
      )}
      {props.orderFlow.status === NftOrderStatusEnum.POST_OFFER_SUCCESS && (
        <>
          <Wrapper>
            <img
              style={{
                borderRadius: '8px',
                height: '120px',
                marginRight: '12px',
                padding: '12px',
                width: 'auto'
              }}
              alt='nft-asset'
              src={val.image_url}
            />
            <Text size='24px' weight={600}>
              <FormattedMessage
                id='buttons.offer_submitted_for'
                defaultMessage='Offer Submitted For'
              />
            </Text>
            <Text size='24px' weight={600}>
              {val.name}
            </Text>
          </Wrapper>
          <ButtonWrapper>
            <Button
              nature='primary'
              jumbo
              onClick={returnToMarketPlace}
              fullwidth
              data-e2e='returnToMarketPlace'
            >
              <FormattedMessage
                id='buttons.return_to_marketplace'
                defaultMessage='Return To Marketplace'
              />
            </Button>
          </ButtonWrapper>
        </>
      )}
      {props.orderFlow.status === NftOrderStatusEnum.POST_LISTING_SUCCESS && (
        <>
          <Wrapper>
            <img
              style={{
                borderRadius: '8px',
                height: '120px',
                marginRight: '12px',
                padding: '12px',
                width: 'auto'
              }}
              alt='nft-asset'
              src={val.image_url}
            />
            <Text size='24px' weight={600}>
              Your Listing of
            </Text>
            <Text size='24px' weight={600}>
              {val.name}
            </Text>
            <Text size='24px' weight={600}>
              is Now Live
            </Text>
          </Wrapper>
          <ButtonWrapper>
            <Button
              nature='primary'
              jumbo
              onClick={closeAndViewItem}
              fullwidth
              data-e2e='returnToMarketPlace'
            >
              <FormattedMessage
                id='buttons.close_and_view_item'
                defaultMessage='Close and View Item'
              />
            </Button>
          </ButtonWrapper>
        </>
      )}

      {props.orderFlow.status === NftOrderStatusEnum.POST_BUY_ORDER_SUCCESS && (
        <>
          <Wrapper>
            <img
              style={{
                borderRadius: '8px',
                height: '120px',
                marginRight: '12px',
                padding: '12px',
                width: 'auto'
              }}
              alt='nft-asset'
              src={val.image_url}
            />
            <Text size='24px' weight={600}>
              Congratulations! You Have Purchased
            </Text>
            <Text size='24px' weight={600}>
              {val.name}
            </Text>
          </Wrapper>
          <ButtonWrapper>
            <Button
              nature='primary'
              jumbo
              onClick={goToMyPortfolio}
              fullwidth
              data-e2e='returnToMarketPlace'
            >
              <FormattedMessage
                id='buttons.go_to_my_portfolio'
                defaultMessage='Go To My Portfolio'
              />
            </Button>
          </ButtonWrapper>
        </>
      )}
    </div>
  )
}

const mapStateToProps = (state) => ({
  defaultEthAddr: selectors.core.kvStore.eth.getDefaultAddress(state).getOrElse('')
})

const mapDispatchToProps = (dispatch) => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  routerActions: bindActionCreators(actions.router, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(NftOrderStatus)
