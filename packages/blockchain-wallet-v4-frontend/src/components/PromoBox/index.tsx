import React from 'react'
import styled from 'styled-components'

import { Icon } from 'blockchain-info-components'

const BoxContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
`

const TopRow = styled.div``
const TagList = styled.div``
const Title = styled.h3``
const Description = styled.div``

interface Props {
  closeAction?: () => void
  tags?: React.ReactElement
}

const PromoBox = ({ closeAction, tags }: Props) => {
  return (
    <BoxContainer>
      <TopRow>
        <TagList>{tags}</TagList>
        <Icon
          data-e2e='promoBoxClose'
          name='close'
          size='14px'
          weight={600}
          color='grey500'
          cursor
          onClick={closeAction}
        />
      </TopRow>
      <Title>Foo</Title>
      <Description>Bar</Description>
    </BoxContainer>
  )
}

export default PromoBox
