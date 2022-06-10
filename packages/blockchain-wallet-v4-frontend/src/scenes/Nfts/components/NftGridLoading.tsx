import React from 'react'
import styled from 'styled-components'

import { SkeletonRectangle } from 'blockchain-info-components'
import { Flex } from 'components/Flex'
import { useMedia } from 'services/styles'

import { Asset } from '.'
import { getNftGridSize } from './NftGrid'

const NftGridLoading: React.FC<Props> = ({ fullscreen }) => {
  const isDesktop = useMedia('desktop')
  const isLaptopL = useMedia('laptopL')
  const isLaptop = useMedia('laptop')
  const isTablet = useMedia('tablet')

  const items = getNftGridSize(fullscreen, isDesktop, isLaptopL, isLaptop, isTablet)

  const LoadingAsset = styled(Asset)`
    background: white;
  `

  return (
    <>
      {[...Array(items * 2)].map((e, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <LoadingAsset key={i}>
          <div style={{ marginBottom: '12px' }}>
            <SkeletonRectangle height='28px' width='100%' />
          </div>
          <div className='asset-image-container'>
            <SkeletonRectangle width='100%' height='100%' />
          </div>
          <div style={{ boxSizing: 'border-box', padding: '12px 0px 0px' }}>
            <Flex style={{ height: '100%' }} justifyContent='space-between' flexDirection='column'>
              <div>
                <SkeletonRectangle height='24px' width='100%' />
              </div>
              <div style={{ marginTop: '16px' }}>
                <SkeletonRectangle height='30px' width='100%' />
              </div>
            </Flex>
          </div>
        </LoadingAsset>
      ))}
    </>
  )
}

type Props = {
  fullscreen: boolean
}

export default NftGridLoading
