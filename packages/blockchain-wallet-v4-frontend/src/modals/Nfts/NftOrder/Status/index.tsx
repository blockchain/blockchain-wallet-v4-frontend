import React from 'react'
import styled from 'styled-components'

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
const NftOrderStatus: React.FC<Props> = (props: any) => {
  return (
    <div>
      {props.orderFlow.status === NftOrderStatusEnum.WRAP_ETH && (
        <Wrapper>
          <div>Wrapping ETH...</div>
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
      )}
    </div>
  )
}

type Props = OwnProps

export default NftOrderStatus
