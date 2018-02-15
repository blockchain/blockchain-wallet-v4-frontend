import { isNil, prop } from 'ramda'

export const initializeForm = (prevProps, nextProps) => {
  const prevData = prevProps.data.getOrElse({})
  const prevInitialValues = prop('initialValues', prevData)
  const prevSource = prop('source', prevData)
  if (!isNil(prevInitialValues) && isNil(prevSource)) {
    nextProps.formActions.initialize('exchange', prevInitialValues)
  }
}
