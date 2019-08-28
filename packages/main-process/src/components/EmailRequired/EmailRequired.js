import React from 'react'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'
import styled from 'styled-components'

import { Image, Link, Text, TextGroup } from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px;
  width: 100%;
`

const EmailRequired = () => (
  <Wrapper>
    <Image name='empty-search' width='260px' />
    <TextGroup inline style={{ marginTop: '10px' }}>
      <Text size='18px' weight={400}>
        <FormattedMessage
          id='components.emailrequired.emailrequired'
          defaultMessage='Email is required to use this feature.'
        />
      </Text>
      <LinkContainer
        to={{ pathname: '/security-center', state: { changeEmail: true } }}
      >
        <Link size='18px'>
          <FormattedMessage
            id='components.emailrequired.addemail'
            defaultMessage='Add email'
          />
        </Link>
      </LinkContainer>
    </TextGroup>
  </Wrapper>
)

export default EmailRequired
