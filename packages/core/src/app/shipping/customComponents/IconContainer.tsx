import React from "react";

const IconContainer = (props: any) => {
    const { children, className, onClick } = props
    return(
        <div className={className} onClick={onClick}>{children}</div>
    )
}

export default IconContainer