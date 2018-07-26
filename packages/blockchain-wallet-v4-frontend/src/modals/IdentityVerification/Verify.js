import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Button, HeartbeatLoader, Image } from 'blockchain-info-components'
import media from 'services/ResponsiveService'
import {
  ColLeft,
  ColRight,
  InputWrapper,
  PartnerHeader,
  PartnerSubHeader,
  ColRightInner
} from 'components/IdentityVerification'
import renderFaq from 'components/FaqDropdown'

const VerifyWrapper = styled.div`
  display: flex;
  flex-direction: row;
  ${media.mobile`
    flex-direction: column;
  `};
`

const faqQuestions = [
  {
    question: (
      <FormattedMessage
        id='identityverification.verify.faq.whycollect.question'
        defaultMessage='Why do you need this information?'
      />
    ),
    answer: (
      <FormattedMessage
        id='identityverification.verify.faq.whycollect.answer'
        defaultMessage='To comply with government regulated anti-money laundering legislation, we need to obtain additional information in order to verify your identity.'
      />
    )
  }
]

const Verify = ({ formBusy, handleSubmit }) => (
  <VerifyWrapper>
    <ColLeft>
      <InputWrapper>
        <PartnerHeader>
          <FormattedMessage
            id='identityverification.verify.header'
            defaultMessage='Verify Your Identity'
          />
        </PartnerHeader>
        <Image name='verify-identity' width='100%' />
        <PartnerSubHeader>
          <FormattedMessage
            id='identityverification.verify.subheader'
            defaultMessage='Good news – you’re almost done! Just grab your photo ID and mobile phone to complete your verification. This will only take a few minutes.'
          />
        </PartnerSubHeader>
      </InputWrapper>
    </ColLeft>
    <ColRight>
      <ColRightInner>
        <Button uppercase nature='primary' onClick={handleSubmit} fullwidth>
          {!formBusy ? (
            <FormattedMessage
              id='identityverification.verify.verify'
              defaultMessage='Verify My Identity'
            />
          ) : (
            <HeartbeatLoader height='20px' width='20px' color='white' />
          )}
        </Button>
        {renderFaq(faqQuestions)}
      </ColRightInner>
    </ColRight>
  </VerifyWrapper>
)

Verify.propTypes = {}

Verify.defaultProps = {}

export default Verify
