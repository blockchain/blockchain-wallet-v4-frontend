import { FormattedMessage } from 'react-intl'
import { Icon, Text } from 'blockchain-info-components'
import { Wrapper } from 'components/Public'
import React from 'react'
import styled from 'styled-components'

const PublicWrapper = styled(Wrapper)`
  margin-bottom: 20px;
  padding: 20px 30px;
`
const Container = styled.div`
  display: flex;
  align-items: center;
  background: ${props => props.theme['white']};
`
const Copy = styled.div`
  margin-left: 16px;
`

const AirdropCallout = props => {
  return props.path === '/login' || props.path === '/signup' ? (
    <PublicWrapper>
      <Container>
        <Icon name='parachute' color='green600' size='32px' />
        <Copy>
          <Text size='16px' color='grey800' weight={600}>
            <FormattedMessage
              id='public.airdrop.wereairdropping'
              defaultMessage='We’re Airdropping Free Crypto!'
            />
          </Text>
          <Text
            size='14px'
            color='grey600'
            weight={500}
            style={{ marginTop: '2px' }}
          >
            {props.path === '/login' ? (
              <FormattedMessage
                id='public.airdrop.gold'
                defaultMessage='Gold Level users reserve your spot today!'
              />
            ) : (
              <FormattedMessage
                id='public.airdrop.upgrade'
                defaultMessage='Complete your Wallet profile to secure your spot today.'
              />
            )}
          </Text>
        </Copy>
      </Container>
    </PublicWrapper>
  ) : null
}

export default AirdropCallout
