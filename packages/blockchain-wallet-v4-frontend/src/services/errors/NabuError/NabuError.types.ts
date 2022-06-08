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
  message: string
  title: string
}

export type {
  NabuErrorAction,
  NabuErrorCloseAction,
  NabuErrorIconProps,
  NabuErrorLaunchAction,
  NabuErrorProps
}
