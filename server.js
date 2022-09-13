const express = require('express')
const { FieldValue } = require('firebase-admin/firestore')
const app = express()
const port = 8383
const { db } = require('./firebase.js')

app.use(express.json())

const fruit = {
    'apple': 'red',
    'mango': 'yellow',
    'grapes': 'green',
    'watermelon': 'yellow',
    'banana':'yellow',
}

app.get('/fruit', async (req, res) => {
    const fruitRef = db.collection('fruits').doc('classify')
    const doc = await fruitRef.get()
    if (!doc.exists) {
        return res.sendStatus(400)
    }

    res.status(200).send(doc.data())
})

app.get('/fruit/:name', (req, res) => {
    const { name } = req.params
    if (!name || !(name in fruit)) {
        return res.sendStatus(404)
    }
    res.status(200).send({ [name]: fruit[name] })
})

app.post('/addfruit', async (req, res) => {
    const { name, status } = req.body
    const fruitRef = db.collection('fruits').doc('classify')
    const res2 = await fruitRef.set({
        [name]: status
    }, { merge: true })
    // fruit[name] = status
    res.status(200).send(fruit)
})

app.patch('/changestatus', async (req, res) => {
    const { name, newStatus } = req.body
    const fruitRef = db.collection('fruits').doc('classify')
    const res2 = await fruitRef.set({
        [name]: newStatus
    }, { merge: true })
    // fruit[name] = newStatus
    res.status(200).send(fruit)
})

app.delete('/fruit', async (req, res) => {
    const { name } = req.body
    const fruitRef = db.collection('fruits').doc('classify')
    const res2 = await fruitRef.update({
        [name]: FieldValue.delete()
    })
    res.status(200).send(fruit)
})

app.listen(port, () => console.log(`Server has started on port: ${port}`))