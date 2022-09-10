import React from "react";
import SelectedShipDate from "../../shipping/customComponents/shipDate/SelectedShipDate";
import ArrivalDate from "../../shipping/customComponents/shipDate/ArrivalDate";
import GiftMessageSummary from "./GiftMessageSummary";

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

    const renderGiftMessage = () => {
        if (giftMessage.length > 0) {
            return <GiftMessageSummary giftMesage={ giftMessage } />
        }
    }

    return(
        <div className="shipping-summary-container">
            {renderShipDate()}
            {renderArrivalDate()}
            {renderGiftMessage()}
        </div >
    )
}

export default ShippingSummary