import React from 'react'
import { FormattedMessage } from 'react-intl'
import { colors } from '@blockchain-com/constellation'
import styled from 'styled-components'

import { Button, Link, SpinningLoader, Text } from 'blockchain-info-components'

import { NftOrderStatusEnum } from '../../../../data/components/nfts/types'
import { Props as OwnProps } from '..'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-top: 15em;
  font-family: Inter, sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 24px;
`

const ButtonWrapper = styled.div`
  display: block;
  margin-left: 4em;
  position: absolute;
  bottom: 2em;
`

const NftOrderStatus: React.FC<Props> = (props: any) => {
  const returnToMarketPlace = () => {
    props.close()
  }
  const viewSubmittedOffer = () => {
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
              height='56px'
              onClick={returnToMarketPlace}
              size='large'
              width='20em'
              data-e2e='submitProfileDetails'
            >
              <Text color='white' size='16px' weight={500}>
                <FormattedMessage
                  id='modals.prompt.button'
                  defaultMessage='Return To Marketplace'
                />
              </Text>
            </Button>
            <Link href={props.data.permalink} target='_blank'>
              <Button
                nature='empty-blue'
                height='56px'
                size='large'
                width='20em'
                margin='0.5em 0em'
                onClick={viewSubmittedOffer}
                data-e2e='submitProfileDetails'
              >
                <Text color={colors.blue600} size='16px' weight={500}>
                  <FormattedMessage
                    id='modals.prompt.button'
                    defaultMessage='View Submitted Offer'
                  />
                </Text>
              </Button>
            </Link>
          </ButtonWrapper>
        </>
      )}
    </div>
  )
}

type Props = OwnProps

export default NftOrderStatus
