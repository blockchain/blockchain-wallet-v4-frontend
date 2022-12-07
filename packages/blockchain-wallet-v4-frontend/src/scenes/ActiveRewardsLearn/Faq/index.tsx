import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Flex, Padding, SemanticColors, Text } from '@blockchain-com/constellation'

import { faqs } from './Faq.model'
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
    </Flex>
  </Padding>
)

export default Faq
