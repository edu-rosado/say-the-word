import io from 'socket.io-client'

export const getTokenPayload = token => {
    if (token) {
      try {
        return JSON.parse(atob(token.split('.')[1]));
      } catch (error) {
        // ignore
      }
    }
  
    return null;
};

export const getTokenConfig = (token) => {
  return { headers: {"Authorization": `Bearer ${token}`}}
}

export const connectToSocket = (port, username, isGuest) =>{
  const socket = io(`http://localhost:${port}`,{query: {username,isGuest,},}) 
  if (socket.connected){
    return socket
  } else{
    console.log("did not connect (client)")
    return null
  }
}
  