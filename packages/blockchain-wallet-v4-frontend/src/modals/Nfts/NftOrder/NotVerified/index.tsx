import React from 'react'
import { FormattedMessage } from 'react-intl'
import { colors } from '@blockchain-com/constellation'
import styled from 'styled-components'

import { Button, Text } from 'blockchain-info-components'
import { Flex } from 'components/Flex'
import { StickyHeaderWrapper, Title } from 'components/Flyout'
import FlyoutHeader from 'components/Flyout/Header'
import { useRemote } from 'hooks'

import { StickyCTA } from '../../components'
import NftFlyoutFailure from '../../components/NftFlyoutFailure'
import NftFlyoutLoader from '../../components/NftFlyoutLoader'
import { Props as OwnProps } from '..'

const Wrapper = styled(Text)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  font-style: normal;
  height: 100%;
`

const NftOrderNotVerified: React.FC<Props> = (props) => {
  const { close, nftActions, openSeaAssetR, orderFlow } = props
  const openSeaAsset = useRemote(() => openSeaAssetR)
  if (openSeaAsset.isLoading) return <NftFlyoutLoader />
  if (openSeaAsset.error)
    return <NftFlyoutFailure error={openSeaAsset.error || ''} close={props.close} />

  const val = openSeaAsset.data

  if (!val) return <NftFlyoutFailure error='Error fetching asset data.' close={close} />

  return (
    <div style={{ height: '100%' }}>
      <StickyHeaderWrapper>
        <FlyoutHeader data-e2e='wrapEthHeader' mode='back' onClick={() => close()} />
      </StickyHeaderWrapper>
      <Wrapper>
        <div>
          {val.collection.image_url ? (
            <Flex justifyContent='center'>
              <img
                style={{
                  borderRadius: '8px',
                  height: '64px',
                  width: 'auto'
                }}
                alt='nft-asset'
                src={val.collection.image_url}
              />
            </Flex>
          ) : null}
          <Text
            size='20px'
            color={colors.black}
            weight={600}
            style={{ marginTop: '1em', textAlign: 'center' }}
          >
            This Collection Is Not Yet Verified
          </Text>
          <Text
            size='14px'
            color={colors.grey600}
            weight={500}
            style={{ padding: '1em', textAlign: 'center' }}
          >
            Blockchain.com can not verify the validity or safety of this collection and recommend
            you proceed with caution
          </Text>
        </div>
        <StickyCTA>
          <Button
            nature='primary'
            height='56px'
            onClick={() => {
              if (orderFlow.prevStep) {
                nftActions.setOrderFlowStep({ step: orderFlow.prevStep })
              }
            }}
            size='large'
            width='20em'
            data-e2e='submitProfileDetails'
          >
            <Text color='white' size='16px' weight={500}>
              <FormattedMessage id='buttons.continue' defaultMessage='Continue' />
            </Text>
          </Button>
          <Button
            nature='empty-blue'
            height='56px'
            size='large'
            width='20em'
            margin='0.5em 0em'
            onClick={() => props.close()}
            data-e2e='submitProfileDetails'
          >
            <Text color={colors.blue600} size='16px' weight={500}>
              <FormattedMessage id='buttons.cancel_goback' defaultMessage='Cancel & Go Back' />
            </Text>
          </Button>
        </StickyCTA>
      </Wrapper>
    </div>
  )
}

type Props = OwnProps

export default NftOrderNotVerified
