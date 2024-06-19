import { Avatar } from '@chakra-ui/avatar';
import { Tooltip } from '@chakra-ui/tooltip';

import React,{useContext} from 'react'
import ScrollabelFeed from 'react-scrollable-feed'
import ChatContext from '../context/chatProider';


function MessagesList({messages}) {
    const {user} = useContext(ChatContext)
    //functions
    const isSameSenderMargin = (messages, m, i, userId) => {
        // console.log(i === messages.length - 1);
      
        if (
          i < messages.length - 1 &&
          messages[i + 1].sender._id === m.sender._id &&
          messages[i].sender._id !== userId
        )
          return 33;
        else if (
          (i < messages.length - 1 &&
            messages[i + 1].sender._id !== m.sender._id &&
            messages[i].sender._id !== userId) ||
          (i === messages.length - 1 && messages[i].sender._id !== userId)
        )
          return 0;
        else return "auto";
      };
      
    const isSameSender = (messages, m, i, userId) => {
        return (
          i < messages.length - 1 &&
          (messages[i + 1].sender._id !== m.sender._id ||
            messages[i + 1].sender._id === undefined) &&
          messages[i].sender._id !== userId
        );
      };
    const isLastMessage = (messages, i, userId) => {
        return (
          i === messages.length - 1 &&
          messages[messages.length - 1].sender._id !== userId &&
          messages[messages.length - 1].sender._id
        );
      };
  return (
    <ScrollabelFeed>
        {messages && messages.map((message,i)=>(
            <div key={message._id} style={{display:"flex"}} >
                {(isSameSender(messages,message,i,user._id)
                || isLastMessage(messages,i,user._id)) && (
                    <Tooltip label={message.sender.name} hasArrow placement="bottom-start" >
                      <Avatar 
                       mt="7px" mr={1} size="sm" cursor="pointer" 
                       name={message.sender.name} src={message.sender.image} />
                        
                    </Tooltip>
                )
                 }
                <span style={{background :  message.sender._id === user._id ? "#B9F5D0" : "#BEE3F8" ,
                  "borderRadius" : "20px","maxWidth":"75%","padding":"5px 15px", "marginTop":"4px",
                  "marginLeft":isSameSenderMargin(messages,message,i,user._id)  }}>
                    {message.content}
                </span>
                
            </div>
        ))}
    </ScrollabelFeed>
  )
}

export default MessagesList