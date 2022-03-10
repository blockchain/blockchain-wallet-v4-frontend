import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import DOMPurify from 'dompurify'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { TermsAndConditionType } from '@core/types'
import { Button, Text } from 'blockchain-info-components'
import { CheckBox, Form } from 'components/Form'
import { model } from 'data'

import useVisibility from '../../Hooks/useVisibility'
import Container from '../Container'
import ContentWrapper from '../Content'
import Footer from '../Footer'

const { TERMS_AND_CONDITIONS_FORM } = model.components.termsAndConditions

const Header = styled.div`
  padding: 40px 40px 9px 40px;
  border-bottom: 1px solid ${(p) => p.theme.grey000};
  width: 100%;
  box-sizing: border-box;
  height: 88px;
  display: flex;
  justify-content: center;
`

const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`

const HeaderTitle = styled(Text)`
  display: flex;
  justify-content: center;
  text-align: left;
  flex: 1;
  max-height: 24px;
  overflow: hidden;
`

const Content = styled(ContentWrapper)`
  height: calc(100vh - 232px);
  min-height: calc(100vh - 232px);
  overflow-y: scroll;
  padding: 40px;
`

const CustomForm = styled(Form)`
  height: 100%;
  display: flex;
  flex-direction: column;
`
const CheckboxContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 40px 40px 0 40px;
`

const FooterWrapper = styled(Footer)`
  height: 100%;
  display: flex;
  flex-direction: column;
`
const PagePlaceholder = styled.div`
  padding: 0 40px;
  display: flex;
  flex-direction: column;
  flex: 1;
`

const TextWrapper = styled(Text)`
  color: ${(props) => props.theme.grey800};
  font-size: 12px;
  a {
    color: ${(props) => props.theme.blue600};
    text-decoration: none;
  }
`

const TextBox = styled.div`
  padding-top: 20px;
`

const TermsAndConditions: React.FC<InjectedFormProps<{}, Props> & Props> = (props) => {
  const [acceptTerms, setAcceptTerms] = useState<boolean>(false)
  const [showContinue, setShowContinue] = useState<boolean>(false)
  const [isVisible, currentElement] = useVisibility<HTMLDivElement>(100)

  const scrollToBottom = () => {
    if (currentElement && !showContinue) {
      currentElement.current?.scrollIntoView({ behavior: 'smooth' })
      setShowContinue(true)
    }
  }

  if (isVisible && !showContinue) {
    setShowContinue(true)
  }

  const onCheckboxChecked = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAcceptTerms(e.target.checked)
  }

  return (
    <Container>
      <CustomForm onSubmit={props.handleSubmit}>
        <Header>
          <HeaderWrapper>
            <HeaderTitle size='24px' weight={600} color='grey900' lineHeight='24px'>
              <FormattedMessage
                id='modals.terms_and_conditions.title'
                defaultMessage='Review Our New Terms'
              />
            </HeaderTitle>
          </HeaderWrapper>
        </Header>
        <Content mode='top'>
          <PagePlaceholder>
            <TextWrapper>
              <TextBox
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(props.termsAndConditions.termsAndConditions)
                }}
              />
            </TextWrapper>
          </PagePlaceholder>
          <CheckboxContainer ref={currentElement}>
            <Field
              name='acceptTermsAndConditions'
              component={CheckBox}
              onChange={onCheckboxChecked}
            >
              <TextWrapper>
                <FormattedMessage
                  id='modals.terms_and_conditions.confirm_label'
                  defaultMessage='I agree to Blockchain.com’s <a>Terms of Service & Privacy Policy.</a>'
                  values={{
                    a: (msg) => (
                      <a
                        href='https://support.blockchain.com/hc/en-us/articles/360029029911-Your-Wallet-101'
                        rel='noopener noreferrer'
                        target='_blank'
                      >
                        {msg}
                      </a>
                    )
                  }}
                />
              </TextWrapper>
            </Field>
          </CheckboxContainer>
        </Content>
        <FooterWrapper collapsed>
          {showContinue && (
            <Button
              nature='primary'
              data-e2e='signNewTermsAndConditions'
              type='submit'
              fullwidth
              height='48px'
              style={{ marginTop: '16px' }}
              disabled={!acceptTerms}
            >
              <FormattedMessage id='buttons.continue' defaultMessage='Continue' />
            </Button>
          )}
          {!showContinue && (
            <Button
              nature='light'
              data-e2e='signNewTermsAndConditions'
              type='button'
              fullwidth
              height='48px'
              style={{ marginTop: '16px' }}
              onClick={scrollToBottom}
            >
              <FormattedMessage id='buttons.review' defaultMessage='Review' />
            </Button>
          )}
        </FooterWrapper>
      </CustomForm>
    </Container>
  )
}

export type Props = {
  handleSubmit: (e) => void
  termsAndConditions: TermsAndConditionType
}

export default reduxForm<{}, Props>({
  destroyOnUnmount: false,
  form: TERMS_AND_CONDITIONS_FORM
})(TermsAndConditions)
