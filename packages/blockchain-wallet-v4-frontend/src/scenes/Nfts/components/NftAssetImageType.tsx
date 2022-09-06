import React from 'react'
import {
  IconImage,
  IconPlayCircle,
  IconQuestion,
  PaletteColors
} from '@blockchain-com/constellation'
import styled from 'styled-components'

const Wrapper = styled.div<{ right: string; top: string }>`
  position: absolute;
  top: ${(props) => props.top};
  padding: 8px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(props) => props.theme.greyFade400};
  right: ${(props) => props.right};
`

const NftAssetImageType: React.FC<Props> = ({ animation_url, image_url, ...rest }) => {
  let IconComponent

  switch (true) {
    case !!animation_url:
      IconComponent = IconPlayCircle
      break
    case !!image_url:
      IconComponent = IconPlayCircle
      break

    default:
      IconComponent = IconQuestion
  }

  return (
    <Wrapper {...rest}>
      <IconComponent color={PaletteColors['white-900']} label='asset-type' size='small' />
    </Wrapper>
  )
}

type Props = {
  animation_url?: string | null
  image_url?: string | null
  right: string
  top: string
}

export default NftAssetImageType
