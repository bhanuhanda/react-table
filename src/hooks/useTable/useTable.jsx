import { useEffect, useState, useMemo } from "react";

const useTable = ({ columns, data, pagination }) => {
    const { pageSize } = pagination;
    const totalPages = Math.ceil(data.length/pageSize);

    const [currentPageIndex, setCurrentPageIndex] = useState(0);

    const headers = useMemo(() => (
        columns.map(column => ({
            label: column.label,
        }))
    ), [columns]);

    useEffect(() => {
        if (currentPageIndex > totalPages-1) setCurrentPageIndex(totalPages-1);
        if(currentPageIndex < 0 && totalPages !== 0) setCurrentPageIndex(0);
    }, [currentPageIndex, totalPages]);

    const slicedRows = useMemo(() => (
        data.slice(pageSize*currentPageIndex, pageSize*(currentPageIndex+1))
    ), [data, currentPageIndex, pageSize]);

    const rows = useMemo(() => (
        slicedRows.map(dataRow => {
            const cells = columns.map(({ accessor }) => {
                const renderedValue = typeof(accessor) === 'function' ? accessor(dataRow) : dataRow[accessor];
                return { renderedValue };
            })
            return { cells };
        })
    ), [slicedRows, columns]);

    const nextPage = () => {
        if(currentPageIndex < totalPages-1) setCurrentPageIndex(currentPageIndex => currentPageIndex+1);
    }
    const previousPage = () => {
        if(currentPageIndex > 0) setCurrentPageIndex(currentPageIndex => currentPageIndex-1);
    }

    const paginationInfo = {
        pageNumber: currentPageIndex+1,
        totalPages,
        nextPage,
        previousPage,
    }
    return { headers, rows, paginationInfo }
}

export default useTable;
