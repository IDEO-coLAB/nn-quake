import Nomad from 'nomad-stream'
import axios from 'axios'
import moment from 'moment'
const nomad = new Nomad()

let instance = null
nomad.prepareToPublish()
  .then((n) => {
    instance = n;
    axios.get('http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson')
      .then(({ data }) => {

        let features = []

        data.features.forEach((feature) => {
          features.push(feature.properties.title + "\n")
        })

        console.log('root connected')

        const message =
        `Earthquakes at ${moment().format('h:mm a')}
        ${features}`

        return instance.publishRoot(message)
      })
      .catch((error) => {
        console.log(error)
      })
  })
  .then(() => {
    setInterval(() => {
      axios.get('http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson')
        .then(({ data }) => {

          console.log('main')

          let features = []

          data.features.forEach((feature) => {
            features.push(feature.properties.title + "\n")
          })

          const message =
          `Earthquakes at ${moment().format('h:mm a')}
          ${features}`

          instance.publish(message)
        })
        .catch((error) => {
          console.log(error)
        })
    }, 60000)
  })
