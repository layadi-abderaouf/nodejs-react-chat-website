import React from 'react'

//chakra ui
import {
  Container,
  Box,
  Text,
  TabPanel,
  TabPanels,
  Tab,
  TabList,
  Image,
  Tabs} from '@chakra-ui/react'

//components
import Login from '../components/Auth/Login'
import SignUp from '../components/Auth/SignUp'

function LoginPage() {
  return (
    
    <Container  style={{marginBottom : 50}} maxW="xl" centerContent>
        <Box d="flex" 
             justifyContent="center"
             textAlign="center"
             p={3} bg={'white'}
             w='100%' m="40px 0 15px 0" borderRadius="lg"
             borderWidth="1px">
          <Text fontSize="4xl" fontFamily="work sans">R-Chat App</Text>
         
          
          
        </Box>
        <Box 
          p={3} bg={'white'}
          w='100%'  borderRadius="lg"
          borderWidth="1px">
            <Tabs variant='soft-rounded' colorScheme='green'>
               <TabList mb='1em'>
                 <Tab w="50%">Login</Tab>
                 <Tab w="50%">Sign Up</Tab>
               </TabList>
               <TabPanels>
                 <TabPanel>
                   <Login></Login>
                 </TabPanel>
                 <TabPanel>
                   <SignUp></SignUp>
                 </TabPanel>
               </TabPanels>
             </Tabs>
          
        </Box>
    </Container>
  )
}

export default LoginPage