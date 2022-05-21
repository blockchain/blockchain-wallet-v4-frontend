import React from 'react'
import { FormattedMessage } from 'react-intl'
import { withRouter } from 'react-router-dom'
import { Icon, Text } from '@blockchain-com/constellation'
import { IconArrowLeft } from '@blockchain-com/icons'
import styled from 'styled-components'

const BackArrowWrapper = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;

  > span {
    margin-left: 0.5rem;
  }
`

const BackArrow = ({ handleBack, history }) => {
  const handleBackButton = () => {
    if (handleBack) {
      handleBack()
    } else {
      history.goBack()
    }
  }
  return (
    <BackArrowWrapper onClick={handleBackButton}>
      <Icon data-e2e='goBack' label='back' size='md' color='blue600'>
        <IconArrowLeft />
      </Icon>
      <Text color='grey900' variant='paragraph-1'>
        <FormattedMessage id='copy.back' defaultMessage='Back' />
      </Text>
    </BackArrowWrapper>
  )
}

export default withRouter(BackArrow)
