import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { colors } from '@blockchain-com/constellation'
import { bindActionCreators } from 'redux'
import styled from 'styled-components'

import { Button, Link, SpinningLoader, Text } from 'blockchain-info-components'
import { actions } from 'data'
import { Analytics } from 'data/types'

import { NftOrderStatusEnum } from '../../../../data/components/nfts/types'
import { Props as OwnProps } from '..'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-top: calc(35vh);
  font-family: Inter, sans-serif;
  font-style: normal;
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

const NftOrderStatus: React.FC<Props> = (props: any) => {
  const returnToMarketPlace = () => {
    props.close()
  }
  const viewSubmittedOffer = () => {
    props.analyticsActions.trackEvent({
      key: Analytics.NFT_VIEW_SUBMITTED_OFFER_CLICKED,
      properties: {}
    })
    props.close()
  }
  return (
    <div>
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
            src={props.data.image_url}
          />
          <div>Submitting Offer For</div>
          <div>{props.data.name}</div>
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
              src={props.data.image_url}
            />
            <div>Offer Successfully Sent For</div>
            <div>{props.data.name}</div>
          </Wrapper>
          <ButtonWrapper>
            <Button
              nature='primary'
              onClick={returnToMarketPlace}
              fullwidth
              data-e2e='returnToMarketPlace'
            >
              <FormattedMessage id='modals.prompt.button' defaultMessage='Return To Marketplace' />
            </Button>
            <Link href={props.data.permalink} target='_blank'>
              <Button
                nature='empty-blue'
                fullwidth
                margin='0.5em 0em'
                onClick={viewSubmittedOffer}
                data-e2e='viewOffer'
              >
                <FormattedMessage id='modals.prompt.button' defaultMessage='View Submitted Offer' />
              </Button>
            </Link>
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

type Props = ConnectedProps<typeof connector>

export default connector(NftOrderStatus)
