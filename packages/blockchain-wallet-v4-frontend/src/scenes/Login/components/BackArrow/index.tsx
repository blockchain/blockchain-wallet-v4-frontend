import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Icon } from '@blockchain-com/constellation'
import { IconArrowLeft } from '@blockchain-com/icons'
import styled from 'styled-components'

import { Text } from 'blockchain-info-components'

const BackArrowWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  > span {
    margin-left: 0.5rem;
  }
`
const BackArrowSpan = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`
const AdditionalHeaderText = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`

const BackArrow = (props: { additionalText?: string; handleBack?: () => void }) => {
  return (
    <BackArrowWrapper onClick={props.handleBack}>
      <BackArrowSpan>
        <Icon data-e2e='goBack' label='back' size='md' color='blue600'>
          <IconArrowLeft />
        </Icon>
        <Text color='grey900' size='14px' weight={500} lineHeight='1.5'>
          <FormattedMessage id='copy.back' defaultMessage='Back' />
        </Text>
      </BackArrowSpan>
      <AdditionalHeaderText>
        <Text color='blue600' size='12px' weight={500} lineHeight='1.5'>
          <FormattedMessage
            id={`copy.${props.additionalText}`}
            defaultMessage={props.additionalText}
          />
        </Text>
      </AdditionalHeaderText>
    </BackArrowWrapper>
  )
}

export default BackArrow
