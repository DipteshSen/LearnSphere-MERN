import React from 'react'

const Alert = (props) => {
    return (
        <div className='container' style={{height:"10px",zIndex:"999"}}>
            {props.alert && <div className={`alert alert-${props.alert.type}`} style={{borderWidth:"3px"}} role="alert">
                <h5>{props.alert.message}</h5>
            </div>}
        </div>
    )
}

export default Alert
