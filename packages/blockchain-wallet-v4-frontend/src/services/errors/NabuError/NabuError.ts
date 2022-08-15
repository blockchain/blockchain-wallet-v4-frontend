import { NabuErrorAction, NabuErrorIconProps, NabuErrorProps } from './NabuError.types'

class NabuError extends Error {
  id?: string

  title: string

  icon?: NabuErrorIconProps

  message: string

  categories?: string[]

  actions?: NabuErrorAction[]

  dataFields?: { [key: string]: unknown }

  constructor({ actions, categories, dataFields, icon, id, message, title }: NabuErrorProps) {
    super(title)

    this.id = id
    this.title = title
    this.message = message
    this.categories = categories
    this.icon = icon
    this.actions = actions
    this.dataFields = dataFields
  }
}

export default NabuError
