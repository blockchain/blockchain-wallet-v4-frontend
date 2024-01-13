import { ExtraQuestionsType, NodeType } from '@core/types'

export type IntroPageType = {
  footer: { action?: { type: string; url: string }; text: string; type: string }[]
  header: { description: string; imageUrl: string; title: string }
}

export type Page = { nodes: NodeType }

export type SelfAssessmentType = Omit<ExtraQuestionsType, 'nodes' | 'context'> & {
  introPage: IntroPageType
  pages: Page[]
}

export type QuizSubmitResult = {
  nextRetryDate?: string
  status: 'SUCCESS' | 'RETRY' | 'RETRY_LATER' | 'FAILED'
}
