import React from "react";

const ShippingSummary = (props: any) => {
    const { shipDate } = props
    const formattedShipDate = shipDate.toLocaleDateString('en-us', { weekday:"short", month:"short", day:"numeric"})
    return(
        <div className="shipping-summary-container">
            <p>Ships</p>
            <p>{formattedShipDate}</p>
        </div>
    )
}

export default ShippingSummary