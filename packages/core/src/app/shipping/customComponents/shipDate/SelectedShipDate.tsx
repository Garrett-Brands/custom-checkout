import React from "react"
import IconContainer from "../IconContainer"
import ShipDateIcon from "../CustomIcon"

function SelectedShipDate(props: any) {
    const { shipDate } = props
    const formmattedShipDate = shipDate.toLocaleDateString('en-us', { weekday:"short", month:"short", day:"numeric"})
    return(
        <div className="ship-date-container">
            <IconContainer className='ship-date-icon-container'>
                <ShipDateIcon imageSource='https://res.cloudinary.com/garrett-brands/image/upload/v1662948798/Garrett-Website/2022/2-February/Promo%20Details/shipping-icon-cropped.png' />
            </IconContainer>
            <p>Ships</p>
            <p>{formmattedShipDate}</p>
        </div>
    )
}

export default SelectedShipDate