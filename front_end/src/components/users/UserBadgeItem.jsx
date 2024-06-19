import { CloseIcon } from '@chakra-ui/icons'
import { Box } from '@chakra-ui/layout'
import React from 'react'

function UserBadgeItem({user,handler}) {
  return (
      <Box 
        px={2} py={1} borderRadius="lg" m={1} mb={2} 
        variant="solid" fontSize={12} bg="purple" color="white"
        cursor="pointer" onClick={handler}
      >
        {user.name}
        <CloseIcon m={1} boxSize={2}/>
      </Box>
    
  )
}

export default UserBadgeItem