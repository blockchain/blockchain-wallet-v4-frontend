import React from 'react'
import { PaletteColors } from '@blockchain-com/constellation'
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
    height: 100%;
  `

  const GridLoadingFooter = styled.div`
    background-color: ${PaletteColors['grey-000']};
    border-radius: 0px 0px 4px 4px;
    margin-top: -12px;
    padding: 1em;
  `

  return (
    <>
      {[...Array(items * 2)].map((e, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <LoadingAsset key={i}>
          <div style={{ width: '100%' }} className='asset-image-container'>
            <SkeletonRectangle bgColor='grey000' width='100%' height='100%' />
          </div>
          <GridLoadingFooter>
            <div
              style={{
                backgroundColor: PaletteColors['grey-000']
              }}
            >
              <Flex justifyContent='space-between' flexDirection='column'>
                <div>
                  <SkeletonRectangle height='24px' width='100%' />
                </div>
                <div style={{ marginTop: '16px' }}>
                  <SkeletonRectangle height='30px' width='100%' />
                </div>
              </Flex>
            </div>
          </GridLoadingFooter>
        </LoadingAsset>
      ))}
    </>
  )
}

type Props = {
  fullscreen: boolean
}

export default NftGridLoading
