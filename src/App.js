import React, { Component } from 'react';
import './App.css';

import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import 'ag-grid-enterprise';

import { connect } from 'react-redux';
import * as actions from './store/actions';
import uuidv4 from 'uuid';

import SaveEditor from './components/SaveEditor';

class App extends Component {

  constructor(props) {
      super(props);
      this.defaultColDef = { 
        width: 150,
        editable: true,
        cellEditorParams: {
          onSaveEdit: this.onSaveEdit.bind(this),
          onCancelEdit: (componentProps) => {
            componentProps.api.stopEditing(true);
          }
        }
      };
      this.frameworkComponents = {
        saveEditor: SaveEditor
      };
      this.editType = 'fullRow';
  }

  onSaveEdit(componentProps, rowId) {
    const instances = componentProps.api.getCellEditorInstances();
    const editData = {};
    instances.forEach(i => {
      if(i.params) {
        // Default ag-Grid Editors
        editData[i.params.column.colDef.field] = i.getValue();
      } else {
        // Custom React Cell Editors
        editData[i.componentInstance.props.column.colDef.field] = i.getValue();
      }
    });
    console.log('EDIT PERFORMED: ', rowId, editData);

    // Cancel the edit data going to grid
    componentProps.api.stopEditing(true);

    // Perform a Redux action with the edited data
    this.props.onRowEdit(rowId, editData);

    // Refresh Grid cells so they pick up new edited data from store
    this.gridApi.refreshCells();
  }

  componentDidMount() {
    console.log('mounting');
    fetch('https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/olympicWinnersSmall.json')
      .then(res => res.json())
      .then(data => {
        data.forEach(d => d.id = uuidv4())
        this.props.onInitRowData(data);
      })
      .catch(error => {
        console.log(error);
      })
  }

  onGridReady = (params) => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  rowEditingStopped(params) {
    console.log('rowEditingStopped: ', params);
  }

  cellValueChanged(params) {
    console.log('cellValueChanged: ', params);
  }

  render() {
    return (
      <div
        className="ag-theme-balham"
        style={{
          height: '90vh',
          // width: '100%'
        }}>
        <AgGridReact
          columnDefs={[
            { field: 'id', hide: true, editable: false },
            { headerName: 'Athlete', field: 'athlete' },
            { field: 'country' },
            { headerName: 'Sport', field: 'sport' },
            { headerName: 'Age', field: 'age' },
            { headerName: 'Year', field: 'year', cellEditor: 'saveEditor' },
            { headerName: 'Date', field: 'date' },
            { headerName: 'Gold', field: 'gold' },
            { headerName: 'Silver', field: 'silver' },
            { headerName: 'Bronze', field: 'bronze' },
            {field: 'total'}
          ]}
          rowData={this.props.rowData}
          defaultColDef={this.defaultColDef}
          onGridReady={this.onGridReady}
          frameworkComponents={this.frameworkComponents}
          deltaRowMode={true}
          // onRowEditingStopped={this.rowEditingStopped}
          // onCellValueChanged={this.cellValueChanged}
          editType={this.editType}
          getRowNodeId={data => data.id}>
        </AgGridReact>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    rowData: state.rowData
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onInitRowData: rowData => dispatch(actions.initRowData(rowData)),
    onRowEdit: (id, data) => dispatch(actions.saveEdit(id, data))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);