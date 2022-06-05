import React from 'react'

import { SkeletonCircle, SkeletonRectangle, SpinningLoader, Text } from 'blockchain-info-components'

import {
  AssetName,
  CurrentPriceBox,
  Divider,
  Highest,
  LeftColWrapper,
  MoreAssets,
  MoreAssetsList,
  MoreAssetsListItem,
  NftAssetStickyWrapper,
  RightColWrapper,
  Top,
  Trait,
  TraitsWrapper,
  Wrapper
} from '.'

const NftAssetLoading: React.FC<Props> = () => {
  return (
    <Wrapper>
      <>
        <div style={{ display: 'block' }}>
          <Top>
            <LeftColWrapper>
              <NftAssetStickyWrapper>
                <SkeletonRectangle height='500px' width='100%' />
              </NftAssetStickyWrapper>
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
                  <Text
                    size='14px'
                    weight={600}
                    style={{
                      alignItems: 'center',
                      padding: '0em 0em 0.5em 0em'
                    }}
                  >
                    Collection
                  </Text>
                  <SkeletonRectangle height='24px' width='100px' />
                </div>
                <SkeletonCircle height='40px' width='40px' />
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
                    <SpinningLoader height='14px' width='14px' borderWidth='3px' />
                  </Highest>
                  <SkeletonRectangle width='200px' height='56px' />
                </div>
              </CurrentPriceBox>
              <div>
                <TraitsWrapper>
                  <Trait>
                    <SkeletonRectangle width='100px' height='76px' />
                  </Trait>
                  <Trait>
                    <SkeletonRectangle width='200px' height='76px' />
                  </Trait>
                  <Trait>
                    <SkeletonRectangle width='40px' height='76px' />
                  </Trait>
                  <Trait>
                    <SkeletonRectangle width='100px' height='76px' />
                  </Trait>
                  <Trait>
                    <SkeletonRectangle width='100px' height='76px' />
                  </Trait>
                  <Trait>
                    <SkeletonRectangle width='50px' height='76px' />
                  </Trait>
                  <Trait>
                    <SkeletonRectangle width='70px' height='76px' />
                  </Trait>
                </TraitsWrapper>
              </div>
              <div style={{ marginTop: '24px' }}>
                <SkeletonRectangle width='100%' height='240px' />
              </div>
            </RightColWrapper>
          </Top>
          <div style={{ display: 'flex', width: '100%' }}>
            <MoreAssets>
              <div
                style={{
                  alignItems: 'center',
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: '40px'
                }}
              >
                <Text color='grey700' weight={600} capitalize>
                  More from this collection
                </Text>
              </div>
              <MoreAssetsList>
                <MoreAssetsListItem>
                  <div style={{ margin: '1em' }}>
                    <SkeletonRectangle width='100%' height='280px' />
                  </div>
                </MoreAssetsListItem>
                <MoreAssetsListItem>
                  <div style={{ margin: '1em' }}>
                    <SkeletonRectangle width='100%' height='280px' />
                  </div>
                </MoreAssetsListItem>
                <MoreAssetsListItem>
                  <div style={{ margin: '1em' }}>
                    <SkeletonRectangle width='100%' height='280px' />
                  </div>
                </MoreAssetsListItem>
                <MoreAssetsListItem>
                  <div style={{ margin: '1em' }}>
                    <SkeletonRectangle width='100%' height='280px' />
                  </div>
                </MoreAssetsListItem>
              </MoreAssetsList>
            </MoreAssets>
          </div>
        </div>
      </>
    </Wrapper>
  )
}

type Props = {}

export default NftAssetLoading
