import React from 'react'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'
import styled from 'styled-components'

import { Icon, Link, Text } from 'blockchain-info-components'
import CircleBackground from 'components/CircleBackground'
import { Wrapper } from 'components/Public'
import { media } from 'services/styles'

const OuterWrapper = styled(Wrapper)`
  padding: 24px 0;
  ${media.mobile`
  padding: 16px 0;
`}
`
const WrapperWithPadding = styled.div`
  padding: 0 32px;
  ${media.mobile`
  padding: 0 16px ;
  `}
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`

const SubCard = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 24px;
  border-top: 1px solid ${(props) => props.theme.grey000};
  padding: 0;
  ${media.mobile`
  flex-direction: column;
  align-items: center;
`};
`
const Right = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
`

const IconTextRow = styled.div`
  display: flex;
  align-items: flex-end;
  cursor: pointer;
`

const StyledCircle = styled(CircleBackground)`
  margin: 8px 16px 8px 0;
`

const TextStack = styled.div`
  max-width: 312px;
`

const BackArrow = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-bottom: 20px;
`

const StillNeedHelpRow = styled.div`
  display: flex;
  align-items: center;
  ${media.mobile`
flex-direction: column;
align-items: center;
`}
`
const ContactSupportText = styled(Link)`
  margin-top: 16px;
  cursor: pointer;
  ${media.mobile`
  margin-top: 0;
`};
  &:hover {
    font-weight: 600;
  }
`

const Help = () => {
  return (
    <OuterWrapper>
      <WrapperWithPadding>
        <LinkContainer to='/login'>
          <BackArrow>
            <Icon
              data-e2e='needHelpBack'
              name='arrow-back'
              size='24px'
              color='blue600'
              style={{ marginRight: '4px' }}
              role='button'
            />
            <Text color='grey900' size='14px' weight={500} lineHeight='1.5'>
              <FormattedMessage id='copy.back' defaultMessage='Back' />
            </Text>
          </BackArrow>
        </LinkContainer>
        <Header>
          <Text size='20px' color='grey900' weight={600} capitalize>
            <FormattedMessage id='copy.need_some_help' defaultMessage='Need some help?' />
          </Text>
        </Header>
        <LinkContainer to='/recover' style={{ marginBottom: '20px' }}>
          <IconTextRow>
            <StyledCircle size='48px'>
              <Icon name='keyboard' color='blue600' size='16px' />
            </StyledCircle>
            <TextStack>
              <Text color='grey900' size='14px' weight={600} lineHeight='1.5'>
                <FormattedMessage
                  id='scenes.help.forgotpassword'
                  defaultMessage='Forgot your password?'
                />
              </Text>
              <Text color='grey600' size='12px' weight={500} lineHeight='1.5'>
                <FormattedMessage
                  id='scenes.help.password.explain_phrase'
                  defaultMessage='Use your 12 word Secret Private Key Recovery Phrase to access your Wallet.'
                />
              </Text>
            </TextStack>
            <Right>
              <Icon name='chevron-right' size='20px' color='grey400' />
            </Right>
          </IconTextRow>
        </LinkContainer>
        <LinkContainer to='/reset-2fa'>
          <IconTextRow>
            <StyledCircle size='48px' color='blue000'>
              <Icon name='lock' color='blue600' size='24px' />
            </StyledCircle>
            <TextStack>
              <Text color='grey900' size='14px' weight={600} lineHeight='1.5'>
                <FormattedMessage id='scenes.help.2falost' defaultMessage='Lost your 2FA device?' />
              </Text>
              <Text color='grey600' size='12px' weight={500} lineHeight='1.5'>
                <FormattedMessage
                  id='scenes.help.2fa.lostexplain'
                  defaultMessage='Reset your 2FA right now to gain access to your Wallet.'
                />
              </Text>
            </TextStack>
            <Right>
              <Icon name='chevron-right' size='20px' color='grey400' />
            </Right>
          </IconTextRow>
        </LinkContainer>
      </WrapperWithPadding>
      <SubCard>
        <StillNeedHelpRow>
          <Text
            size='16px'
            color='grey600'
            weight={500}
            style={{ cursor: 'pointer', marginTop: '16px' }}
          >
            <FormattedMessage
              id='scenes.help.contact.stillneedhelp'
              defaultMessage='Still need help?'
            />
          </Text>
          &nbsp;
          <ContactSupportText
            href='https://support.blockchain.com/'
            target='_blank'
            size='16px'
            color='blue600'
            weight={500}
          >
            <FormattedMessage id='buttons.contact_support' defaultMessage='Contact Support' />
          </ContactSupportText>
        </StillNeedHelpRow>
      </SubCard>
    </OuterWrapper>
  )
}

export default Help
