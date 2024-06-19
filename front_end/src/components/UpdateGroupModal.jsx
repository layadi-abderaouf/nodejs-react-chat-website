import React,{useState,useContext} from 'react'
import { IconButton } from '@chakra-ui/button'
import { ViewIcon } from '@chakra-ui/icons'
import {
    Modal,ModalOverlay,ModalContent,Box,
    ModalHeader,ModalFooter,ModalBody,ModalCloseButton,
    Button,useToast,FormControl,Input,Spinner
  } from '@chakra-ui/react'
import {useDisclosure} from '@chakra-ui/hooks'
import ChatContext from '../context/chatProider'
import axios from 'axios'
import UserListItem from './users/UserListItem'
import UserBadgeItem from './users/UserBadgeItem'

function UpdateGroupModal({fetchAgain,setfetchAgain,children}) {

    //api url
    const api_url ="http://192.168.1.12:5000"

    
    const { isOpen, onOpen, onClose } = useDisclosure()
    const toast = useToast();
    //state
    const [groupName, setgroupName] = useState()
    const [selectedUsers, setselectedUsers] = useState([])
    const [search, setsearch] = useState()
    const [searchResault, setsearchResault] = useState([])
    const [loading, setloading] = useState(false)
    const [renameLoading, setrenameLoading] = useState(false)
    //context data
    const {user,selectedChat,setselectedChat} = useContext(ChatContext)
    //functions
    const searchUsersHandler = async (query)=>{
        setsearch(query)
        if(!query){
          return;
        }
        try {
          setloading(true)
          const config = {
            headers : {
              
              "Authorization":"Bearer "+user.token, 
            }
          };
          const {data} = await axios.get(api_url+"/api/user?search="+query,config)
          setloading(false)
       
          setsearchResault(data)
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
   
    const renameGroup = async ()=>{
      if(!groupName) return

      try {
        setrenameLoading(true)
        const config = {
          headers : {
            "Authorization":"Bearer "+user.token, 
          }
        };
        const {data} = await axios.put(api_url+"/api/chat/group/rename",{
          chatId:selectedChat._id,
          name:groupName
        },config)
        setselectedChat(data)
        setfetchAgain(!fetchAgain)
        setrenameLoading(false)
        toast({
          title: 'the group name was updated',
          status: 'success',
          duration: 5000,
          isClosable: true,
          position:'bottom'
        })
      } catch (error) {
        toast({
          title: 'Error Occured !!',
          description:error.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
          position:'bottom-left'
        })
        setrenameLoading(false);
        return;
      }
      
    }
    const addUserHandler = async (user1)=>{
      if(selectedChat.users.find((u)=>u._id === user1._id)){
        toast({
          title: 'user already in group !!',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position:'bottom'
        })
        return;
      }
      if(selectedChat.groupAdmin._id !== user._id){
        toast({
          title: 'Only admin can add someone !!',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position:'bottom'
        })
        return;
      }
      try {
        setloading(true)
        const config = {
          headers : {
            "Authorization":"Bearer "+user.token, 
          }
        };
        const {data}= await axios.put(api_url+"/api/chat/group/add",{
          chatId:selectedChat._id,
          userId:user1._id
        },config)
        setselectedChat(data)
        setfetchAgain(!fetchAgain)
        setloading(false)
        toast({
          title: 'User was Added',
          status: 'success',
          duration: 5000,
          isClosable: true,
          position:'bottom'
        })
      } catch (error) {
        toast({
          title: 'Error Occured !!',
          description:error.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
          position:'bottom-left'
        })
        setloading(false);
        return;
      }
      
    }
    const removeUser = async (user1)=>{
      if(selectedChat.groupAdmin._id !== user._id && user1._id !== user._id){
        toast({
          title: 'Only admin can remove someone !!',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position:'bottom'
        })
        return;
      } 

      try {
        setloading(true)
        const config = {
          headers : {
            "Authorization":"Bearer "+user.token, 
          }
        };
        const {data}= await axios.put(api_url+"/api/chat/group/remove",{
          chatId:selectedChat._id,
          userId:user1._id
        },config)
        user1 === user ? setselectedChat() : setselectedChat(data)
        setfetchAgain(!fetchAgain)
        setloading(false)
        toast({
          title: 'user leave group !!',
          status: 'success',
          duration: 5000,
          isClosable: true,
          position:'bottom'
        })
      } catch (error) {
        toast({
          title: 'Error Occured !!',
          description:error.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
          position:'bottom-left'
        })
        setloading(false);
        return;
      }
    }


  return (
    <>
    
    {children? 
       (<span onClick={onOpen}>{children}</span>):
       (<IconButton d={{base:"flex"}} onClick={onOpen} icon={<ViewIcon/>} />)
    }
    <Modal  isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="35px" fontFamily="work sans" display="flex" justifyContent="center">{selectedChat.chatName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center">
           
           <Box display="flex" w="100%" flexWrap="wrap" pb={3} >
               {selectedChat.users.map((u)=>(
                    <UserBadgeItem user={u} handler={()=>removeUser(u)} />
               ))}
           </Box>
           <FormControl display="flex">
             <Input mb={3}  placeholder="group name" value={groupName}
             onChange={(e)=>setgroupName(e.target.value)} />
             <Button onClick={renameGroup} ml={1} variant="solid" colorScheme="green" isLoading={renameLoading} >update</Button>
             
           </FormControl>
           <FormControl>
             <Input mb={1}  placeholder="Add users"
             onChange={(e)=>searchUsersHandler(e.target.value)}
              />
             
           </FormControl>
           
          
           {loading ? <Spinner size="lg"/>:(
             searchResault?.slice(0,3).map((resault)=>(
               <UserListItem key={resault._id} handler={()=>addUserHandler(resault)} user={resault}  />
             ))
           ) }
          
          </ModalBody>

          <ModalFooter>
            <Button onClick={()=>removeUser(user)} colorScheme='red'  >
              leave group
            </Button>
          
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default UpdateGroupModal