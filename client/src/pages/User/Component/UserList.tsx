import { useCallback, useEffect, useState, type FC, type UIEvent } from "react"
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../../components/Table"
import UserService from "../../../services/UserService"
import Spinner from "../../../components/Spinner/Spinner"

interface UserlistProps {
    onAdduser: () => void
    onEditUser: (userId: number) => void
    onDeleteUser: (userId: number) => void
    refreshKey: boolean
}

interface UserRow {
  id: number;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  suffix_name: string | null;
  gender_id: number | null;
  gender_name: string | null;
  birth_date: string;
  username: string;
}

const Userlist: FC<UserlistProps>= ({onAdduser, onEditUser, onDeleteUser, refreshKey}) => {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const handleLoadUsers = useCallback(async (nextPage = 1, append = false) => {
    try {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      const res = await UserService.loadUsers(nextPage);
      if (res.status === 200) {
        const nextUsers = res.data.users ?? [];
        setUsers((prev) => (append ? [...prev, ...nextUsers] : nextUsers));
        setPage(res.data.current_page ?? nextPage);
        setHasMore(Boolean(res.data.has_more));
      }
    } catch (error) {
      console.error("Unexpected server error occurred during loading users:", error);
    } finally {
      if (append) {
        setLoadingMore(false);
      } else {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    void handleLoadUsers(1, false);
  }, [handleLoadUsers, refreshKey]);

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    if (loading || loadingMore || !hasMore) return;

    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 80;

    if (isNearBottom) {
      void handleLoadUsers(page + 1, true);
    }
  };

  const getFullName = (user: UserRow) => {
    const middlePart = user.middle_name ? ` ${user.middle_name}` : "";
    const suffixPart = user.suffix_name ? ` ${user.suffix_name}` : "";
    return `${user.last_name}, ${user.first_name}${middlePart}${suffixPart}`.trim();
  };

  const getAge = (birthDate: string) => {
    const today = new Date();
    const dob = new Date(birthDate);
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    const dayDiff = today.getDate() - dob.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age -= 1;
    }

    return age >= 0 ? age : "-";
  };

  const formatBirthDate = (birthDate: string) => {
    if (!birthDate) return "-";
    const parsedDate = new Date(birthDate);
    if (Number.isNaN(parsedDate.getTime())) {
      return birthDate;
    }
    return parsedDate.toISOString().split("T")[0];
  };

  return (
    <>
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <div
          className="max-w-full max-h-[calc(100vh-12rem)] overflow-auto"
          onScroll={handleScroll}
        >
          <Table>
            <caption>
                <div className="border-b border-gray-100">
                    <div className="p-4 flex justify-end">
                        <button
                          type="button"
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-lg transition cursor-pointer"
                          onClick={onAdduser}
                        >
                          Add User
                        </button>
                    </div>
                </div>
            </caption>

            <TableHeader className="border-b border-gray-200 bg-blue-600 sticky top-0 text-white text-xs">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 font-medium text-center">
                  No.
                </TableCell>

                <TableCell isHeader className="px-5 py-3 font-medium text-center">
                  Full Name
                </TableCell>

                <TableCell isHeader className="px-5 py-3 font-medium text-center">
                  Gender
                </TableCell>

                <TableCell isHeader className="px-5 py-3 font-medium text-center">
                  Birth Date
                </TableCell>

                <TableCell isHeader className="px-5 py-3 font-medium text-center">
                  Age
                </TableCell>

                <TableCell isHeader className="px-5 py-3 font-medium text-center">
                  Action
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 text-gray-500 text-sm">
              {loading ? (
                <TableRow>
                  <TableCell className="px-4 py-8 text-center" colSpan={6}>
                    <div className="flex justify-center">
                      <Spinner size="md" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell className="px-4 py-8 text-center" colSpan={6}>
                    No users found.
                  </TableCell>
                </TableRow>
              ) : users.map((user, index) => (
                <TableRow className="hover:bg-gray-100" key={index}>
                  <TableCell className="px-4 py-3 text-center">
                    {user.id}
                  </TableCell>

                  <TableCell className="px-4 py-3 text-left">
                    {getFullName(user)}
                  </TableCell>

                  <TableCell className="px-4 py-3 text-center">
                    {user.gender_name || "-"}
                  </TableCell>

                  <TableCell className="px-4 py-3 text-center">
                    {formatBirthDate(user.birth_date)}
                  </TableCell>

                  <TableCell className="px-4 py-3 text-center">
                    {getAge(user.birth_date)}
                  </TableCell>

                  <TableCell className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-4">
                      <button
                        type="button"
                        className="text-green-600 font-medium cursor-pointer hover:underline"
                        onClick={() => onEditUser(user.id)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="text-red-600 font-medium cursor-pointer hover:underline"
                        onClick={() => onDeleteUser(user.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>

          </Table>
        </div>
      </div>
      {users.length > 0 && loadingMore && (
        <div className="flex justify-center p-4 border-t border-gray-100 bg-white">
          <Spinner size="sm" />
        </div>
      )}
    </>
  )
}

export default Userlist