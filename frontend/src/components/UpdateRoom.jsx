import React from 'react'
import CreateRoomPage from './CreateRoomPage'
const UpdateRoom = () => {
  return (
    <div>
      <CreateRoomPage />
      <button className='bg-red-900  ' onClick={()=>{setsetting(false)}}>Back to Room</button>

    </div>
  )
}

export default UpdateRoom
