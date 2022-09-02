import React from "react";
import SelectedShipDate from "../../shipping/customComponents/shipDate/SelectedShipDate";

const ShippingSummary = (props: any) => {
    const { shipDate } = props
    // const formattedShipDate = shipDate.toLocaleDateString('en-us', { weekday:"short", month:"short", day:"numeric"})

    const renderShipDate = () => {
        if (shipDate.getYear() !== 69) {
            return <SelectedShipDate shipDate={ shipDate } />
        }
    }

    return(
        <div className="shipping-summary-container">
            {renderShipDate()}
        </div>
    )
}

export default ShippingSummary