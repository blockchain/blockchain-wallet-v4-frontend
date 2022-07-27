import { NabuErrorAction, NabuErrorIconProps, NabuErrorProps } from './NabuError.types'

class NabuError extends Error {
  id?: string

  title: string

  icon?: NabuErrorIconProps

  message: string

  categories?: string[]

  actions?: NabuErrorAction[]

  constructor({ actions, categories, icon, id, message, title }: NabuErrorProps) {
    super(title)

    this.id = id
    this.title = title
    this.message = message
    this.categories = categories
    this.icon = icon
    this.actions = actions
  }
}

export default NabuError
