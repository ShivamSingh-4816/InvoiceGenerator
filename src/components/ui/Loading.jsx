import { Box, Flex } from '@chakra-ui/react';
import { keyframes } from '@emotion/react';

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const Loading = () => {
  return (
    <Flex 
      justify="center" 
      align="center" 
      height="100vh"
      width="100%"
    >
      <Box
        width="40px"
        height="40px"
        border="4px solid"
        borderColor="gray.200"
        borderTopColor="blue.500"
        borderRadius="50%"
        sx={{
          animation: `${spin} 0.8s linear infinite`
        }}
      />
    </Flex>
  );
};

export default Loading;