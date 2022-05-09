import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps, useDispatch } from 'react-redux'
import { bindActionCreators } from 'redux'
import styled from 'styled-components'

import { Button, SpinningLoader, Text } from 'blockchain-info-components'
import { actions } from 'data'
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
const NftOrderStatus: React.FC<Props> = (props) => {
  const { analyticsActions, openSeaAssetR } = props
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
    props.close()
  }
  const openSeaAsset = useRemote(() => openSeaAssetR)
  if (openSeaAsset.isLoading) return <NftFlyoutLoader />
  if (openSeaAsset.error || !openSeaAsset.hasData)
    return <NftFlyoutFailure error={openSeaAsset.error || ''} close={props.close} />

  const val = openSeaAsset.data

  if (!val) return <Text>No data</Text>

  return (
    <div style={{ height: '100%' }}>
      {props.orderFlow.status === NftOrderStatusEnum.WRAP_ETH && (
        <Wrapper>
          <SpinningLoader width='14px' height='14px' borderWidth='3px' />
        </Wrapper>
      )}
      {props.orderFlow.status === NftOrderStatusEnum.POST_OFFER && (
        <Wrapper>
          <img
            style={{
              borderRadius: '8px',
              height: '64px',
              marginRight: '12px',
              padding: '1em',
              width: 'auto'
            }}
            alt='nft-asset'
            src={val.image_url}
          />
          <Text size='24px' weight={600}>
            <FormattedMessage
              id='buttons.submitting_offer_for'
              defaultMessage='Submitting Offer For'
            />
          </Text>
          <Text size='24px' weight={600}>
            {val.name}
          </Text>
          <SpinningLoader height='14px' width='14px' borderWidth='3px' />
        </Wrapper>
      )}
      {props.orderFlow.status === NftOrderStatusEnum.POST_BUY_ORDER && (
        <Wrapper>
          <img
            style={{
              borderRadius: '8px',
              height: '64px',
              marginRight: '12px',
              padding: '1em',
              width: 'auto'
            }}
            alt='nft-asset'
            src={val.image_url}
          />
          <Text size='24px' weight={600}>
            <FormattedMessage id='buttons.buying' defaultMessage='Buying' />
          </Text>
          <Text size='24px' weight={600}>
            {val.name}
          </Text>
          <SpinningLoader height='14px' width='14px' borderWidth='3px' />
        </Wrapper>
      )}
      {props.orderFlow.status === NftOrderStatusEnum.POST_LISTING && (
        <Wrapper>
          <img
            style={{
              borderRadius: '8px',
              height: '64px',
              marginRight: '12px',
              padding: '1em',
              width: 'auto'
            }}
            alt='nft-asset'
            src={val.image_url}
          />
          <Text size='24px' weight={600}>
            Getting
          </Text>
          <Text size='24px' weight={600}>
            {val.name}
          </Text>
          <Text size='24px' weight={600}>
            ready for sale!
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
                height: '64px',
                marginRight: '12px',
                padding: '1em',
                width: 'auto'
              }}
              alt='nft-asset'
              src={val.image_url}
            />
            <Text size='24px' weight={600}>
              <FormattedMessage
                id='buttons.offer_successfully_sent_for'
                defaultMessage='Offer Successfully Sent For'
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
                height: '64px',
                marginRight: '12px',
                padding: '1em',
                width: 'auto'
              }}
              alt='nft-asset'
              src={val.image_url}
            />
            <Text size='24px' weight={600}>
              {val.name}
            </Text>
            <Text size='24px' weight={600}>
              Is Successfully Up For Sale
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
                height: '64px',
                marginRight: '12px',
                padding: '1em',
                width: 'auto'
              }}
              alt='nft-asset'
              src={val.image_url}
            />
            <Text size='24px' weight={600}>
              Buy Successful For
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

const mapDispatchToProps = (dispatch) => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch)
})

const connector = connect(null, mapDispatchToProps)

type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(NftOrderStatus)
