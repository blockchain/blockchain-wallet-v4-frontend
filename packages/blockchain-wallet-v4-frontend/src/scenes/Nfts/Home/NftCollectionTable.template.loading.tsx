import React from 'react'
import styled from 'styled-components'

import { SkeletonRectangle } from 'blockchain-info-components'
import { Flex } from 'components/Flex'
import { media, useMedia } from 'services/styles'

const NftCollectionTableLoading: React.FC<Props> = () => {
  const isTablet = useMedia('tablet')
  const CustomRectangleHeader = styled(SkeletonRectangle)`
    height: 56px;
    width: 100%;
    border-radius: 24px 24px 0px 0px;
    ${media.mobile`
      border-radius: unset;
  `}
  `

  const CustomRectangle = styled(SkeletonRectangle)`
    height: 36px;
    margin-top: 12px;
    width: 100%;
    background: linear-gradient(270.04deg, #f0f2f7 42.26%, #ffffff 51.67%, #f0f2f7 63.26%);
    border-radius: 2px;
  `
  return (
    <div style={{ paddingTop: '0px', position: 'relative' }}>
      <div style={{ marginTop: '20px', width: '100%' }}>
        <CustomRectangleHeader>
          <Flex alignItems='center' style={{ gap: '15%', height: '100%', margin: '0em 1em' }} />
        </CustomRectangleHeader>
        <Flex flexDirection='column' gap={16} style={{ marginTop: '8px' }}>
          <Flex gap={36}>
            <CustomRectangle />
            <CustomRectangle />
            {!isTablet && (
              <>
                <CustomRectangle />
                <CustomRectangle />
                <CustomRectangle />
              </>
            )}
          </Flex>
          <Flex gap={36}>
            <CustomRectangle />
            <CustomRectangle />
            {!isTablet && (
              <>
                <CustomRectangle />
                <CustomRectangle />
                <CustomRectangle />
              </>
            )}
          </Flex>
          <Flex gap={36}>
            <CustomRectangle />
            <CustomRectangle />
            {!isTablet && (
              <>
                <CustomRectangle />
                <CustomRectangle />
                <CustomRectangle />
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
