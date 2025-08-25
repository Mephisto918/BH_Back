import React, { useState } from 'react';
import {
  DataTable as PrimeDataTable,
  DataTableFilterMeta,
  DataTableValueArray,
} from 'primereact/datatable';
import { Column } from 'primereact/column';
import { FilterMatchMode } from 'primereact/api';
import styled from '@emotion/styled';
import { BorderRadius, Colors, Spacing } from '@/features/constants';
import { useColorMode } from '@chakra-ui/react';
import { TableProps } from './types';

export default function DataTable<T>({ data, tableConfig }: TableProps<T>) {
  const { colorMode } = useColorMode();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const typedData = data as DataTableValueArray;

  const initialFilters: DataTableFilterMeta = Object.fromEntries(
    tableConfig.map((col) => [
      col.field,
      {
        value: null,
        matchMode: col.filterMatchMode ?? FilterMatchMode.CONTAINS,
      },
    ]),
  ) as DataTableFilterMeta;

  const [filters, setFilters] = useState<DataTableFilterMeta>(initialFilters);

  return (
    <TableContainer colorMode={colorMode} ref={containerRef}>
      <PrimeDataTable
        value={typedData}
        paginator
        rows={10}
        dataKey="id"
        filters={filters}
        filterDisplay="row"
        emptyMessage="No permits found."
        globalFilterFields={['name', 'permitType', 'status']}
      >
        {tableConfig.map((config, index) => (
          <Column
            key={index}
            field={config.field as string}
            header={config.columnName}
            filter={!!config.filterType}
            filterPlaceholder={config.placeholder}
            showFilterMenu={config.filterType === 'dropdown'}
            filterElement={
              config.filterElement
                ? (options) =>
                    config.filterElement!(options, containerRef.current)
                : undefined
            }
            body={(rowData: T) =>
              config.actionComponent ? (
                <div className="cell-actions">
                  {config.actionComponent(rowData)}
                </div>
              ) : (
                <div className="cell-default">
                  {(rowData as any)[config.field]}
                </div>
              )
            }
            style={{ minWidth: '14rem' }}
          />
        ))}
      </PrimeDataTable>
    </TableContainer>
  );
}

// ==========================
// Styled container
// ==========================
const TableContainer = styled.div<{ colorMode: string }>`
  padding: 1.5rem;
  border-radius: ${BorderRadius.xl};

  /* ==========================
   * CSS Variables for theming
   * ========================== */
  --color-light: ${Colors.PrimaryLight[9]};
  --color-dark: ${Colors.PrimaryLight[3]};
  --highlight-light: ${Colors.PrimaryLight[6]};
  --highlight-dark: ${Colors.PrimaryLight[5]};
  --text-light: ${Colors.TextInverse[5]};
  --text-dark: ${Colors.TextInverse[2]};
  --hidden-button-width: 1rem;

  background-color: ${({ colorMode }) =>
    colorMode === 'light' ? Colors.PrimaryLight[3] : Colors.PrimaryLight[8]};
  color: ${({ colorMode }) =>
    colorMode === 'light' ? Colors.TextInverse[5] : Colors.TextInverse[2]};

  .p-datatable {
    border-radius: ${BorderRadius.md};
    overflow: hidden;
  }

  /* ------------------------
   * Table Header
   * ------------------------ */
  .p-datatable-thead > tr > th > * {
    font-weight: 600;
    padding: 1rem 1.5rem;
    border-bottom: 2px solid #e5e7eb;
    white-space: nowrap;
    min-width: 8rem;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .p-datatable-thead > tr:nth-of-type(2) > th {
    border-bottom: 2px solid #e5e7eb;
  }

  .p-datatable-thead input {
    padding: ${Spacing.sm};
    border-radius: ${BorderRadius.md};
    background-color: var(--input-bg, ${Colors.PrimaryLight[2]});
    color: var(--input-color, ${Colors.TextInverse[5]});
  }

  /* ------------------------
   * Table Body
   * ------------------------ */
  .p-datatable-tbody > tr > td {
    padding: 0;
    vertical-align: middle;
  }

  .cell-default,
  .cell-actions {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    padding: 1rem 0.5rem;
  }

  .p-datatable-tbody > tr:hover {
    background-color: ${({ colorMode }) =>
      colorMode === 'light'
        ? 'var(--highlight-light)'
        : 'var(--highlight-dark)'};
    color: ${({ colorMode }) =>
      colorMode === 'light' ? 'var(--text-light)' : 'var(--text-dark)'};
  }

  /* ------------------------
   * Paginator
   * ------------------------ */
  .p-paginator {
    border-top: 1px solid #e5e7eb;
    padding: 0.5rem;
    justify-content: flex-end;
  }

  .p-paginator .p-paginator-page {
    border-radius: 6px;
    margin: 0 2px;
  }

  .p-paginator .p-highlight {
    background-color: ${({ colorMode }) =>
      colorMode === 'light' ? 'var(--color-light)' : 'var(--color-dark)'};
    color: ${({ colorMode }) =>
      colorMode === 'light' ? 'var(--text-light)' : 'var(--text-dark)'};
    padding: 0.2rem 0.6rem;
  }

  /* ------------------------
   * Dropdowns, tags, badges
   * ------------------------ */
  .p-tag {
    border-radius: 6px;
    font-weight: 600;
    font-size: 0.75rem;
    padding: 0.25rem 0.5rem;
  }

  .status-panel {
    border-radius: 8px;
    background-color: ${({ colorMode }) =>
      colorMode === 'light'
        ? `color-mix(in srgb, var(--color-dark), black 10%)`
        : `color-mix(in srgb, var(--color-light), black 10%)`};
    border: 2px solid
      ${({ colorMode }) =>
        colorMode === 'light'
          ? `color-mix(in srgb, var(--color-dark), black 10%)`
          : `color-mix(in srgb, var(--color-light), black 25%)`};
  }

  .status-panel .p-dropdown-items > *:hover {
    background-color: ${({ colorMode }) =>
      colorMode === 'dark'
        ? `color-mix(in srgb, var(--color-dark), black 10%)`
        : `color-mix(in srgb, var(--color-light), white 30%)`};
  }

  .status-panel .p-dropdown-item.p-highlight {
    background-color: ${({ colorMode }) =>
      colorMode === 'dark'
        ? `color-mix(in srgb, var(--color-dark), black 60%)`
        : `color-mix(in srgb, var(--color-light), white 45%)`};
  }
`;
