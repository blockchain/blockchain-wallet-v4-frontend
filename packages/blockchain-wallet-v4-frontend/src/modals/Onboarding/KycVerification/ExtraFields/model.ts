import { NodeType } from '@core/types'

export const getNodeQuestionElements = (node: NodeType) => {
  const questionItems = node.children
    ? node.children.map((child) => ({
        text: child.text,
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
