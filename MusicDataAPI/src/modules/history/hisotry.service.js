
// player - play duration - { songmib , precent, when }
// player - like - { yes, no }
const HistoryModel = require('./history.model')
const HistoryEvent = HistoryModel.HistoryEvent
const HistoryEvents = HistoryModel.HistoryEvents


function saveEvent(payload){
    const { category, event, ...metadata } = payload;

    const eventObj = new HistoryEvent(category, event, metadata);
    (new HistoryEvents(eventObj)).save().then((res) => {
        console.log("saved?")
        console.log(res)
    })
}

module.exports = {
    saveEvent
}