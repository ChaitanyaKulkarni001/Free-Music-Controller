import { configureStore } from '@reduxjs/toolkit'
import roomCodeReducer from './codeRoom/roomCode'
export const store = configureStore({
  reducer: {
    roomCode : roomCodeReducer
  },
})