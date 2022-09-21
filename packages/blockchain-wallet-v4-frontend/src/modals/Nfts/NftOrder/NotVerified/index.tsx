import React from 'react'
import { FormattedMessage } from 'react-intl'
import { PaletteColors } from '@blockchain-com/constellation'
import styled from 'styled-components'

import { Button, Text } from 'blockchain-info-components'
import { Flex } from 'components/Flex'
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
  bottom: 0;
`

const NftOrderNotVerified: React.FC<Props> = (props) => {
  const { close, nftActions, openSeaAssetR, orderFlow } = props
  const openSeaAsset = useRemote(() => openSeaAssetR)
  if (openSeaAsset.isLoading) return <NftFlyoutLoader close={props.close} />
  if (openSeaAsset.error)
    return <NftFlyoutFailure error={openSeaAsset.error || ''} close={props.close} />

  const val = openSeaAsset.data

  if (!val) return <NftFlyoutFailure error='Error fetching asset data.' close={close} />

  return (
    <>
      <FlyoutHeader sticky data-e2e='wrapEthHeader' mode='back' onClick={() => close()} />
      <Wrapper>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            justifyContent: 'center'
          }}
        >
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
            color={PaletteColors['grey-900']}
            weight={600}
            style={{ marginTop: '1em', textAlign: 'center' }}
          >
            This Collection Is Not Yet Verified
          </Text>
          <Text
            size='14px'
            color={PaletteColors['grey-600']}
            weight={500}
            style={{ padding: '1em', textAlign: 'center' }}
          >
            Blockchain.com can not verify the validity or safety of this collection and recommend
            you proceed with caution.
          </Text>
        </div>
      </Wrapper>
      <StickyCTA>
        <div style={{ width: '100%' }}>
          <Flex gap={8} flexDirection='column'>
            <Button
              nature='primary'
              fullwidth
              onClick={() => {
                if (orderFlow.prevStep) {
                  nftActions.setOrderFlowStep({ step: orderFlow.prevStep })
                }
              }}
              jumbo
              data-e2e='submitProfileDetails'
            >
              <FormattedMessage id='buttons.continue' defaultMessage='Continue' />
            </Button>
            <Button
              nature='empty-blue'
              fullwidth
              jumbo
              onClick={() => props.close()}
              data-e2e='submitProfileDetails'
            >
              <FormattedMessage id='buttons.cancel' defaultMessage='Cancel' />
            </Button>
          </Flex>
        </div>
      </StickyCTA>
    </>
  )
}

type Props = OwnProps

export default NftOrderNotVerified
