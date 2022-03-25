import { NodeType } from '@core/types'

export const getQuestionElements = (nodes: Array<NodeType>, questionId: string) => {
  const question = nodes.find((node) => node.id === questionId)

  const questionItems =
    question && question.children
      ? question.children.map((child) => ({
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
