import React,{useContext,useEffect,useState} from 'react'
import ChatContext from '../context/chatProider'
import {
  Box,Text,Button,useToast,
  Spinner,FormControl,Input,InputGroup,InputRightElement
} from '@chakra-ui/react'
import {IconButton} from '@chakra-ui/react'
import { ArrowBackIcon } from '@chakra-ui/icons'
import { BeatLoader } from "react-spinners"

import axios from 'axios'
import io from 'socket.io-client'
//css
import './style.css'
//components
import Profile from './Profile'
import UpdateGroupModal from './UpdateGroupModal'
import MessagesList from './MessagesList'


var socket,selectedChatCompare;

function SingleChat({fetchAgain,setfetchAgain}) {
//api url
const api_url ="http://192.168.1.12:5000"

  //state
  const [messages, setmessages] = useState([])
  const [loading, setloading] = useState(false)
  const [newMessage, setnewMessage] = useState()
  const [SocketConnected, setSocketConnected] = useState(false)
  const [typing, settyping] = useState(false)
  const [istyping, setistyping] = useState(false)
  const [vu, setvu] = useState(false)
  

  const {user,selectedChat,setselectedChat,notification,setnotification} = useContext(ChatContext)
  const toast = useToast();
  //functions
  const sendMessage= async()=>{
     if(newMessage){
       socket.emit("stop typing",selectedChat._id)
        try {
          setloading(true)
          const config = {
            headers : {
              "Content-Type":"application/json",
              "Authorization":"Bearer "+user.token, 
            }
          };
          const {data} = await axios.post(api_url+"/api/message",{
            content:newMessage,
            chatId:selectedChat._id
          },config)
          
          setnewMessage("")
          socket.emit("new message",data)
          setmessages([...messages,data])
          setloading(false)
        } catch (error) {
          toast({
            title: 'Error Occured !!',
            description:"faild to send the message",
            status: 'error',
            duration: 5000,
            isClosable: true,
            position:'bottom'
          })
          return;
        }
     }
  }
  const getMessages = async()=>{
    if(!selectedChat)return;

    try {
      const config = {
        headers : {
          "Authorization":"Bearer "+user.token, 
        }
      };
      setloading(true)
      const {data} = await axios.get(api_url+"/api/message/"+selectedChat._id,config)
      setmessages(data)
      setloading(false)
      socket.emit("join chat",selectedChat._id)
    } catch (error) {
      toast({
        title: 'Error Occured !!',
        description:"faild to load the messages",
        status: 'error',
        duration: 5000,
        isClosable: true,
        position:'bottom'
      })
      return;
    }

  }
 

  //Effect
  useEffect(() => {
    socket = io(api_url) 
    socket.emit("setup",user)
    socket.on('connected',()=>setSocketConnected(true))
    socket.on("typing",(user1)=>{
      if(user._id === user1)return;
      setistyping(true)
    })
    socket.on("stop typing",()=>setistyping(false))
  }, [])

  useEffect(() => {
    getMessages()
    selectedChatCompare = selectedChat;
    setvu(false)
    if(selectedChat){
      socket.emit("vu",[selectedChat._id,user._id])
    }
    
    
    
  }, [selectedChat])


  useEffect(() => {
    socket.on("message recived",(newMessage)=>{
       if(!selectedChatCompare || selectedChatCompare._id !== newMessage.chat._id){
         //notifications
         if(!notification.includes(newMessage)){
           setnotification([newMessage,...notification])
           setfetchAgain(!fetchAgain)
         }
       }else{
        setmessages([...messages, newMessage]);
        
       }
    })
    socket.on("vu-client",(data)=>{
      
      
        setvu(true)
      
        
      
    })
    
  })

  //other functions
  const typingHandler = (e)=>{
    setnewMessage(e.target.value)
    
    if(!SocketConnected)return;
    if(!typing){
      settyping(true)
      socket.emit("typing",selectedChat._id,user._id)
    }
    let lastTypingTime = new Date().getTime()
    var timer = 3000;
    setTimeout(() => {
      var now = new Date().getTime()
      var dif = now - lastTypingTime;
      if(dif >= timer && typing){
        socket.emit("stop typing",selectedChat._id)
        settyping(false)
      }
    }, timer);
  }
  
  

  return (
    <>
      {selectedChat ? 
      (
          <>
            <Text
               fontSize={{ base: "28px", md: "30px" }}
               pb={3}
               px={2}
               w="100%"
               fontFamily= "Work sans"
               display="flex"
               justifyContent={{ base: "space-between" }}
               alignItems="center"
            >
                <IconButton 
                   display={{base:"flex",md:"none"}}
                   icon={<ArrowBackIcon/>}
                   onClick={()=>setselectedChat("")}
                />
                {selectedChat.isGroup ?(
                  <>
                     {selectedChat.chatName}
                     <UpdateGroupModal fetchAgain={fetchAgain} setfetchAgain={setfetchAgain} />
                  </>
                  ):(
                   <>
                      {selectedChat.users[0].name===user.name
                      ?selectedChat.users[1].name
                      :selectedChat.users[0].name}
                      <Profile user={selectedChat.users[0].name===user.name
                                    ?selectedChat.users[1]
                                    :selectedChat.users[0]} 
                      />
                   </> )} 
                     
            </Text>
            <Box
              display="flex"
              flexDir="column"
              maxHeight={{base:600,md:"100%"}}
              style={{"justifyContent": "flex-end"}}
              p={3}
              bg= "#E8E8E8"
              w="100%"
              h="100%"
              borderRadius="lg"
              overflowY="hidden"
              
            >
                
                {loading?(
                  <Spinner  
                    size="xl"
                    w={20}
                    h={20}
                    alignSelf="center"
                    margin="auto"/>
                ):(
                  <div className="messages">
                    <MessagesList  messages={messages} />
                    {!selectedChat.isGroup && (  vu && "vu")}
                  </div>
                )}

                
                
                {istyping ? 
                  <span style={{background : "#BEE3F8",
                   "borderRadius" : "20px","width":"90px","padding":"5px 15px", "marginTop":"4px",
                    }}>
                     <BeatLoader style={{marginLeft : 10}} size={8}  />
                  </span>
                
                : ""}
                <FormControl  isRequired mt={3}>
                  <InputGroup>
                    
                    <Input variant="filled" placeholder="Enter a message" 
                    bg="white" onChange={typingHandler} value={newMessage} />
                    <InputRightElement width='4.5rem'>
                      <Button colorScheme="green" p={4} h='1.75rem' size='sm' onClick={sendMessage}>
                        <i className="fa-sharp fa-solid fa-paper-plane"></i>
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                  
                  
                </FormControl>
            </Box>
          </>
      )
      :(
        <Box
        display="flex" alignItems="center" justifyContent="center" h="100%"
      >
        <Text fontSize="3xl" pb={3} fontFamily="work sans">
            Click On a user to start chatting
        </Text>
      </Box>
      )}
    </>
  )
}

export default SingleChat