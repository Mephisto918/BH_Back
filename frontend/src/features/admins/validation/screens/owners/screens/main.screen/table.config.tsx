import { TableConfig } from '../../../../../../shared/components/data-table/types';
import {
  PermitMetaData,
  VerificationStatus,
  VerificationType,
} from '../../../../../../../infrastructure/permits/permits.types';
import { createFilterElement } from '@/features/shared/components/data-table/services';
import TableOwnerRowActionsConfig from './table.owner-rowActions.config';

export const tableConfig: TableConfig<PermitMetaData>[] = [
  {
    columnName: 'Owner',
    field: 'ownerFullName',
    filterType: 'input',
  },
  {
    columnName: 'Permit Type',
    field: 'verificationType',
    filterType: 'dropdown',
    filterElement: createFilterElement<VerificationType>(
      'dropdown',
      ['DTI', 'SEC', 'FIRE_CERTIFICATE'],
      'Search by type',
    ),
  },
  {
    columnName: 'Status',
    field: 'verificationStatus',
    filterType: 'dropdown',
    filterElement: createFilterElement<VerificationStatus>(
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
      return <TableOwnerRowActionsConfig rowData={rowData} />;
      // const RowActions = () => {
      //   const { isOpen, onOpen, onClose } = useDisclosure();
      //   return (
      //     <>
      //       {/* <OpenItemDetails id={rowData.id} /> */}
      //       <Button onClick={onOpen}>Open Details</Button>
      //       {isOpen && (
      //         <ModalWrapper
      //           isOpen={isOpen}
      //           onClose={onClose}
      //           closeOnEsc={false}
      //           closeOnOverlayClick={false}
      //           showCloseButton
      //           chakraStyling={{
      //             w: { base: '90dvw', md: '90dvw' },
      //             h: { base: '90dvh', md: '85dvh' },
      //             maxH: { base: '95dvh', md: '90dvh' },
      //             borderColor: 'yellow',
      //             borderWidth: '3px',
      //           }}
      //         >
      //           <PermitInfo permitId={rowData.id} />
      //         </ModalWrapper>
      //       )}
      //       <Button>Reject</Button>
      //     </>
      //   );
      // };
      // return <RowActions />;
    },
  },
];
