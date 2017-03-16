Nomad = require('nomad-stream')
axios = require('axios')
moment = require('moment')

const nomad = new Nomad()

const QUAKE_DATA_URL = 'http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson'

const POLL_INTERVAL_SECONDS = 60

let instance = null

nomad.prepareToPublish()
  .then((node) => {
    instance = node

    return axios.get(QUAKE_DATA_URL)
      .then(({ data }) => {
        const message = JSON.stringify(data)
        console.log('Root publish:', message)
        return instance.publishRoot(message)
      })
      .catch((error) => {
        console.log(error)
      })
  })
  .then(() => {
    setInterval(() => {
      axios.get(QUAKE_DATA_URL)
        .then(({ data }) => {
          const message = JSON.stringify(data)
          console.log('Regular publish:', message)
          instance.publish(message)
        })
        .catch((error) => {
          console.log(error)
        })
    }, POLL_INTERVAL_SECONDS * 1000)
  })
