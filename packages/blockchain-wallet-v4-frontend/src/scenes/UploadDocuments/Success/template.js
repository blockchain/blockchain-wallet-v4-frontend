import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { FarCheckCircle } from '@blockchain-com/components'
import { NavLink } from 'react-router-dom'

import { Button, Text, TextGroup } from 'blockchain-info-components'

const CheckCircleIcon = styled(FarCheckCircle)`
  fill: ${props => props.theme['success']};
`

const SuccessText = styled(Text)`
  padding-bottom: 16px;
`

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 35px;
  box-sizing: border-box;
  background-color: ${props => props.theme['white-blue']};
  max-width: 720px;
  & > * {
    padding-bottom: 10px;
  }
`

const UploadDocumentsSuccess = ({ reference }) => (
  <Wrapper>
    <CheckCircleIcon />
    <Text color='brand-primary' size='24px'>
      <FormattedMessage
        id='scenes.uploaddoc.success.success'
        defaultMessage='Success!'
      />
    </Text>
    <TextGroup inline>
      <Text color='brand-primary' size='16px' weight={300}>
        <FormattedMessage
          id='scenes.uploaddoc.success.reference'
          defaultMessage='Reference '
        />
      </Text>
      <Text>{reference}</Text>
    </TextGroup>
    <SuccessText color='brand-primary' size='20px' weight={300}>
      <FormattedMessage
        id='scenes.uploaddoc.success.explanation'
        defaultMessage='We have received your files. A Blockchain Team Member 
        will be reviewing your ID check shortly. Look for an email from us on
        your new account status.'
      />
    </SuccessText>
    <Button nature='primary'>
      <NavLink style={{ textDecoration: 'none' }} to='/login'>
        <Text color='white' size='16px' weight={300}>
          <FormattedMessage
            id='scenes.uploaddoc.success.return'
            defaultMessage='Return to the wallet'
          />
        </Text>
      </NavLink>
    </Button>
  </Wrapper>
)

UploadDocumentsSuccess.propTypes = {
  reference: PropTypes.string.isRequired
}

export default UploadDocumentsSuccess
