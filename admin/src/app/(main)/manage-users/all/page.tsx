"use client";

import UsersTable from "@/components/users/table";
import { useGetUsers } from "@/hooks/use-users";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import { AddUserDialog } from "@/components/users/add-user-dialog";

const AllUsersPage = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading } = useGetUsers({
    page,
    limit,
    search: debouncedSearch,
  });

  return (
    <section className="px-8">
      <Item variant="outline" className="flex-col lg:flex-row">
        <ItemContent className="w-full items-center lg:w-fit lg:items-start">
          <ItemTitle className="text-2xl font-semibold">All Vectyzen</ItemTitle>
          <ItemDescription>Manage all member in Vectyz</ItemDescription>
        </ItemContent>
        
        <ItemActions>
          <AddUserDialog />
        </ItemActions>
      </Item>

      <UsersTable
        isLoading={isLoading}
        users={data?.users || []}
        totalCount={data?.totalCount || 0}
        page={page}
        limit={limit}
        onPageChange={setPage}
        onPageSizeChange={(newLimit) => {
          setLimit(newLimit);
          setPage(1); // Reset to first page when limit changes
        }}
        filtersToolbar={
          <Input
            placeholder="Search users..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1); // Reset page on search
            }}
            className="max-w-sm"
          />
        }
      />
    </section>
  );
};

export default AllUsersPage;
