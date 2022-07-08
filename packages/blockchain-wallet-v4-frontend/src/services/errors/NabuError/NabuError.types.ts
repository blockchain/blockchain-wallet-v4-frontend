<<<<<<< Updated upstream
type NabuErrorProps = {
  icon?: string
=======
type NabuErrorCloseAction = {
  title: string
  type: 'CLOSE'
}

type NabuErrorLaunchAction = {
  title: string
  type: 'LAUNCH'
  url: string
}

type NabuErrorAction = NabuErrorCloseAction | NabuErrorLaunchAction

type NabuErrorIconProps = {
  accessibility: {
    description: string
  }
  status: {
    url: string
  }
  url: string
}

type NabuErrorProps = {
  actions?: NabuErrorAction[]
  icon?: NabuErrorIconProps
>>>>>>> Stashed changes
  message: string
  title: string
}

<<<<<<< Updated upstream
export type { NabuErrorProps }
=======
export type {
  NabuErrorAction,
  NabuErrorCloseAction,
  NabuErrorIconProps,
  NabuErrorLaunchAction,
  NabuErrorProps
}
>>>>>>> Stashed changes
