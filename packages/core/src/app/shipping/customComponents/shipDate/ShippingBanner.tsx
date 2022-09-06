import React from "react";

const ShippingBanner = (props: any) => {
    const { bannerMessage } = props
    return(
        <p className="shipping-banner">{bannerMessage}</p>
    )
}

export default ShippingBanner