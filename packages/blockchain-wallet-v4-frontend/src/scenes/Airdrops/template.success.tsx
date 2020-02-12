import { CampaignInfoType, KycStatesType, TagsType } from 'data/types'
import { LinkDispatchPropsType } from '.'
import AirdropInfo from './AirdropInfo'
import media from 'services/ResponsiveService'
import React from 'react'
import StxAirdrop from './StxAirdrop'
import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  > div {
    margin-right: 24px;
    &:last-child {
      margin-right: 0px;
    }
  }
  ${media.laptop`
    flex-direction: column;
    align-items: start;
    > div {
      margin-right: 0;
      margin-bottom: 12px;
    }
  `};
`

export type Props = {
  kycState: KycStatesType
  tags: TagsType
  userCampaignsInfoResponseList: Array<CampaignInfoType>
  userDoesNotExistYet?: boolean
}

const Success = (props: Props & LinkDispatchPropsType) => {
  return (
    <Container>
      <AirdropInfo {...props} />
      <StxAirdrop {...props} />
    </Container>
  )
}

export default Success
