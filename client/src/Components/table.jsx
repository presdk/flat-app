import React from 'react';
import { 
    TableContainer, 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableRow, 
    TableSortLabel
} from '@material-ui/core';

class AppTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            orderBy: this.props.defaultOrderBy,
            order: this.props.defaultOrder
        }
    }

    createSortHandler = (property) => (event) => {
        this.sorterMethod = this.props.requestDescSort(event, property);
        if (property !== this.state.orderBy) {
            this.setState({ orderBy: property, order: 'desc' })
        } else {
            this.setState({ order: (this.state.order === 'asc') ? 'desc' : 'asc' })
        }
    }

    columnNames = () => {
        return this.props.columns.map(column => {
            return (
                <TableCell  
                    key={column.key}
                    align={column.align}
                    sortDirection={this.state.orderBy === column.key ? this.state.order : false}
                >
                    {this.props.sorter ? 
                        <TableSortLabel
                            active={this.state.orderBy === column.key}
                            direction={this.state.orderBy === column.key ? this.state.order : 'desc'}
                            onClick={this.createSortHandler(column.key)}
                        >
                            {column.name}
                        </TableSortLabel>
                        : column.name
                    }
                </TableCell>
            )
        })
    }

    ascSorter = (a, b) => {
        return -this.sorterMethod(a, b)
    }

    tableData = () => {
        if (this.props.data) {
            const cpData = [...this.props.data]
            if (this.sorterMethod) {
                (this.state.order === 'desc') ? cpData.sort(this.sorterMethod) : cpData.sort(this.ascSorter)
            }
            return cpData.map(entry => {
                return (
                    <TableRow key={entry._id}>
                        {this.props.columns.map(cell => {
                            return (
                                <TableCell
                                    key={cell.key}
                                    align={cell.align}
                                >
                                    {(entry[cell.key] !== null) ? (cell.render ? cell.render(entry[cell.key], entry) : entry[cell.key]) : null}
                                </TableCell>
                            )
                        })}
                    </TableRow>
                )
            })
        }
    }

    render() {
        return (
            <TableContainer>
                <Table stickyHeader size='small'>
                    <TableHead>
                        <TableRow>
                            {this.columnNames()}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.tableData()}
                    </TableBody>
                </Table>
            </TableContainer>
        )
    }
}

export default AppTable