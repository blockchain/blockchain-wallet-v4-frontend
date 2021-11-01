const getTracking = ({ url }: { url: string }) =>
  fetch(`${url}/events/tracking`, {
    credentials: 'include'
  })

export { getTracking }
