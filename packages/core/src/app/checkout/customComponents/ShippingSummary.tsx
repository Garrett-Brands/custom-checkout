import React from "react";
import SelectedShipDate from "../../shipping/customComponents/shipDate/SelectedShipDate";
import ArrivalDate from "../../shipping/customComponents/shipDate/ArrivalDate";

const ShippingSummary = (props: any) => {
    const { shipDate, arrivalDate } = props

    const renderShipDate = () => {
        if (shipDate.getYear() !== 69) {
            return <SelectedShipDate shipDate={ shipDate } />
        }
    }

    const renderArrivalDate = () => {
        if (arrivalDate.getYear() !== 69) {
            return <ArrivalDate arrivalDate={ arrivalDate } />
        }
    }

    return(
        <div className="shipping-summary-container">
            {renderShipDate()}
            {renderArrivalDate()}
        </div >
    )
}

export default ShippingSummary