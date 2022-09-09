import React from "react";

const IconContainer = (props: any) => {
    const { children, className } = props
    return(
        <div className={className}>{children}</div>
    )
}

export default IconContainer