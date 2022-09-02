import React from "react";

function ShippingInfo(props: any) {
    return(
        <div className="shipping-info-container">{props.children}</div>
    )
}

export default ShippingInfo