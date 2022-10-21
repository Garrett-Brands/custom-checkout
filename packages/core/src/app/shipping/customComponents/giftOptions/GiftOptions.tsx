import React from "react";

const GiftOptions = (props: any) => {
    const { className } = props
    return(
        <div className={className}>
            {props.children}
        </div>
    )
}

export default GiftOptions