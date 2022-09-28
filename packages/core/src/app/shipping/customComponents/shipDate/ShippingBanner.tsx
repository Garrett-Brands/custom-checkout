import React from "react";

const ShippingBanner = (props: any) => {
    const { mainMessage, secondMessage, className } = props
    return(
        <div className={className}>
            { mainMessage ? <p className="banner-main-message">{mainMessage}</p> : null }
            { secondMessage ? <p className="banner-second-message">{secondMessage}</p> : null }
        </div>
    )
}

export default ShippingBanner