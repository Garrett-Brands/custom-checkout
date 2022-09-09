import React from "react";

const CustomIcon = (props: any) => {
    const { imageSource } = props
    return(
        <img src={imageSource}></img>
    )
}

export default CustomIcon