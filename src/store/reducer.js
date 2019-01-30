import * as actionTypes from './actionTypes';

const initialState = {
    rowData: null
}

const reducer = (prevState = initialState, action) => {
    switch (action.type) {
        case actionTypes.SAVE_EDIT:
            return saveEdit(prevState, action);
        case actionTypes.INIT_ROW_DATA:
            return {
                ...prevState,
                rowData: action.rowData
            };
        default: return prevState;
    }
}

function saveEdit(prevState, action) {
    const { id, data } = action.payload;

    // clone the edit data array from state
    const dataArr = prevState.rowData.slice(0);

    // get index of row we are editing
    const index = dataArr.findIndex(el => {
        return el.id === id;
    });
    
    // replace row values with edited values, excluding ID
    Object.keys(dataArr[index]).forEach(k => {
        if(k !== 'id') {
            dataArr[index][k] = data[k];
        }
    });

    console.log('Edited rowData index: ', index, ' updated');

    return {
        rowData: dataArr
    };
}

export default reducer;