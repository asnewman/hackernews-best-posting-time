const axios = require('axios')

const YEAR_SECONDS = 31557600
const MONTH_SECONDS = 2629800
const WEEK_SECONDS = 604800
const DAY_SECONDS = 86400

async function getData() {
  const dataDateMap = {
    Sunday: { posts: 0, points: 0, comments: 0 },
    Monday: { posts: 0, points: 0, comments: 0 },
    Tuesday: { posts: 0, points: 0, comments: 0 },
    Wednesday: { posts: 0, points: 0, comments: 0 },
    Thursday: { posts: 0, points: 0, comments: 0 },
    Friday: { posts: 0, points: 0, comments: 0 },
    Saturday: { posts: 0, points: 0, comments: 0 },
  }
  const mostRecentItemRes = await axios.get("https://hacker-news.firebaseio.com/v0/maxitem.json");
  const mostRecentItem = mostRecentItemRes.data;

  for (let i = mostRecentItem; i > 0; i--) {
    try {
      const itemRes = await axios.get(` https://hacker-news.firebaseio.com/v0/item/${i}.json`)
      if (!itemRes.data || itemRes.data.type !== "story") continue;

      if (itemRes.data.time <= new Date().getTime() / 1000 - MONTH_SECONDS) {
        console.log("end")
        break;
      }

      if (itemRes.data.by !== 'whoishiring') {
        console.log(`processing ${i}`)
        const itemDate = new Date(itemRes.data.time * 1000)
        dataDateMap[itemDate.toLocaleString(
          'default', {weekday: 'long'}
        )].posts++
        dataDateMap[itemDate.toLocaleString(
          'default', {weekday: 'long'}
        )].points += itemRes.data.score || 0;
        dataDateMap[itemDate.toLocaleString(
          'default', {weekday: 'long'}
        )].comments += itemRes.data.descendants || 0;
        console.log(dataDateMap);
      }
    }
    catch (e) {
      console.error("Failed to grab item " + i, e)
    }
  }

  console.log(dataDateMap)
}

getData();

// axios.get("https://hacker-news.firebaseio.com/v0/maxitem")
//   .then(res => {
//     const mostRecentItem = res.data[0]
//     const dataDateMap = {
//       Sunday: { posts: 0, points: 0},
//       Monday: { posts: 0, points: 0},
//       Tuesday: { posts: 0, points: 0},
//       Wednesday: { posts: 0, points: 0},
//       Thursday: { posts: 0, points: 0},
//       Friday: { posts: 0, points: 0},
//       Saturday: { posts: 0, points: 0},
//     }
//     const promises = []
//     const itemRange = [...Array(mostRecentItem + 1).keys()].reverse()
//     itemRange.slice(0, 10000).every(item => {
//       let quit = false
// 
//       promises.push(axios.get(` https://hacker-news.firebaseio.com/v0/item/${item}.json`).then(itemRes => {
//         if (!itemRes.data || itemRes.data.type !== "story") return;
//         console.log(`Grabbed data for story ${item}`);
// 
//         const itemDate = new Date(itemRes.data.time * 1000)
// 
//         // if (itemRes.data.time <= new Date().getTime() / 1000 - WEEK_SECONDS) {
//         if (itemRes.data.time <= 1648771200) {
//           console.log(itemRes.data)
//           console.log('over a year ago')
//           quit = true
//         }
// 
//         if (itemRes.data.by !== 'whoishiring') {
//           dataDateMap[itemDate.toLocaleString(
//             'default', {weekday: 'long'}
//           )].posts++
//           dataDateMap[itemDate.toLocaleString(
//             'default', {weekday: 'long'}
//           )].points += itemRes.data.score || 0;
//         }
//       }).catch(err => console.log(err)))
//       if (quit) return false
//       return true
//     });
// 
//     Promise.all(promises)
//       .then(() => console.log(dataDateMap))
//   })
