import {
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    useDisclosure,
    Button

  } from '@chakra-ui/react'

  import { Image } from '@chakra-ui/react'

  import React from 'react';


  function SizeExample() {
    const [size, setSize] = React.useState('')
    const { isOpen, onOpen, onClose } = useDisclosure()
  
    const handleClick = (newSize) => {
      setSize(newSize)
      onOpen()
    }
  
    const sizes = ['sm']
  
    return (
      <>
        {sizes.map((size) => (
          <Button
            onClick={() => handleClick(size)}
            key={size}
            m={4}
          >{`Click me for Chatbot`}
            <Image
  borderRadius='full'
  boxSize='20px'
  src='sih-internal\client\public\BOT.png'
//   alt='ChatBot'
/>
          
          </Button>
        ))}
  
        <Drawer onClose={onClose} isOpen={isOpen} size={size}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>{`Welcome to the ChatBot`}</DrawerHeader>

            Chat Bot Avatar and Interface here
            <DrawerBody>
              
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </>
    )
  }

  export {SizeExample};