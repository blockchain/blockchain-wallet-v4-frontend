import React from 'react'

import { SkeletonCircle, SkeletonRectangle, SpinningLoader } from 'blockchain-info-components'
import { Flex } from 'components/Flex'
import { useMedia } from 'services/styles'

import { CollectionHeader, GridWrapper, NftPageFullWidth } from '../components'

const NftCollectionLoading: React.FC<Props> = () => {
  const isTablet = useMedia('tablet')

  return (
    <NftPageFullWidth>
      <CollectionHeader>
        <SkeletonRectangle height='100%' width='100%' />
      </CollectionHeader>
      {isTablet ? (
        <div style={{ marginTop: '20px', width: '100%' }}>
          <Flex justifyContent='center' alignItems='center'>
            <SpinningLoader height='14px' width='14px' borderWidth='3px' />
          </Flex>
        </div>
      ) : (
        <GridWrapper>
          <div style={{ marginTop: '20px', minWidth: '300px', width: '300px' }}>
            <Flex justifyContent='space-between'>
              <SkeletonRectangle width='100px' height='28px' />
              <SkeletonCircle height='24px' width='24px' />
            </Flex>
            <div style={{ marginTop: '40px' }} />
            <SkeletonRectangle width='72px' height='24px' />
            <div style={{ marginTop: '8px' }} />
            <Flex flexDirection='column' gap={8}>
              <SkeletonRectangle width='100%' height='48px' />
              <SkeletonRectangle width='100%' height='48px' />
              <SkeletonRectangle width='100%' height='48px' />
              <SkeletonRectangle width='100%' height='48px' />
            </Flex>
            <div style={{ marginTop: '20px' }} />
            <SkeletonRectangle width='72px' height='24px' />
            <div style={{ marginTop: '8px' }} />
            <Flex flexDirection='column' gap={8}>
              <SkeletonRectangle width='100%' height='48px' />
              <SkeletonRectangle width='100%' height='48px' />
              <SkeletonRectangle width='100%' height='48px' />
            </Flex>
          </div>
          <div style={{ marginTop: '20px', width: '100%' }}>
            <Flex justifyContent='center' alignItems='center'>
              <SpinningLoader height='14px' width='14px' borderWidth='3px' />
            </Flex>
          </div>
        </GridWrapper>
      )}
    </NftPageFullWidth>
  )
}

type Props = {}

export default NftCollectionLoading
