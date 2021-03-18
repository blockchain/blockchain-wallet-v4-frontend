import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Form, InjectedFormProps, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { Button, Icon, Image, Link, Text } from 'blockchain-info-components'
import { FlyoutWrapper } from 'components/Flyout'
import { FormGroup } from 'components/Form'
import { SBAddCardErrorType } from 'data/types'

import { Props as _P, SuccessStateType } from '.'

const CustomFlyoutWrapper = styled(FlyoutWrapper)`
  height: 100%;
`
const NavText = styled(Text)`
  display: flex;
  align-items: center;
  margin-bottom: 24px;
`

const HeaderText = styled(Text)`
  font-weight: 500;
  font-size: 14px;
  line-height: 21px;
`

const StyledHeading = styled(Text)`
  font-size: 14px;
  font-weight: 600;
`

const BodyText = styled(Text)`
  text-align: center;
  font-size: 12px;
  font-weight: 500;
  line-height: 18px;
  padding: 0 5px;
  margin-bottom: 40px;

  & a {
    font-size: 12px;
  }
`

const TermsText = styled(Text)`
  font-size: 12px;
  font-weight: 500;
  text-align: center;
  padding: 0 30px;
  line-height: 18px;

  & a {
    font-size: 12px;
  }
`

const Success: React.FC<InjectedFormProps<{}, Props, ErrorType> & Props> = ({
  handleBack,
  handleSubmit,
  submitting
}) => {
  return (
    <CustomFlyoutWrapper>
      <NavText color='grey800' size='20px' weight={600}>
        <Icon
          cursor
          name='arrow-back'
          size='20px'
          color='grey600'
          role='button'
          style={{ marginRight: '24px' }}
          onClick={handleBack}
        />
        <FormattedMessage
          id='buttons.link_bank'
          defaultMessage='Link a Bank Account'
        />
      </NavText>
      <Form onSubmit={handleSubmit}>
        <FormGroup margin='24px'>
          <HeaderText color='grey900'>
            <FormattedMessage
              id='modals.brokerage.link_bank'
              defaultMessage='Blockchain.com uses Yodlee to verify your bank credentials & securely link your accounts.'
            />
          </HeaderText>
          <Image
            width='297px'
            style={{ margin: '90px auto 50px' }}
            name='yodlee-connect'
          />
          <BodyText color='grey600'>
            <StyledHeading color='grey900'>
              <FormattedMessage
                id='modals.simplebuy.secure_connection'
                defaultMessage='Secure Connection'
              />
            </StyledHeading>
            <FormattedMessage
              id='modals.brokerage.yodlee_description'
              defaultMessage='Yodlee securely stores your credentials adhering to leading industry practices for data security, regulatory compliance, and privacy.'
            />{' '}
            <Link
              href='https://www.yodlee.com/legal/yodlee-security'
              rel='noopener noreferrer'
              target='_blank'
            >
              <FormattedMessage
                defaultMessage='Learn More'
                id='modals.simplebuy.summary.learn_more'
              />
            </Link>
          </BodyText>
        </FormGroup>
        <FormGroup>
          <Button
            nature='primary'
            data-e2e='linkBankContinue'
            height='48px'
            size='16px'
            type='submit'
            disabled={submitting}
          >
            <FormattedMessage id='buttons.continue' defaultMessage='Continue' />
          </Button>
        </FormGroup>
        <TermsText color='grey600'>
          <FormattedMessage
            id='modals.brokerage.link_bank_yodlee_terms'
            defaultMessage="By hitting Continue, you Agree to Yodlee's"
          />{' '}
          <Link
            href='https://www.yodlee.com/legal/terms-of-use'
            rel='noopener noreferrer'
            target='_blank'
          >
            <FormattedMessage
              id='scenes.register.registerform.blockchain.default.terms_conditions'
              defaultMessage='Terms and Conditions'
            />
          </Link>{' '}
          <FormattedMessage
            id='scenes.securitycenter.2fa.tip.two'
            defaultMessage='and'
          />{' '}
          <Link
            href='https://www.yodlee.com/legal/privacy-notice'
            rel='noopener noreferrer'
            target='_blank'
          >
            <FormattedMessage
              id='scenes.register.registerform.blockchain.default.privacypolicy'
              defaultMessage='Privacy Policy'
            />
          </Link>
        </TermsText>
      </Form>
    </CustomFlyoutWrapper>
  )
}

type OwnProps = { handleBack: () => void }
export type Props = _P & SuccessStateType & OwnProps
export type ErrorType = SBAddCardErrorType

export default reduxForm<{}, Props, ErrorType>({
  form: 'linkBankForm',
  destroyOnUnmount: false
})(Success)
