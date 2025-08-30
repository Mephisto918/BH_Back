import React from 'react';
import { Button, Flex, Box, Text } from '@chakra-ui/react';
import styled from '@emotion/styled';
import { PdfViewer } from '@/infrastructure/utils/pdf/PDFViewer.component';
import { useGetOneQuery } from '@/infrastructure/permits/permits.redux.api';
import AsyncState from '@/features/shared/components/async-state/AsyncState';
import { parseIsoDate } from '@/infrastructure/utils/parseISODate.util';

export default function PermitInfo({ permitId }: { permitId: number }) {
  const {
    data: permitData,
    isLoading,
    isError,
    error,
  } = useGetOneQuery({
    entityType: 'owners',
    id: permitId,
  });
  const permitDateObject = parseIsoDate(permitData?.createdAt);
  return (
    <AsyncState
      isLoading={isLoading}
      globalOverlay={false}
      isError={isError}
      errorObject={error}
      errorBody={(err) => {
        // Narrow types if possible
        if ('status' in err) {
          if (err.status >= '500') {
            return (
              <Box>
                🚨 Server error (500): something went wrong on our side.
              </Box>
            );
          }

          if (err.status >= '400') {
            return (
              <Box>
                ⚠️ Client error ({err.status}): maybe bad request or
                unauthorized.
                {/* <pre>{JSON.stringify(err.data, null, 2)}</pre> */}
              </Box>
            );
          }
        }

        // Fallback for unknown error shapes
        return (
          <Box color="gray.500">
            ❓ Unexpected error
            <pre>{JSON.stringify(err, null, 2)}</pre>
          </Box>
        );
      }}
    >
      {permitData && (
        <BodyContainer>
          <Box
            flex="2"
            bg="gray.50"
            overflowY="scroll"
            className="pdf-viewer-container"
          >
            <PdfViewer url={permitData.url} />
          </Box>

          {/* Right: Details + Actions */}
          <Box
            flex="1"
            borderLeft="1px solid"
            borderColor="gray.200"
            minHeight={0}
          >
            <Flex direction="column" height="100%">
              {/* Top: details */}
              <Box flex="1" p={4} overflowY="auto" minHeight={0}>
                <Text fontWeight="bold">Permit Info</Text>
                <Text>ID: {permitData?.id}</Text>
                <Text>Owner: {permitData.ownerFullName}</Text>
                <Text>Status: {permitData.status}</Text>
                <Text>Created At: {permitDateObject?.dateOnly.toString()}</Text>
              </Box>

              {/* Bottom: actions */}
              <Box
                p={4}
                borderTop="1px solid"
                borderColor="gray.200"
                display="flex"
                gap={2}
                justifyContent="flex-end"
                flexShrink={0}
              >
                <Button colorScheme="green">Approve</Button>
                <Button colorScheme="red">Reject</Button>
              </Box>
            </Flex>
          </Box>
        </BodyContainer>
      )}
    </AsyncState>
  );
}

const BodyContainer = styled(Flex)`
  flex: 1;
  width: 100%;
  height: 100%;
  overflow: hidden;
  min-height: 0; /* <-- add this */

  > :nth-of-type(1) {
    flex: 2;
    min-height: 0; /* allow inner scroll */
  }
  > :nth-of-type(2) {
    flex: 1;
    min-height: 0; /* allow inner scroll */
    overflow-y: auto;
  }

  .pdf-viewer-container {
    padding: 1rem;
    background-color: transparent !important;
    &::-webkit-scrollbar {
      display: none !important;
      scrollbar-width: none !important;
      -ms-overflow-style: none !important;
    }
  }
`;
