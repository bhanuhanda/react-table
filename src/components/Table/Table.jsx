import './Table.css';
import { useState } from 'react';
import mockData from './mocks';
import useTable from '../../hooks/useTable';
import { format, parse } from 'date-fns';
import { FiArrowLeftCircle, FiArrowRightCircle, FiTrash, FiUserPlus } from "react-icons/fi";

const pageSizeOptions = [
    {
        value: 3,
        label: 3
    },
    {
        value: 4,
        label: 4
    },
    {
        value: 5,
        label: 5
    },
]

const Table = () => {
    const [tableData, setTableData] = useState(mockData);
    const [pageSize, setPageSize] = useState(pageSizeOptions[0]);

    const handleUserDeletion = (id) => {
        setTableData(tableData => tableData.filter(dataRow => dataRow.id !== id));
    };

    const handleUserInsertion = () => {
        const newUser = {
            id: tableData[tableData.length-1].id + 1,
            name: 'Dummy User',
            dateOfBirth: format(new Date(), 'dd-MM-yyyy'),
            hobby: 'lorem ipsum'
        }
        setTableData([
            ...tableData,
            newUser
        ]);
    };

    const handlePageSizeChange = (e) => {
        setPageSize(pageSizeOptions.find(option => option.value === parseInt(e.target.value)));
    }

    const COLUMNS = [
        {
            label: 'ID',
            accessor: 'id',
        },
        {
            label: 'Name',
            accessor: 'name',
        },
        {
            label: 'Date Of Birth',
            accessor: ({ dateOfBirth }) => format(parse(dateOfBirth, 'dd-MM-yyyy', new Date()), 'dd-MMM-yyyy'),
        },
        {
            label: 'Hobby',
            accessor: 'hobby',
        },
        {
            label: 'Actions',
            accessor: ({ id }) => <button className='delete-button' onClick={() => handleUserDeletion(id)}><FiTrash color='red' size='1.5rem' /></button>,
        }
    ]

    const { 
        headers, 
        rows, 
        paginationInfo : { pageNumber, totalPages, nextPage, previousPage } 
    } = useTable({ 
        columns: COLUMNS, 
        data: tableData, 
        pagination: { pageSize: pageSize.value }
    });
    
    return (
        <div className='main-container'>
            <h1>React Table</h1>
            <div className='options-container'>
                <span>
                    <p>Records per page:</p>
                    <select name="pageSize" id="pageSize" onChange={handlePageSizeChange}>
                        {pageSizeOptions.map(({ value, label }, idx) => (
                            <option key={idx} value={value}>{label}</option>
                        ))}
                    </select>
                </span>
                <button onClick={handleUserInsertion}>Add User</button>
            </div>
            <table className='table-container'>
            <thead>
                <tr>
                    {headers.map(({ label }, idx) => (
                        <th key={idx}>{label}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {rows.map((row, idx) => (
                    <tr key={idx}>
                        {row.cells.map((cell, idx) => (
                            <td key={idx}>{cell.renderedValue}</td>
                        ))}
                    </tr>
                ))}
                </tbody> 
            </table>
            <div className="pagination-container">
                <button onClick={previousPage}><FiArrowLeftCircle color={pageNumber === 1 ? '#aaa' : '#000'} /></button>
                <p>Page <span className='current-page-number'>{pageNumber}</span> of {totalPages}</p>
                <button onClick={nextPage}><FiArrowRightCircle color={pageNumber === totalPages ? '#aaa' : '#000'} /></button>
            </div>
        </div>
    )
}

export default Table;
