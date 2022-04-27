import React from 'react'

import { SkeletonRectangle } from 'blockchain-info-components'
import { Flex } from 'components/Flex'

import { Asset, LOADING_ITEMS_COUNT } from '.'

const NftGridLoading = () => {
  return (
    <>
      {[...Array(LOADING_ITEMS_COUNT)].map((e, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <Asset key={i}>
          <SkeletonRectangle width='100%' height='285px' />
          <div style={{ boxSizing: 'border-box', minHeight: '120px', padding: '12px 8px' }}>
            <Flex style={{ height: '100%' }} justifyContent='space-between' flexDirection='column'>
              <div>
                <SkeletonRectangle height='24px' width='100px' />
                <div style={{ marginTop: '4px' }} />
                <SkeletonRectangle height='16px' width='120px' />
                <div style={{ marginTop: '4px' }} />
              </div>
              <SkeletonRectangle height='38px' width='100%' />
            </Flex>
          </div>
        </Asset>
      ))}
    </>
  )
}

export default NftGridLoading
