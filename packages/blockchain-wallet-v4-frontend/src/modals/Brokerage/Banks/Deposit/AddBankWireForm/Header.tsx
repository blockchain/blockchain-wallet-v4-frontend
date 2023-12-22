import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Icon, Text } from 'blockchain-info-components'

export const BackContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 1.5rem;
`

type Props = {
  onClickBack?: () => void
}

export const Header = ({ onClickBack }: Props) => (
  <BackContainer>
    {onClickBack && (
      <Icon
        cursor
        name='arrow-left'
        size='20px'
        color='grey600'
        style={{ marginRight: '1rem' }}
        role='button'
        onClick={onClickBack}
      />
    )}
    <Text size='16px' weight={600}>
      <FormattedMessage id='modals.simplebuy.wiretransfer' defaultMessage='Wire Transfer' />
    </Text>
  </BackContainer>
)
