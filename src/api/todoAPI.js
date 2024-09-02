import axios from 'axios';

const todoAPI = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

export { todoAPI };
