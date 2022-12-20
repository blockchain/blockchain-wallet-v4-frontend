import { Experiments } from './types'

export default ({ authorizedGet, nabuUrl }) => {
  const getExperiments = (): Experiments =>
    authorizedGet({
      endPoint: '/experiments/mercury',
      url: nabuUrl
    })

  return {
    getExperiments
  }
}
