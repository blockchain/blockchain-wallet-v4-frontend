import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Remote } from '@core'
import { Button, HeartbeatLoader, Icon, SpinningLoader, Text } from 'blockchain-info-components'
import { Row, Title, Value } from 'components/Flyout/model'
import { NftOrderStepEnum } from 'data/components/nfts/types'

import { AssetDesc, FullAssetImage, StickyCTA } from '../../components'
import { Props as OwnProps } from '..'
import CancelOfferFees from './fees'

const CancelOffer: React.FC<Props> = (props) => {
  const { close, nftActions, orderFlow } = props
  const { offerToCancel } = orderFlow

  const disabled = Remote.Loading.is(orderFlow.fees) || props.orderFlow.isSubmitting

  return (
    <>
      {orderFlow.asset.cata({
        Failure: (e) => <Text>{e}</Text>,
        Loading: () => (
          <AssetDesc>
            <SpinningLoader width='14px' height='14px' borderWidth='3px' />
          </AssetDesc>
        ),
        NotAsked: () => null,
        Success: (val) => (
          <>
            <div style={{ position: 'relative' }}>
              <Icon
                onClick={() => nftActions.setOrderFlowStep({ step: NftOrderStepEnum.SHOW_ASSET })}
                name='arrow-left'
                cursor
                role='button'
                style={{ left: '40px', position: 'absolute', top: '40px' }}
              />
              <Icon
                onClick={() => close()}
                name='close'
                cursor
                role='button'
                style={{ position: 'absolute', right: '40px', top: '40px' }}
              />
              <FullAssetImage cropped backgroundImage={val?.image_url.replace(/=s\d*/, '')} />
            </div>
            <AssetDesc>
              <Text size='16px' color='grey900' weight={600}>
                {val?.collection?.name}
              </Text>
              <Text style={{ marginTop: '4px' }} size='20px' color='grey900' weight={600}>
                {val?.name}
              </Text>
            </AssetDesc>
            <Row>
              <Title>
                <FormattedMessage id='copy.description' defaultMessage='Description' />
              </Title>
              <Value>
                {val?.description || (
                  <FormattedMessage id='copy.none_found' defaultMessage='None found.' />
                )}
              </Value>
            </Row>
            <StickyCTA>
              <CancelOfferFees {...props} />
              {orderFlow.fees.cata({
                Failure: () => (
                  <Text size='14px' weight={600}>
                    <FormattedMessage
                      id='copy.no_active_offers'
                      defaultMessage='Error. You may have already cancelled this offer, or it has expired.'
                    />
                  </Text>
                ),
                Loading: () => null,
                NotAsked: () => null,
                Success: (val) =>
                  offerToCancel ? (
                    <Button
                      jumbo
                      nature='primary'
                      fullwidth
                      data-e2e='cancelOfferNft'
                      disabled={disabled}
                      onClick={() => nftActions.cancelOffer({ gasData: val, order: offerToCancel })}
                    >
                      {props.orderFlow.isSubmitting ? (
                        <HeartbeatLoader color='blue100' height='20px' width='20px' />
                      ) : (
                        <FormattedMessage id='copy.cancel_offer' defaultMessage='Cancel Offer' />
                      )}
                    </Button>
                  ) : (
                    <Text size='14px' weight={600}>
                      <FormattedMessage
                        id='copy.no_active_offers_listings'
                        defaultMessage='Error. You may have already cancelled this offer, or it has expired.'
                      />
                    </Text>
                  )
              })}
            </StickyCTA>
          </>
        )
      })}
    </>
  )
}

type Props = OwnProps

export default CancelOffer
