import API from './api'
import Registration from './registration'
import Chat from './chat'

const ws = new WebSocket('ws://localhost:80/ws');
ws.binaryType = 'blob'; // arraybuffer

const modal = document.getElementsByClassName('registration')[0]
const chatForm = document.getElementsByClassName('app')[0]

const api = new API(ws)
const chat = new Chat(api, chatForm)
const registration = new Registration(api, modal, chat.registrationSuccess.bind(chat))
