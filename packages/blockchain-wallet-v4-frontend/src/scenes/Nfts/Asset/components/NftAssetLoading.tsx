import React from 'react'

import { SkeletonCircle, SkeletonRectangle } from 'blockchain-info-components'
import { Flex } from 'components/Flex'

import {
  AssetName,
  CurrentPriceBox,
  Divider,
  Highest,
  LeftColWrapper,
  RightColWrapper,
  Top,
  Wrapper
} from '.'

const NftAssetLoading: React.FC<Props> = () => {
  return (
    <Wrapper>
      <>
        <div style={{ display: 'block' }}>
          <Top>
            <LeftColWrapper>
              <SkeletonRectangle width='500px' height='500px' />
              <div>
                <div style={{ marginTop: '24px' }}>
                  <SkeletonRectangle width='100%' height='240px' />
                </div>
              </div>
            </LeftColWrapper>
            <RightColWrapper>
              <div
                style={{
                  alignItems: 'center',
                  display: 'flex',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ display: 'block', marginTop: '2px' }}>
                  <Flex gap={24}>
                    <Flex gap={8}>
                      <SkeletonCircle height='40px' width='40px' />
                      <SkeletonRectangle height='40px' width='100px' />
                    </Flex>
                    <Flex gap={8}>
                      <SkeletonCircle height='40px' width='40px' />
                      <SkeletonRectangle height='40px' width='100px' />
                    </Flex>
                  </Flex>
                </div>
              </div>
              <AssetName>
                <SkeletonRectangle height='48px' width='120px' />
              </AssetName>
              <CurrentPriceBox>
                <div>
                  <Highest>
                    <div style={{ marginBottom: '1em' }}>
                      <SkeletonRectangle height='18px' width='100px' />
                    </div>
                    <SkeletonRectangle height='24px' width='200px' />
                    <Divider style={{ marginBottom: '1em' }} />
                  </Highest>
                  <SkeletonRectangle width='200px' height='56px' />
                </div>
              </CurrentPriceBox>
              <Flex
                flexDirection='column'
                gap={24}
                style={{
                  padding: '1em 0em'
                }}
              >
                <SkeletonRectangle width='500px' height='48px' />
                <SkeletonRectangle width='500px' height='48px' />
                <SkeletonRectangle width='500px' height='48px' />
              </Flex>
            </RightColWrapper>
          </Top>
        </div>
      </>
    </Wrapper>
  )
}

type Props = {}

export default NftAssetLoading
