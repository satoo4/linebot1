const express = require('express')
const line = require('@line/bot-sdk')
const db = require('./firebase')

const config = {
  channelAccessToken: 'YOUR_ACCESS_TOKEN',
  channelSecret: 'YOUR_SECRET'
}

const app = express()
const client = new line.Client(config)

app.post('/webhook', line.middleware(config), async (req, res) => {
  Promise.all(req.body.events.map(handleEvent)).then(result => res.json(result))
})

async function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null)
  }

  const team = event.message.text

  try {
    const snapshot = await db.collection('teams').doc(team).get()
    if (!snapshot.exists) {
      return client.replyMessage(event.replyToken, {
        type: 'text',
        text: 'そのチームは見つかりませんでした。'
      })
    }

    const data = snapshot.data()
    const players = data.players.join('\n')

    return client.replyMessage(event.replyToken, {
      type: 'text',
      text: `${team}の選手は：\n${players}`
    })

  } catch (err) {
    console.error(err)
    return client.replyMessage(event.replyToken, {
      type: 'text',
      text: 'エラーが発生しました。'
    })
  }
}

app.listen(3000, () => console.log('LINE Bot is running on port 3000'))
