import React from 'react';

import BaseWrapper from '@/features/shared/layouts/wrappers/base-wrapper';
import { Box, Button, useColorMode, useDisclosure } from '@chakra-ui/react';
import { GetTenant, Tenant } from '@/infrastructure/tenants/tenant.types';
import { useGetAllQuery } from '@/infrastructure/tenants/tenant.redux.api';
import DataTable from '@/features/shared/components/data-table/DataTable';
import { Colors } from '@/features/constants';
import styled from '@emotion/styled';
import AsyncState from '@/features/shared/components/async-state/AsyncState';
import { tableConfig } from './table.config';
import ModalWrapper from '@/features/shared/components/modal-wrapper/ModalWrapper';

export default function TenantsMainScreen() {
  const { colorMode } = useColorMode();
  const { data, isError, isLoading, error } = useGetAllQuery();

  const {
    isOpen: addTenantModalIsOpoen,
    onOpen: addTenantModalOnOpen,
    onClose: addTenantModalOnClose,
  } = useDisclosure();

  return (
    <PageContainer colorMode={colorMode}>
      <AsyncState
        isLoading={isLoading}
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
        <DataTable<GetTenant>
          data={data ?? []}
          tableConfig={tableConfig}
          emptyTableMessage="No Tenants Found"
          enableGlobalSearch={true}
          headerButtonSlot={
            <AddUserButton colorMode={colorMode} onClick={addTenantModalOnOpen}>
              Add Tenant
            </AddUserButton>
          }
        />
        {addTenantModalIsOpoen && (
          <ModalWrapper
            isOpen={addTenantModalIsOpoen}
            onClose={addTenantModalOnClose}
            closeOnOverlayClick={false}
            closeOnEsc={false}
          >
            <div>Hello</div>
          </ModalWrapper>
        )}
      </AsyncState>
    </PageContainer>
  );
}

const PageContainer = styled(BaseWrapper)<{ colorMode: string }>`
  > :not(:nth-of-type(1)) {
    border: 1px solid yellow;
    aspect-ratio: 1/1;
    height: 10;
  }
  .datatable {
    /* Scrollable on small screens */
    @media (max-width: 768px) {
      overflow-x: auto;
    }
  }
`;

const AddUserButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'colorMode',
})<{ colorMode: string }>`
  background-color: ${({ colorMode }) =>
    colorMode === 'dark' ? Colors.PrimaryLight[5] : Colors.PrimaryLight[4]};
`;
