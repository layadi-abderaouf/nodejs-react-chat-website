import React, { useState,useContext } from 'react'
import {useNavigate} from 'react-router-dom'
import {useDisclosure} from '@chakra-ui/hooks'
import ChatContext from '../context/chatProider'
import { Box,
 useToast,
  Button,
  Text,Input,
  Menu, MenuButton,MenuItem, MenuList,MenuDivider,
  Avatar,
  Drawer,DrawerBody,DrawerHeader,
  DrawerOverlay,DrawerContent,DrawerCloseButton,
 } from '@chakra-ui/react'
import { BellIcon,ChevronDownIcon} from '@chakra-ui/icons'
import { Spinner} from '@chakra-ui/spinner'
import NotificationBadge,{Effect} from 'react-notification-badge'

//componenets
import Profile from './Profile'
import axios from 'axios'
import ChatLoading from './ChatLoading'
import UserListItem from './users/UserListItem'


function SideDrawer() {
  //api url
  const api_url ="http://192.168.1.12:5000"

  //state
  const [search, setsearch] = useState("")
  const [searchResault, setsearchResault] = useState([])
  const [loading, setloading] = useState(false)
  const [loadingChat, setloadingChat] = useState()

  //user data
  const {user,setselectedChat,chats,setchats,notification,setnotification} = useContext(ChatContext)
  const navigate = useNavigate()

  const toast = useToast();
  //for drawer
  const { isOpen, onOpen, onClose } = useDisclosure()

  
  
  //functions
  const logOut = ()=>{
    localStorage.removeItem("user_info")
    navigate("/login")

  }

  const searchHendler = async (search)=>{
    setsearch(search)
    if(!search){
      /*toast({
        title: 'Please enter something in search !',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position:'top-left'
      })*/
      return;
    }
    try {
      setloading(true)
      const config = {
        headers : {
          "Authorization":"Bearer "+user.token, 
        }
      };
      const {data} = await axios.get(api_url+"/api/user?search="+search,config)
      setloading(false)
     
      setsearchResault(data)
    } catch (error) {
      toast({
        title: 'Error Occured !!',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position:'bottom-left'
      })
      return;
    }
  }

  const accessChat = async (userId)=>{
    try {
      setloadingChat(true)
      const config = {
        headers : {
          "content-type":"application/json",
          "Authorization":"Bearer "+user.token, 
        }
      };
      const {data} = await axios.post(api_url+"/api/chat",{userId},config)
      if (!chats.find((c) => c._id === data._id)) setchats([data, ...chats]);
      setselectedChat(data)
      setloadingChat(false)
      onClose()
    } catch (error) {
      toast({
        title: 'Error Occured !!',
        description:error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position:'bottom-left'
      })
      return;
    }
  }



  //body
  return (
  <>
    <Box display="flex" justifyContent="space-between" alignItems="center"
        bg="white" w="100%" borderWidth="2px" p="5px 10px 5px 10px">
      
      <Button onClick={onOpen} variant="ghost">
        <i className="fa-sharp fa-solid fa-magnifying-glass"></i>
        <Text px="4" display={{base:"none",md:"flex"}} 
        >Search User</Text>
      </Button>
      <Text fontSize="2xl" fontFamily="work sans">
        R-Chat  
      </Text>

      <div>
        <Menu>
          <MenuButton p={1}>
            <NotificationBadge
              count={notification.length}
              effect={Effect.SCALE}
            />
            <BellIcon fontSize="2xl" m={1} />
          </MenuButton>
          <MenuList pl={2}>
            
            {!notification.length && "No New Messages"}
            {
              notification.map((notify)=>(
                <MenuItem key={notify._id} onClick={() => {
                  setselectedChat(notify.chat);
                  setnotification(notification.filter((n) => n !== notify));
                }}>
                  
                       
                    {notify.chat.isGroup ? notify.chat.chatName + " : " + notify.content :
                     ( <>
                       <Avatar src={
                         notify.chat.users[1] === user ? notify.chat.users[0].image  :
                         notify.chat.users[1].image
                       } size="sm" marginRight={2} name="rr" />
                       { notify.chat.users[0].name === user.name ? notify.chat.users[1].name + " : " + notify.content :
                       notify.chat.users[0].name + " : " + notify.content}
                       
                       </>
                      )
                    }
                </MenuItem>
              )
            )}
          </MenuList>

          
        </Menu>
        <Menu>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon/>} >
             <Avatar size="sm" cursor="pointer" bg="green.500"  name={user.name} 
             src={user.image === "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg" ? "default" : user.image } />  
          </MenuButton>
          <MenuList>
             <Profile user={user}>
                <MenuItem>My Profile</MenuItem>
             </Profile>
            
            
             <MenuDivider/>
             <MenuItem onClick={logOut}>Log Out</MenuItem>
          </MenuList>
           
        </Menu>
      </div>
     

    </Box>
    <Drawer isOpen={isOpen}
        placement='left'
        onClose={onClose}
        >
       <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Search Users</DrawerHeader>

          <DrawerBody>
            <Box display="flex" pb={2}>
               <Input focusBorderColor='green.500' placeholder='Search by name or email' mr={2}
               value={search} onChange={(e)=>searchHendler(e.target.value)} />
                
            </Box>
              
            {loading ? (<ChatLoading/>)
            :(
              searchResault?.map(user=>(
                <UserListItem
                 key={user._id}
                 user={user}
                 handler={()=>accessChat(user._id)}
                />
              ))
            )
            }
            {loadingChat && <Spinner ml="auto" display="flex" />}

          </DrawerBody>

         
        </DrawerContent>
    </Drawer>
  </>
  )
}

export default SideDrawer