import React,{useContext} from 'react'
import ChatContext from '../context/chatProider'
import {Box} from '@chakra-ui/react'

//components
import SingleChat from './SingleChat'

function ChatBox({fetchAgain,setfetchAgain}) {
  const {user,selectedChat} = useContext(ChatContext)

  return (
    <Box 
      display={{base:selectedChat?"flex":"none",md:"flex"}}
      alignItems="center" flexDir="column" p={3} bg="white"
      w={{base:"100%",md:"68%"}}
      borderRadius="lg" borderWidth="1px"
    >
      <SingleChat fetchAgain={fetchAgain} setfetchAgain={setfetchAgain}/>
    </Box>
  )
}

export default ChatBox