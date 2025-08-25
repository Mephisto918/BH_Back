import React, { useEffect } from 'react';
import styled from '@emotion/styled';
import DataTable from '@/features/shared/components/data-table/DataTable';
import { useGetAllQuery } from '@/infrastructure/permits/permits.redux.api';
import { PermitMetaData } from '../../../../../../../infrastructure/permits/permits.types';
import { tableConfig } from './table.config';
import BaseWrapper from '@/features/shared/layouts/wrappers/base-wrapper';
import { Box, Button, useColorMode } from '@chakra-ui/react';
import AsyncState from '@/features/shared/components/async-state/AsyncState';

export default function OwnersMainScreen() {
  const { colorMode } = useColorMode();
  const { data, isError, error, isLoading } = useGetAllQuery('owners');

  return (
    <ResponsiveContainer colorMode={colorMode}>
      <AsyncState
        isLoading={isLoading}
        isError={isError}
        errorObject={error}
        errorBody={(err, isOpen, onClose) => {
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
                <>
                  <Box>
                    ⚠️ Client error ({err.status}): maybe bad request or
                    unauthorized.
                    {/* <pre>{JSON.stringify(err.data, null, 2)}</pre> */}
                  </Box>
                  {onClose && (
                    <Button mt={4} onClick={onClose}>
                      Ok
                    </Button>
                  )}
                </>
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
        <DataTable<PermitMetaData>
          data={data ?? []}
          tableConfig={tableConfig}
        />
      </AsyncState>
    </ResponsiveContainer>
  );
}

const ResponsiveContainer = styled(BaseWrapper)<{ colorMode: string }>`
  .datatable {
    /* Scrollable on small screens */
    @media (max-width: 768px) {
      overflow-x: auto;
    }
  }
`;
