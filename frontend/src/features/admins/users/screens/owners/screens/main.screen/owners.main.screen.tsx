import React from 'react';
import BaseWrapper from '@/features/shared/layouts/wrappers/base-wrapper';
import styled from '@emotion/styled';

import { createFilterElement } from '../../../../../../shared/components/data-table/services';
import { Button } from 'primereact/button';
import { TableConfig } from '../../../../../../shared/components/data-table/types';
import { Colors } from '@/features/constants';
import DataTable from '../../../../../../shared/components/data-table/DataTable';
import { Owner } from '@/infrastructure/owner/owner.types';
import { useGetAllQuery } from '@/infrastructure/owner/owner.redux.slice';

const tableConfig: TableConfig<Owner>[] = [
  {
    columnName: 'ID',
    field: 'id',
    filterType: 'input',
  },
  {
    columnName: 'Firstname',
    field: 'firstname',
    filterType: 'input',
  },
  {
    columnName: 'Lastname',
    field: 'lastname',
    filterType: 'input',
  },
  {
    columnName: 'Actions',
    field: 'actions',
    filterType: undefined,
    actionComponent: (rowData: Owner) => (
      <>
        <Button
          label="Open"
          icon="pi pi-external-link"
          severity="info"
          size="small"
          style={{ backgroundColor: Colors.PrimaryLight[6] }}
          onClick={() => onOpenDetailsItem(rowData.id)}
        />
        <Button
          label="Delete"
          icon="pi pi-trash"
          severity="danger"
          size="small"
          style={{ backgroundColor: Colors.Danger[3] }}
          onClick={() => onDeleteItem(rowData.id)}
        />
      </>
    ),
  },
];

const onDeleteItem = (id?: number) => {
  if (!id) return;
  console.log('Delete item with ID:', id);
};
const onOpenDetailsItem = (id?: number) => {
  if (!id) return;
  console.log('Open item with ID:', id);
};
export default function OwnersMainScreen() {
  const { data, error } = useGetAllQuery();

  return (
    <BaseWrapper>
      <ResponsiveContainer>
        <DataTable<Owner> data={data ?? []} tableConfig={tableConfig} />
      </ResponsiveContainer>
    </BaseWrapper>
  );
}

/*
| ID | Username | Full Name | Email | Phone | Status | Boarding Houses | Created At | Actions |
 */

const ResponsiveContainer = styled.section`
  width: 100%;
  display: flex;
  flex-direction: column;

  .datatable {
    /* Scrollable on small screens */
    @media (max-width: 768px) {
      overflow-x: auto;
    }
  }
`;
