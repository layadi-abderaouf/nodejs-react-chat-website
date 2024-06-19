import { useRadioGroup } from '@chakra-ui/radio'
import {createContext, useContext, useEffect, useState} from 'react'


const ChatContext = createContext()

export function ChatProvider(props){
    
    const [user, setuser] = useState()
    const [selectedChat, setselectedChat] = useState()
    const [chats, setchats] = useState([])
    const [notification, setnotification] = useState([])

    
    

    useEffect(() => {
      const userInfo = JSON.parse(localStorage.getItem('user_info'))
      setuser(userInfo)
     
      if(!userInfo && window.location.pathname !== "/login"){
        window.location.replace('/login');
        
      }
    }, [window.location])
    

   return (
       <ChatContext.Provider
       value={{user,setuser,
               selectedChat, setselectedChat,
               chats, setchats,
               notification,setnotification}}>
           
           {props.children}
       </ChatContext.Provider>
      
   )
}




export default ChatContext