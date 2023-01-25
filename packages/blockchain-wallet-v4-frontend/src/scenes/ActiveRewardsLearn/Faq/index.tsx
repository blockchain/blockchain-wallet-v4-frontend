import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Flex, Link, Padding, SemanticColors, Text } from '@blockchain-com/constellation'

import { faqs, LinkContainer } from './Faq.model'
import FaqItem from './FaqItem'

const Faq = () => (
  <Padding top={2} bottom={2.25}>
    <Flex flexDirection='column' gap={16}>
      <Text color={SemanticColors.title} variant='title3'>
        <FormattedMessage
          defaultMessage='Frequently asked questions'
          id='scenes.earn.active-rewards-learn.faq.title'
        />
      </Text>
      {faqs.map(({ answer, id, question }) => (
        <FaqItem answer={answer} key={id} question={question} />
      ))}
      <LinkContainer>
        <Link
          href='https://support.blockchain.com/hc/en-us/sections/6868455075996-Active-Rewards'
          size='default'
          target='_blank'
          text={
            <FormattedMessage
              defaultMessage='Go to Support Center'
              id='scenes.earn.active-rewards-learn.faq.gotosupport'
            />
          }
        />
      </LinkContainer>
    </Flex>
  </Padding>
)

export default Faq
