import { CampaignInfoType, KycStatesType, TagsType } from 'data/types'
import { Container } from 'components/Box'
import { LinkDispatchPropsType } from '.'
import AirdropInfo from './AirdropInfo'
import React from 'react'
import StxAirdrop from './StxAirdrop'

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
