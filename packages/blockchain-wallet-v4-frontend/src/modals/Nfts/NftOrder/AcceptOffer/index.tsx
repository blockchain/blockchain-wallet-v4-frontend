import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Remote } from '@core'
import { Button, Icon, SpinningLoader, Text } from 'blockchain-info-components'
import { Row, Title, Value } from 'components/Flyout/model'
import { NftOrderStepEnum } from 'data/components/nfts/types'

import { AssetDesc, FullAssetImage, StickyCTA } from '../../components'
import { Props as OwnProps } from '..'
import AcceptOfferFees from './fees'

const AcceptOffer: React.FC<Props> = (props) => {
  const { close, nftActions, orderFlow } = props

  const disabled = Remote.Loading.is(props.acceptOffer)

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
              <AcceptOfferFees {...props} />
              {props.orderFlow.fees.cata({
                Failure: (e) => (
                  <>
                    <Text
                      size='14px'
                      weight={600}
                      style={{ marginBottom: '8px', maxHeight: '200px' }}
                    >
                      {e}
                    </Text>
                    <Button jumbo nature='sent' fullwidth data-e2e='n/a' disabled>
                      <FormattedMessage id='copy.transfer' defaultMessage='Accept Offer' />
                    </Button>
                  </>
                ),
                Loading: () => (
                  <Button jumbo nature='primary' fullwidth data-e2e='n/a' disabled>
                    <FormattedMessage id='copy.transfer' defaultMessage='Accept Offer' />
                  </Button>
                ),
                NotAsked: () => null,
                Success: (fees) => (
                  <Button
                    jumbo
                    nature='primary'
                    fullwidth
                    data-e2e='acceptNftOffer'
                    disabled={disabled}
                    type='submit'
                    // onClick={() =>
                    //   nftActions.acceptOffer({
                    //     gasData: fees

                    //   })
                    // }
                  >
                    <FormattedMessage id='copy.accept_offer' defaultMessage='Accept Offer' />
                  </Button>
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

export default AcceptOffer
