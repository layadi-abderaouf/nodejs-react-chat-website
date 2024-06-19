import React,{useState,useContext} from 'react'
import { IconButton } from '@chakra-ui/button'
import { ViewIcon } from '@chakra-ui/icons'
import {
    Modal,ModalOverlay,ModalContent,Box,
    ModalHeader,ModalFooter,ModalBody,ModalCloseButton,
    Button,useToast,FormControl,Input
  } from '@chakra-ui/react'
import {useDisclosure} from '@chakra-ui/hooks'
import ChatContext from '../context/chatProider'
import axios from 'axios'
import UserListItem from './users/UserListItem'
import UserBadgeItem from './users/UserBadgeItem'

function GroupModal({children}) {
    //api url
    const api_url ="http://192.168.1.12:5000"

    
    const { isOpen, onOpen, onClose } = useDisclosure()
    const toast = useToast();
    //state
    const [groupName, setgroupName] = useState()
    const [selectedUsers, setselectedUsers] = useState([])
    const [search, setsearch] = useState()
    const [searchResault, setsearchResault] = useState([])
    const [loading, setloading] = useState()
    //context data
    const {user,chats,setchats} = useContext(ChatContext)
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
    const groupUsersHandler = (userToAdd)=>{
      if(selectedUsers.includes(userToAdd)){
        toast({
          title: 'User Already Added !!',
          status: 'warning',
          duration: 5000,
          isClosable: true,
          position:'top'
        })
        return;
      }
      
      setselectedUsers(currrent =>[...currrent,userToAdd])

    }
    const deleteUser = (deluser)=>{
       setselectedUsers(selectedUsers.filter((sel)=>sel !== deluser))
    }
    const createGroupHandler = async ()=>{
      if(!groupName || !selectedUsers){
        toast({
          title: 'Please fill all field',
          status: 'warning',
          duration: 5000,
          isClosable: true,
          position:'top'
        })
        return;
      }
      try {
        const config = {
          headers : {
            "Authorization":"Bearer "+user.token, 
          }
        };
        const {data} = await axios.post(api_url+"/api/chat/group",{
          name:groupName,users:JSON.stringify(selectedUsers.map((e)=>e._id))
        },config)
        setchats([data,...chats])
        onClose()
        toast({
          title: 'New Group Created',
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
        return;
      }
    }

  //body
  return (
    <>
    
    {children? 
       (<span onClick={onOpen}>{children}</span>):
       (<IconButton d={{base:"flex"}} onClick={onOpen} icon={<ViewIcon/>} />)
    }
    <Modal  isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="35px" fontFamily="work sans" display="flex" justifyContent="center">Create Group</ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center">
           
           <FormControl>
             <Input mb={3}  placeholder="group name"
             onChange={(e)=>setgroupName(e.target.value)} />
             
           </FormControl>
           <FormControl>
             <Input mb={1}  placeholder="Add users"
             onChange={(e)=>searchUsersHandler(e.target.value)} />
             
           </FormControl>
           <Box w="100%" display="flex" flexWrap="wrap">
              { selectedUsers.map(resault=>(
                 <UserBadgeItem user={resault} handler={()=>deleteUser(resault)} />
              ))}
           </Box>
          
           {loading ? <div>loading</div>:(
             searchResault?.slice(0,4).map((resault)=>(
               <UserListItem key={resault._id} user={resault} handler={()=>groupUsersHandler(resault)} />
             ))
           ) }
          
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='green'  onClick={createGroupHandler}>
              Create
            </Button>
          
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default GroupModal