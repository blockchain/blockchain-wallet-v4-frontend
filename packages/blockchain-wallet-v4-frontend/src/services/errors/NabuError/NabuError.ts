<<<<<<< Updated upstream
import { NabuErrorProps } from './NabuError.types'
=======
import { NabuErrorAction, NabuErrorIconProps, NabuErrorProps } from './NabuError.types'
>>>>>>> Stashed changes

class NabuError extends Error {
  title: string

  icon?: string

  message: string

  actions?: NabuErrorAction[]

  constructor({ actions, icon, message, title }: NabuErrorProps) {
    super(title)

    this.title = title
    this.message = message
    this.icon = icon
    this.actions = actions?.filter((action) => !!action.title)
  }
}

export default NabuError
