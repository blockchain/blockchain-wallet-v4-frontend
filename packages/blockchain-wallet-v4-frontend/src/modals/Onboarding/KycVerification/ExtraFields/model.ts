import { useIntl } from 'react-intl'

import { NodeType } from '@core/types'

export const GetNodeQuestionElements = (node: NodeType) => {
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
