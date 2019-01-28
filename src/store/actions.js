import * as actionTypes from './actionTypes';

export const initRowData = rowData => {
    return {
        type: actionTypes.INIT_ROW_DATA,
        rowData: rowData
    }
}

export const saveEdit = (id, data) => {
    return {
        type: actionTypes.SAVE_EDIT,
        payload: {
            id: id,
            data: data
        }
    }
}