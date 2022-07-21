import { NabuErrorAction, NabuErrorIconProps, NabuErrorProps } from './NabuError.types'

class NabuError extends Error {
  title: string

  icon?: NabuErrorIconProps

  message: string

  categories?: string[]

  actions?: NabuErrorAction[]

  constructor({ actions, categories, icon, message, title }: NabuErrorProps) {
    super(title)

    this.title = title
    this.message = message
    this.categories = categories
    this.icon = icon
    this.actions = actions
  }
}

export default NabuError
