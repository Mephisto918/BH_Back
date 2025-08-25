import UserInformation from '@/features/admins/users/shared/components/UserInformation';
import { createFilterElement } from '@/features/shared/components/data-table/services';
import { TableConfig } from '@/features/shared/components/data-table/types';
import ModalWrapper from '@/features/shared/components/modal-wrapper/ModalWrapper';
import { GetTenant } from '@/infrastructure/tenants/tenant.types';
import { Button, useDisclosure } from '@chakra-ui/react';

export const tableConfig: TableConfig<GetTenant>[] = [
  {
    columnName: 'ID',
    field: 'id',
    filterType: 'input',
  },
  {
    columnName: 'Name',
    field: 'fullname',
    filterType: 'input',
  },
  {
    columnName: 'Email',
    field: 'email',
    filterType: 'input',
  },
  {
    columnName: 'Verified',
    field: 'isVerified',
    filterType: 'dropdown',
    filterElement: createFilterElement(
      'dropdown',
      [false, true],
      'Select Toggle',
      {
        true: 'Verified',
        false: 'Not Verified',
      },
    ),
    actionComponent(rowData) {
      return <>{rowData.isVerified ? 'Verified' : 'Not Verified'}</>;
    },
  },
  {
    columnName: 'Actions',
    field: 'actions',
    filterType: 'input',
    filterElement: createFilterElement('none'),
    actionComponent: (rowData: GetTenant) => {
      const RowActions = () => {
        const { isOpen, onOpen, onClose } = useDisclosure();
        return (
          <>
            <Button onClick={onOpen}>Details</Button>
            {isOpen && (
              <ModalWrapper
                isOpen={isOpen}
                onClose={onClose}
                closeOnEsc={false}
                closeOnOverlayClick={false}
              >
                <UserInformation id={rowData.id} />
              </ModalWrapper>
            )}
            <Button style={{ backgroundColor: 'red' }}>Delete</Button>
          </>
        );
      };

      return <RowActions />;
    },
  },
];
