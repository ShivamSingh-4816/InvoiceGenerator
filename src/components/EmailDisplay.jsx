import React, { useEffect, useState } from 'react';
import { Box, Text, Badge, Spinner } from '@chakra-ui/react';
import { getEmailDetails } from '../utils/auth';
import { HiUser } from 'react-icons/hi';
import { FaUser } from 'react-icons/fa';

const EmailDisplay = () => {
  const [emailData, setEmailData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmailData = async () => {
      const result = await getEmailDetails();
      if (result.success) {
        setEmailData(result);
      } else {
        setError(result.error);
      }
      setIsLoading(false);
    };

    fetchEmailData();
  }, []);

  if (isLoading) return <Spinner />;
  if (error) return <Text color="red.500">{error}</Text>;
  if (!emailData?.email) return <Text>No email found</Text>;

  return (
    <>
      <FaUser size={28} />
      <Box p={4} borderWidth="none" borderRadius="none">
         
        <Text fontSize="lg" height="6" width="25">
          
           {emailData.email}
        </Text>
        <Badge colorScheme={emailData.isVerified ? "green" : "yellow"}>
          {emailData.isVerified ? "Verified" : "Not Verified"}
        </Badge>
        {emailData.lastSignIn && (
          <Text fontSize="sm" color="gray.500" mt={2}>
            Last sign in: {new Date(emailData.lastSignIn).toLocaleString()}
          </Text>
        )}
      </Box>
    </>
  );
};

export default EmailDisplay;