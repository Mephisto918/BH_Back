import { TableConfig } from '../../../../../../shared/components/data-table/types';
import {
  PermitMetaData,
  PermitStatus,
  PermitType,
} from '../../../../../../../infrastructure/permits/permits.types';
import { createFilterElement } from '@/features/shared/components/data-table/services';
import { Button, useDisclosure } from '@chakra-ui/react';
import ModalWrapper from '@/features/shared/components/modal-wrapper/ModalWrapper';
import PermitInfo from './permit-info/PermitInfo';

export const tableConfig: TableConfig<PermitMetaData>[] = [
  {
    columnName: 'Owner',
    field: 'ownerFullName',
    filterType: 'input',
  },
  {
    columnName: 'Permit Type',
    field: 'type',
    filterType: 'dropdown',
    filterElement: createFilterElement<PermitType>(
      'dropdown',
      ['BUSINESS_PERMIT', 'DTI', 'SEC', 'FIRE_CERTIFICATE'],
      'Search by type',
    ),
  },
  {
    columnName: 'Status',
    field: 'status',
    filterType: 'dropdown',
    filterElement: createFilterElement<PermitStatus>(
      'dropdown',
      ['APPROVED', 'PENDING', 'REJECTED', 'EXPIRED'],
      'Search by status',
    ),
  },
  {
    columnName: 'Date Created',
    field: 'createdAt',
    filterType: 'date',
  },
  {
    columnName: 'Actions',
    field: 'actions',
    filterType: undefined,
    actionComponent: (rowData: PermitMetaData) => {
      const RowActions = () => {
        const { isOpen, onOpen, onClose } = useDisclosure();
        return (
          <>
            {/* <OpenItemDetails id={rowData.id} /> */}
            <Button onClick={onOpen}>Open Details</Button>
            {isOpen && (
              <ModalWrapper
                isOpen={isOpen}
                onClose={onClose}
                closeOnEsc={false}
                closeOnOverlayClick={false}
                showCloseButton
                chakraStyling={{
                  w: { base: '90dvw', md: '90dvw' },
                  h: { base: '90dvh', md: '85dvh' },
                  maxH: { base: '95dvh', md: '90dvh' },
                  borderColor: 'yellow',
                  borderWidth: '3px',
                }}
              >
                <PermitInfo permitId={rowData.id} />
              </ModalWrapper>
            )}
            <Button>Reject</Button>
          </>
        );
      };
      return <RowActions />;
    },
  },
];
