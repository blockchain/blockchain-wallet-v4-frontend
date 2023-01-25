import { useIntl } from 'react-intl'

import { NodeItem } from '@core/types'

export const GetNodeQuestionElements = (node: NodeItem) => {
  const intl = useIntl()
  const questionItems = node.children
    ? node.children.map((child) => ({
        text: intl.formatMessage({
          defaultMessage: child.text,
          id: `modals.onboarding.kyc_verification.extra_fields.${child.id}`
        }),
        value: child.id
      }))
    : []

  return [
    {
      group: '',
      items: questionItems
    }
  ]
}

export const GetInputPlaceholder = (child: NodeItem) => {
  const intl = useIntl()
  return intl.formatMessage({
    defaultMessage: child.text,
    id: `modals.onboarding.kyc_verification.extra_fields.${child.id}_hint`
  })
}
