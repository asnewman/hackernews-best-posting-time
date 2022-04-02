const axios = require('axios')

const YEAR_SECONDS = 31557600
const MONTH_SECONDS = 2629800
const WEEK_SECONDS = 604800

axios.get("https://hacker-news.firebaseio.com/v0/topstories.json")
  .then(res => {
    const mostRecentItem = res.data[0]
    const dataDateMap = {
      Sunday: { posts: 0, points: 0},
      Monday: { posts: 0, points: 0},
      Tuesday: { posts: 0, points: 0},
      Wednesday: { posts: 0, points: 0},
      Thursday: { posts: 0, points: 0},
      Friday: { posts: 0, points: 0},
      Saturday: { posts: 0, points: 0},
    }
    const promises = []
    const itemRange = [...Array(mostRecentItem + 1).keys()].reverse()
    itemRange.every(item => {
      let quit = false

      promises.push(axios.get(` https://hacker-news.firebaseio.com/v0/item/${item}.json`).then(itemRes => {
        if (!itemRes.data || itemRes.data.type !== "story") return;

        const itemDate = new Date(itemRes.data.time * 1000)

        if (itemRes.data.time <= new Date().getTime() / 1000 - WEEK_SECONDS) {
          console.log(itemRes.data)
          console.log('over a year ago')
          quit = true
        }

        if (itemRes.data.by !== 'whoishiring') {
          dataDateMap[itemDate.toLocaleString(
            'default', {weekday: 'long'}
          )].posts++
          dataDateMap[itemDate.toLocaleString(
            'default', {weekday: 'long'}
          )].points += itemRes.data.score || 0;
        }
      }).catch(err => console.log(err)))
      if (quit) return false
      return true
    });

    Promise.all(promises)
      .then(() => console.log(dataDateMap))
  })