import React from 'react'
import { Icon } from '@blockchain-com/constellation'
import { IconVerified } from '@blockchain-com/icons'
import { string } from 'prop-types'
import styled from 'styled-components'

import { SkeletonCircle } from 'blockchain-info-components'

const Wrapper = styled.div`
  position: relative;
`

export const StyledImage = styled.img<{ height: string; width: string }>`
  border-radius: 50%;
  height: ${({ height }) => height};
  width: ${({ width }) => width};
`
const IconWrapper = styled.div`
  position: absolute;
  top: -4px;
  right: -4px;
  height: 12px;
  width: 12px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1px;
  background: ${(props) => props.theme.white};
`

const NftCollectionImageSmall: React.FC<Props> = (props) => {
  const { alt, isVerified, src } = props
  const { height } = props
  const { width } = props

  return (
    <Wrapper>
      {isVerified ? (
        <IconWrapper>
          <Icon label='verified' color='orange400'>
            <IconVerified />
          </Icon>
        </IconWrapper>
      ) : null}
      {src !== '' ? (
        <StyledImage height={height || '24px'} width={width || '24px'} alt={alt} src={src} />
      ) : (
        <SkeletonCircle width={width || '24px'} height={height || '24px'} />
      )}
    </Wrapper>
  )
}

type Props = {
  alt: string
  height?: string
  isVerified: boolean
  src?: string
  width?: string
}

export default NftCollectionImageSmall
