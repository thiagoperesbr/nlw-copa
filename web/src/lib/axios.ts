import axios from 'axios'

export const api = axios.create({
  //baseURL: 'http://192.168.0.231:3333/'
  baseURL: 'https://nlw-copa-6d80.onrender.com'
})