import { useCallback, useEffect, useState, type FC } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../../components/Table";
import GenderService from "../../../services/GenderService";
import Spinner from "../../../components/Spinner/Spinner";

interface GenderColumns {
  id: number
  gender: string
}

interface GenderListProps {
  refreshKey: boolean;
}

const GenderList: FC<GenderListProps> = ({ refreshKey }) => {

  const [loadingGender, setLoadingGender] = useState(false)
  const [genders, setGenders] = useState<GenderColumns[]>([]);

  const handleLoadGenders = useCallback(async () => {
    try {
      setLoadingGender(true)

      const res = await GenderService.loadGenders()

      if (res.status === 200) {
        setGenders(res.data.genders)
      } else {
        console.error('Unexpected error status occurred during loading genders:', res.status)
      }
    } catch (error) {
      console.error('Unexpected server error occurred during loading genders:', error)
    } finally {
      setLoadingGender(false)
    }
  }, [])

  useEffect(() => {
    void handleLoadGenders()
  }, [refreshKey, handleLoadGenders])

  return (
    <>
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <div className="max-w-full max-h-[calc(100vh)] overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-200 bg-blue-600 sticky top-0 text-white text-xs">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 font-medium text-center">
                  No.
                </TableCell>

                <TableCell isHeader className="px-5 py-3 font-medium text-center">
                  Gender
                </TableCell>

                <TableCell isHeader className="px-5 py-3 font-medium text-center">
                  Action
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 text-gray-500 text-sm">
              {loadingGender ? (
                <TableRow>
                  <TableCell className="px-4 py-3 text-center" colSpan={3}>
                    <Spinner size="md" />
                  </TableCell>
                </TableRow>
              ) : (
                genders.map((gender, index) => (
                  <TableRow className="hover:bg-gray-100" key={index}>
                    <TableCell className="px-4 py-3 text-center">{index + 1}</TableCell>
                    <TableCell className="px-4 py-3 text-start">{gender.gender}</TableCell>
                    <TableCell className="px-4 py-3 text-center">-</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>

          </Table>
        </div>
      </div>
    </>
  );
};

export default GenderList;