'use client';

import useConfirmDialog from '@/components/confirm-dialog/use-confirm-dialog';
import Link from '@/components/link';
import TableComponents from '@/components/table/table-components';
import { useDeleteEmployeesService } from '@/services/api/services/employees';
import { Employee } from '@/services/api/types/employee';
import { RoleEnum } from '@/services/api/types/role';
import { SortEnum } from '@/services/api/types/sort-type';
import useAuth from '@/services/auth/use-auth';
import withPageRequiredAuth from '@/services/auth/with-page-required-auth';
import removeDuplicatesFromArrayObjects from '@/services/helpers/remove-duplicates-from-array-of-objects';
import { useTranslation } from '@/services/i18n/client';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Grow from '@mui/material/Grow';
import LinearProgress from '@mui/material/LinearProgress';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { InfiniteData, useQueryClient } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { PropsWithChildren, useCallback, useMemo, useRef, useState } from 'react';
import { TableVirtuoso } from 'react-virtuoso';
import { EmployeeSortType } from '../employees/employee-filter-types';
import { employeesQueryKeys, useEmployeeListQuery } from './queries/employees-queries';

type EmployeesKeys = keyof Employee;

const TableCellLoadingContainer = styled(TableCell)(() => ({
  padding: 0,
}));

function TableSortCellWrapper(
  props: PropsWithChildren<{
    width?: number;
    orderBy: EmployeesKeys;
    order: SortEnum;
    column: EmployeesKeys;
    handleRequestSort: (event: React.MouseEvent<unknown>, property: EmployeesKeys) => void;
  }>
) {
  return (
    <TableCell style={{ width: props.width }} sortDirection={props.orderBy === props.column ? props.order : false}>
      <TableSortLabel
        active={props.orderBy === props.column}
        direction={props.orderBy === props.column ? props.order : SortEnum.ASC}
        onClick={(event) => props.handleRequestSort(event, props.column)}>
        {props.children}
      </TableSortLabel>
    </TableCell>
  );
}

function Actions({ employee }: { employee: Employee }) {
  const [open, setOpen] = useState(false);
  const { user: authEmployee } = useAuth();
  const { confirmDialog } = useConfirmDialog();
  const fetchEmployeeDelete = useDeleteEmployeesService();
  const queryClient = useQueryClient();
  const anchorRef = useRef<HTMLDivElement>(null);
  const canDelete = employee.id !== authEmployee?.id;
  const { t: tEmployees } = useTranslation('admin-panel-employees');

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: Event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
      return;
    }

    setOpen(false);
  };

  const handleDelete = async () => {
    const isConfirmed = await confirmDialog({
      title: tEmployees('admin-panel-employees:confirm.delete.title'),
      message: tEmployees('admin-panel-employees:confirm.delete.message'),
    });

    if (isConfirmed) {
      setOpen(false);

      const searchParams = new URLSearchParams(window.location.search);
      const searchParamsSort = searchParams.get('sort');

      let sort: EmployeeSortType | undefined = {
        order: SortEnum.DESC,
        orderBy: 'id',
      };

      if (searchParamsSort) {
        sort = JSON.parse(searchParamsSort);
      }

      const previousData = queryClient.getQueryData<InfiniteData<{ nextPage: number; data: Employee[] }>>(
        employeesQueryKeys.list().sub.by({ sort }).key
      );

      await queryClient.cancelQueries({ queryKey: employeesQueryKeys.list().key });

      const newData = {
        ...previousData,
        pages: previousData?.pages.map((page) => ({
          ...page,
          data: page?.data.filter((item) => item.id !== employee.id),
        })),
      };

      queryClient.setQueryData(employeesQueryKeys.list().sub.by({ sort }).key, newData);

      await fetchEmployeeDelete({
        id: employee.id,
      });
    }
  };

  const mainButton = (
    <Button size="small" variant="contained" LinkComponent={Link} href={`/admin-panel/employees/edit/${employee.id}`}>
      {tEmployees('admin-panel-employees:actions.edit')}
    </Button>
  );

  return (
    <>
      {[!canDelete].every(Boolean) ? (
        mainButton
      ) : (
        <ButtonGroup variant="contained" ref={anchorRef} aria-label="split button" size="small">
          {mainButton}

          <Button
            size="small"
            aria-controls={open ? 'split-button-menu' : undefined}
            aria-expanded={open ? 'true' : undefined}
            aria-label="select merge strategy"
            aria-haspopup="menu"
            onClick={handleToggle}>
            <ArrowDropDownIcon />
          </Button>
        </ButtonGroup>
      )}
      <Popper
        sx={{
          zIndex: 1,
        }}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal>
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
            }}>
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="split-button-menu" autoFocusItem>
                  {canDelete && (
                    <MenuItem
                      sx={{
                        bgcolor: 'error.main',
                        '&:hover': {
                          bgcolor: 'error.light',
                        },
                      }}
                      onClick={handleDelete}>
                      {tEmployees('admin-panel-employees:actions.delete')}
                    </MenuItem>
                  )}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
}

function Employees() {
  const { t: tEmployees } = useTranslation('admin-panel-employees');
  const { t: tPositions } = useTranslation('admin-panel-positions');
  const searchParams = useSearchParams();
  const router = useRouter();
  const [{ order, orderBy }, setSort] = useState<{
    order: SortEnum;
    orderBy: EmployeesKeys;
  }>(() => {
    const searchParamsSort = searchParams.get('sort');
    if (searchParamsSort) {
      return JSON.parse(searchParamsSort);
    }
    return { order: SortEnum.DESC, orderBy: 'id' };
  });

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: EmployeesKeys) => {
    const isAsc = orderBy === property && order === SortEnum.ASC;
    const searchParams = new URLSearchParams(window.location.search);
    const newOrder = isAsc ? SortEnum.DESC : SortEnum.ASC;
    const newOrderBy = property;
    searchParams.set('sort', JSON.stringify({ order: newOrder, orderBy: newOrderBy }));
    setSort({
      order: newOrder,
      orderBy: newOrderBy,
    });
    router.push(window.location.pathname + '?' + searchParams.toString());
  };

  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } = useEmployeeListQuery({ sort: { order, orderBy } });

  const handleScroll = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage) return;
    fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const result = useMemo(() => {
    const result = (data?.pages.flatMap((page) => page?.data) as Employee[]) ?? ([] as Employee[]);

    return removeDuplicatesFromArrayObjects(result, 'id');
  }, [data]);

  return (
    <Container maxWidth="md">
      <Grid container spacing={3} pt={3}>
        <Grid container item spacing={3} xs={12}>
          <Grid item xs>
            <Typography variant="h3">{tEmployees('admin-panel-employees:title')}</Typography>
          </Grid>
          <Grid container item xs="auto" wrap="nowrap" spacing={2}>
            <Grid item xs="auto">
              <Button variant="contained" LinkComponent={Link} href="/admin-panel/employees/create" color="success">
                {tEmployees('admin-panel-employees:actions.create')}
              </Button>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} mb={2}>
          <TableVirtuoso
            style={{ height: 500 }}
            data={result}
            components={TableComponents}
            endReached={handleScroll}
            overscan={20}
            fixedHeaderContent={() => (
              <>
                <TableRow>
                  <TableSortCellWrapper
                    orderBy={orderBy}
                    order={order}
                    column="id"
                    handleRequestSort={handleRequestSort}>
                    {tEmployees('admin-panel-employees:table.column1')}
                  </TableSortCellWrapper>
                  <TableSortCellWrapper
                    orderBy={orderBy}
                    order={order}
                    column="firstName"
                    handleRequestSort={handleRequestSort}>
                    {tEmployees('admin-panel-employees:table.column2')}
                  </TableSortCellWrapper>
                  <TableSortCellWrapper
                    orderBy={orderBy}
                    order={order}
                    column="lastName"
                    handleRequestSort={handleRequestSort}>
                    {tEmployees('admin-panel-employees:table.column3')}
                  </TableSortCellWrapper>

                  <TableSortCellWrapper
                    orderBy={orderBy}
                    order={order}
                    column="email"
                    handleRequestSort={handleRequestSort}>
                    {tEmployees('admin-panel-employees:table.column4')}
                  </TableSortCellWrapper>
                  <TableSortCellWrapper
                    orderBy={orderBy}
                    order={order}
                    column="salary"
                    handleRequestSort={handleRequestSort}>
                    {tEmployees('admin-panel-employees:table.column5')}
                  </TableSortCellWrapper>
                  <TableCell style={{ width: 80 }}>{tEmployees('admin-panel-employees:table.column6')}</TableCell>
                  <TableCell style={{ width: 130 }}></TableCell>
                </TableRow>
                {isFetchingNextPage && (
                  <TableRow>
                    <TableCellLoadingContainer colSpan={6}>
                      <LinearProgress />
                    </TableCellLoadingContainer>
                  </TableRow>
                )}
              </>
            )}
            itemContent={(index, employee) => (
              <>
                <TableCell style={{ width: 100 }}>{employee?.id}</TableCell>
                <TableCell style={{ width: 200 }}>{employee?.firstName}</TableCell>
                <TableCell style={{ width: 200 }}>{employee?.lastName}</TableCell>
                <TableCell>{employee?.email}</TableCell>
                <TableCell style={{ width: 80 }}>{employee?.salary}</TableCell>
                <TableCell style={{ width: 80 }}>{tPositions(`position.${employee?.position?.id}`)}</TableCell>
                <TableCell style={{ width: 130 }}>{!!employee && <Actions employee={employee} />}</TableCell>
              </>
            )}
          />
        </Grid>
      </Grid>
    </Container>
  );
}

export default withPageRequiredAuth(Employees, { roles: [RoleEnum.ADMIN] });
