import { 
  Box,Button,Stack,Text,
  Avatar, AvatarBadge, AvatarGroup } from '@chakra-ui/react'
import {AddIcon} from '@chakra-ui/icons'
import { useToast } from '@chakra-ui/toast'
import axios from 'axios'
import React,{useContext,useState,useEffect} from 'react'
import randomColor from "randomcolor";
import ChatContext from '../context/chatProider'
//components
import ChatLoading from './ChatLoading'
import GroupModal from './GroupModal'


function MyChats({fetchAgain}) {
  //api url
  const api_url ="http://192.168.1.12:5000"

  //state
  const [loggedUser, setloggedUser] = useState()

  //context
  const {
    user,
    selectedChat,setselectedChat,
    chats,setchats} = useContext(ChatContext)

  const toast = useToast();

  //functions
  

  const getChats = async ()=>{
    try {
      const config = {
        headers : {
          "content-type":"application/json",
          "Authorization":"Bearer "+user.token, 
        }
      };
      const {data} = await axios.get(api_url+"/api/chat",config)
      setchats(data)
    } catch (error) {
      toast({
        title: 'Error Occured !!',
        description:"faild to load the chats",
        status: 'error',
        duration: 5000,
        isClosable: true,
        position:'bottom-left'
      })
    }
  }

  //effects
  useEffect(() => {
    setloggedUser(user)
    getChats()
  }, [fetchAgain])
  


  return (
    
    <Box 
      display={{base:selectedChat?"none":"flex",md:"flex"}}
      flexDir="column" alignItems="center"
      p={3} bg="white" w={{base:"100%",md:"31%"}}
      borderRadius="lg" borderWidth="1px"
    >
      <Box 
        pb={3} px={3} fontSize={{base:"28px",md:"30px"}} 
        fontFamily="work sans" display="flex" w="100%"
        justifyContent="space-between" alignItems="center"
      >
        My Chats
        <GroupModal>
           <Button 
             display="flex" colorScheme="green" fontSize={{base:"17px",md:"10px",lg:"17px" }}
             rightIcon={<AddIcon/>}
           >New Group</Button>
        </GroupModal>
      </Box>

      <Box
        display="flex" flexDir="column" p={3} bg="#F8F8F8"
        w="100%" h="100%" borderRadius="lg" overflow="hidden"
      >
        {chats ? (
          <Stack overflow="scroll">
            {chats.map((chat)=>(
              <Box
                onClick={()=>setselectedChat(chat)}
                bg={selectedChat === chat ?"#339933":"#E8E8E8"}
                color={selectedChat === chat ?"white":"black"}
                cursor="pointer" px={3} py={2} borderRadius="lg" key={chat._id}
              >
                <Avatar bg={selectedChat === chat ?"white":randomColor()} 
                        color={selectedChat === chat ?"green.500":"white"}
                        name={chat.users[0].name===user.name
                          ?chat.users[1].name
                          :chat.users[0].name}
                        src={chat.users[0].name===user.name?
                          (chat.users[1].image === "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg" ? 
                            "default" : chat.users[1].image):
                          (chat.users[0].image === "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg" ?
                             "default" : chat.users[0].image)} 
                        />
                <Text  p={2.5} display="inline-grid">
                  {chat.isGroup ? chat.chatName:
                    (chat.users[0].name===user.name
                      ?chat.users[1].name
                      :chat.users[0].name)}
                  
                
                </Text>
                
                

              </Box>
            ))}
          </Stack>
        ):(
          <ChatLoading/>
        )}
      </Box>
    </Box>
    
  )
}

export default MyChats