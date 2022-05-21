import React from 'react'

import { SkeletonCircle, SkeletonRectangle } from 'blockchain-info-components'
import { Flex } from 'components/Flex'
import { useMedia } from 'services/styles'

const NftCollectionTableLoading: React.FC<Props> = () => {
  const isTablet = useMedia('tablet')

  return (
    <div style={{ paddingTop: '0px', position: 'relative' }}>
      <div style={{ marginTop: '20px', width: '100%' }}>
        <SkeletonRectangle height='48px' width='100%'>
          <Flex alignItems='center' style={{ gap: '15%', height: '100%', margin: '0em 1em' }} />
        </SkeletonRectangle>
        <Flex flexDirection='column' gap={8} style={{ marginTop: '8px' }}>
          <Flex gap={8}>
            <SkeletonRectangle width='100%' height='48px' />
            <SkeletonRectangle width='100%' height='48px' />
            {!isTablet && (
              <>
                <SkeletonRectangle width='100%' height='48px' />
                <SkeletonRectangle width='100%' height='48px' />
                <SkeletonRectangle width='100%' height='48px' />
              </>
            )}
          </Flex>
          <Flex gap={8}>
            <SkeletonRectangle width='100%' height='48px' />
            <SkeletonRectangle width='100%' height='48px' />
            {!isTablet && (
              <>
                <SkeletonRectangle width='100%' height='48px' />
                <SkeletonRectangle width='100%' height='48px' />
                <SkeletonRectangle width='100%' height='48px' />
              </>
            )}
          </Flex>
          <Flex gap={8}>
            <SkeletonRectangle width='100%' height='48px' />
            <SkeletonRectangle width='100%' height='48px' />
            {!isTablet && (
              <>
                <SkeletonRectangle width='100%' height='48px' />
                <SkeletonRectangle width='100%' height='48px' />
                <SkeletonRectangle width='100%' height='48px' />
              </>
            )}
          </Flex>
        </Flex>
      </div>
    </div>
  )
}

type Props = {}

export default NftCollectionTableLoading
