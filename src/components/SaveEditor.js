import * as React from 'react';

export default class SaveEditor extends React.Component {
    constructor(props) {
        super(props);

        this.state = this.createInitialState(props);
    }

    createInitialState(props) {
        return {
            value: props.value
        };
    }

    // Instance value approach
    onSave = () => {
        this.props.onSaveEdit(this.props, this.props.node.data.id);
    }

    onCancel = () => {
        this.props.onCancelEdit(this.props);
    }

    handleChange = (event) => {
        this.setState({ value: event.target.value });
    }

    onKeyDown = () => {

    }

    getValue = () => {
        return this.state.value;
    }

    render() {
        return (
            <React.Fragment>
                <div style={{
                    position: 'absolute',
                    left: '0',
                    top: '-25px',
                    zIndex: 999999
                }}>
                    <button onClick={this.onSave}>
                        Save Edits
                    </button>
                    <button onClick={this.onCancel}>
                        Cancel
                    </button>
                </div>
                <input
                    value={this.state.value}
                    onChange={this.handleChange}
                    onKeyDown={this.onKeyDown}
                    style={{ width: '100%', height: '26px' }}
                />
            </React.Fragment>
        );
    }
}