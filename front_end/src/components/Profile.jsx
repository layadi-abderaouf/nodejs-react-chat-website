import React from 'react'
import { IconButton } from '@chakra-ui/button'
import { ViewIcon } from '@chakra-ui/icons'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    Image,Text
  
  } from '@chakra-ui/react'
import {useDisclosure} from '@chakra-ui/hooks'

function Profile({user,children}) {
    const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
    
    {children? 
       (<span onClick={onOpen}>{children}</span>):
       (<IconButton d={{base:"flex"}} onClick={onOpen} icon={<ViewIcon/>} />)
    }
    <Modal  isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="40px" fontFamily="work sans" display="flex" justifyContent="center">{user.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
           <Image src={user.image} alt={user.name}  borderRadius="full"/>
           <Text fontFamily="work sans" fontSize={{base:"28px",md:"30px"}}>
            Email : {user.email}
           </Text>
          
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='green' mr={3} onClick={onClose}>
              Close
            </Button>
          
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default Profile