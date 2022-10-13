import React from "react";
import SelectedShipDate from "../../shipping/customComponents/shipDate/SelectedShipDate";
import ArrivalDate from "../../shipping/customComponents/shipDate/ArrivalDate";
import GiftMessageSummary from "../../shipping/customComponents/giftOptions/GiftMessageSummary";

const ShippingSummary = (props: any) => {
    const { shipDate, arrivalDate, giftMessage } = props

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
            <GiftMessageSummary giftMessage={ giftMessage } />
        </div >
    )
}

export default ShippingSummary