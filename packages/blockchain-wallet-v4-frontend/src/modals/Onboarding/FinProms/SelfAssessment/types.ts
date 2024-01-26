import { ExtraQuestionsType, NodeType } from '@core/types'

export type IntroPageType = {
  footer: Array<{ action?: { type: string; url: string }; text: string; type: string }>
  header: { description: string; imageUrl: string; title: string }
}

export type Page = { nodes: NodeType }

export type SelfAssessmentType = Omit<ExtraQuestionsType, 'nodes' | 'context'> & {
  introPage: IntroPageType
  pages: Array<Page>
}

export type QuizSubmitResult = {
  countdownDate?: string
  status: 'SUCCESS' | 'RETRY' | 'RETRY_LATER' | 'FAILED'
}
