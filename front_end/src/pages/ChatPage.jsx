import React ,{useContext, useEffect,useState} from 'react'
import axios from 'axios'
import { Box } from '@chakra-ui/react'
import ChatContext from '../context/chatProider'

//COMPONENTS 
import SideDrawer from '../components/SideDrawer'
import MyChats from '../components/MyChats'
import ChatBox from '../components/ChatBox'

function ChatPage() {
  const {user} = useContext(ChatContext)
  const [fetchAgain, setfetchAgain] = useState(false)

  return (
    <div style={{width:"100%"}}>
        
      
      
      {user && <SideDrawer/>}
      <Box display="flex"
           justifyContent="space-between"
           w="100%"
           p="10px"
           h={{base:"92%",md:"91.5vh"}}
      >
        {user && <MyChats fetchAgain={fetchAgain}  />}
        {user && <ChatBox fetchAgain={fetchAgain} setfetchAgain={setfetchAgain} />}
      </Box>
      
    </div>
  )
}

export default ChatPage