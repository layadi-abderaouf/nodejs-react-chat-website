import React,{useState} from 'react'
import {useNavigate} from 'react-router-dom'
import axios from 'axios'
import { Input ,InputGroup,InputRightElement} from '@chakra-ui/input'
import { FormControl,FormLabel } from '@chakra-ui/form-control'
import {
  VStack,Button,useToast
  } from '@chakra-ui/react'

function Login() {

  //api url
  const api_url ="http://192.168.1.12:5000"

  //state
  const [show, setshow] = useState(false)
  const [loading, setloading] = useState(false)
  const [email, setemail] = useState()
  const [password, setpassword] = useState()
  
  const navigate = useNavigate()
  const toast = useToast();

  const showClick = ()=>setshow(!show)

  const submit = async ()=>{
    setloading(true)
    if( !email || !password ){
      toast({
        title: 'Please enter all field required !',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position:'bottom'
      })
      setloading(false)
      return;
    }
    try {
      const config = {
        headers : {
          "content-type":"application/json"
        }
      };
      const {data} = await axios.post(
        api_url + "/api/user/login",
        {email,password},
        config);
      toast({
        title: 'login Successful',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position:'bottom'
      })
      localStorage.setItem("user_info",JSON.stringify(data))
      setloading(false)
      navigate("/")
    } catch (error) {
      toast({
        title: '  Error!!!',
        description: error.response.data.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position:'bottom'
      })
      
      setloading(false)
    }
  }

  return (
    <VStack
      spacing="5px" 
    >
     

      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input 
          placeholder="Enter your email"
          focusBorderColor="green.200"
          onChange={(e)=>setemail(e.target.value)}
             />
      </FormControl>

      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup size="md">
          <Input 
            
            placeholder="Enter your Password"
            type={show ? "text" : "password"}
            focusBorderColor="green.200"
            onChange={(e)=>setpassword(e.target.value)}
               />
          <InputRightElement width="4.5rem">
            <Button p={2} h="1.75rem" size="5m" onClick={showClick}>
                {show ? 'Hide ':'show'}
            </Button>
          </InputRightElement>
          
        </InputGroup>
      </FormControl>


      <Button
        colorScheme="green" 
        width="100%"
        onClick={submit}
        style={{marginTop : 15,marginBottom:5}}
        isLoading={loading}
        >
        login
      </Button>

      <Button
        colorScheme="red" 
        width="100%"
        onClick={()=>{
          setemail('guest@gmail.com');
          setpassword('123456789')
        }}
        style={{marginTop : 15,marginBottom:5}}
        >
        login as a guest user
      </Button> 

    </VStack>
  )
}

export default Login