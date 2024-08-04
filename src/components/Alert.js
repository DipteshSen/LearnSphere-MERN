import React from 'react';

const Alert = (props) => {
    const getBoxShadow = (type) => {
        switch (type) {
            case 'success':
                return '0 0 10px rgba(40, 167, 69, 0.5), 0 0 20px rgba(40, 167, 69, 0.4), 0 0 30px rgba(40, 167, 69, 0.3)';
            case 'danger':
                return '0 0 10px rgba(220, 53, 69, 0.5), 0 0 20px rgba(220, 53, 69, 0.4), 0 0 30px rgba(220, 53, 69, 0.3)';
            case 'warning':
                return '0 0 10px rgba(255, 193, 7, 0.5), 0 0 20px rgba(255, 193, 7, 0.4), 0 0 30px rgba(255, 193, 7, 0.3)';
            case 'info':
                return '0 0 10px rgba(23, 162, 184, 0.5), 0 0 20px rgba(23, 162, 184, 0.4), 0 0 30px rgba(23, 162, 184, 0.3)';
            default:
                return '0 0 10px rgba(0, 0, 0, 0.1), 0 0 20px rgba(0, 0, 0, 0.1), 0 0 30px rgba(0, 0, 0, 0.1)';
        }
    };

    const getAnimation = (type) => {
        switch (type) {
            case 'success':
                return 'glow-success 1.5s infinite';
            case 'danger':
                return 'glow-danger 1.5s infinite';
            case 'warning':
                return 'glow-warning 1.5s infinite';
            case 'info':
                return 'glow-info 1.5s infinite';
            default:
                return 'glow-default 1.5s infinite';
        }
    };

    return (
        <center>
            <div className='container-fluid' style={{ height: "10px", position: "fixed", zIndex: 999 }}>
                {props.alert && (
                    <div
                        className={`alert alert-${props.alert.type}`}
                        style={{
                            borderWidth: "3px",
                            boxShadow: getBoxShadow(props.alert.type),
                            animation: getAnimation(props.alert.type),
                        }}
                        role="alert"
                    >
                        <h5>{props.alert.message}</h5>
                    </div>
                )}
            </div>
        </center>
    );
}

export default Alert;
