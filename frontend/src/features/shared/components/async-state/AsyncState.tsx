import React from 'react';
import {
  Spinner,
  Center,
  Flex,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Box,
  useDisclosure,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';

/**
 * Props for the AsyncState component.
 *
 * @template T - Type of the error object. Defaults to `FetchBaseQueryError | SerializedError`.
 * @property {boolean} isLoading - Whether the async operation is in a loading state.
 * @property {boolean} isError - Whether the async operation has errored.
 * @property {T} [errorObject] - Optional error object that can be passed to a custom error renderer.
 * @property {(errorObj: T) => React.ReactNode} [errorBody] - Function to render a custom error UI.
 * @property {boolean} [globalOverlay=true] - If true, show a full-page overlay when loading; otherwise inline spinner.
 * @property {React.ReactNode} children - The content to render when not loading or error.
 */
interface AsyncStateProps<T = FetchBaseQueryError | SerializedError> {
  isLoading: boolean;
  isError: boolean;
  errorObject?: T;
  errorBody?: (
    errorObj: T,
    isOpen?: boolean,
    onClose?: () => void,
  ) => React.ReactNode;
  globalOverlay?: boolean;
  children: React.ReactNode;
}

/**
 * AsyncState component that handles loading and error states for async operations.
 *
 * @template T - Type of the error object passed to `errorBody`.
 * @param {AsyncStateProps<T>} props - Props for the component.
 * @returns {JSX.Element} The loading spinner, error modal, or children content depending on state.
 *
 * @example
 * <AsyncState
 *   isLoading={isLoading}
 *   isError={isError}
 *   errorObject={error}
 *   errorBody={(err) => <div>{JSON.stringify(err)}</div>}
 * >
 *   <YourComponent />
 * </AsyncState>
 */
export default function AsyncState<T>({
  isLoading,
  isError,
  globalOverlay = true,
  errorObject,
  errorBody,
  children,
}: AsyncStateProps<T>) {
  const bgOverlay = useColorModeValue('whiteAlpha.700', 'blackAlpha.700');
  const { isOpen, onClose } = useDisclosure({ defaultIsOpen: true });

  if (isLoading) {
    return globalOverlay ? (
      <Flex
        as={motion.div}
        position="fixed"
        top={0}
        left={0}
        w="100vw"
        h="100vh"
        bg={bgOverlay}
        zIndex={9999}
        align="center"
        justify="center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <Spinner
          size="xl"
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.400"
        />
      </Flex>
    ) : (
      <Center py={10}>
        <Spinner size="lg" color="blue.400" />
      </Center>
    );
  }

  if (isError) {
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Error</ModalHeader>
          <ModalBody>
            {errorObject && errorBody
              ? errorBody(errorObject, isOpen, onClose)
              : 'Something went wrong.'}
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }

  return (
    <Box display="flex" flexDirection="column" flex="1" height="100%">
      {children}
    </Box>
  );
}
