/**
 * Caching Middleware
 *
 * This function is used to provide caching for API routes, and is typically
 * used in the route-controller setup code.
 *
 * @param {Number} ttl Expiration time (time-to-live) in minutes
 */
module.exports = (ttl) => {
  return (req, res, next) => {
    const client = req.app.get('cache')

    const key = {
      segment: 'avku',
      id: req.url
    }

    client.get(key, (err, cached) => {
      if (err) {
        return next(err)
      } else if (cached) {
        res.set('X-API-Cache', 'HIT')
        return res.json(cached.item)
      }

      res.set('X-API-Cache', 'MISS')
      const send = res.send.bind(res)
      res.send = (body) => {
        send(body)

        const parsedBody = JSON.parse(body)
        client.set(key, parsedBody, ttl * 1000 * 60, (err) => {
          if (err) {
            req.log.error(err)
          }
        })
      }
      return next()
    })
  }
}
