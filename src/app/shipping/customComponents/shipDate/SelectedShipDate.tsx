import React from "react"

function SelectedShipDate(props: any) {
    const { shipDate } = props
    const formmattedShipDate = shipDate.toLocaleDateString('en-us', { weekday:"short", month:"short", day:"numeric"})
    return(
        <div className="ship-date-container">
            {/* <div className="summary-icon-container">
                <img className="summary-icon" src="https://res.cloudinary.com/garrett-brands/image/upload/v1645542024/Garrett-Website/2022/2-February/Promo%20Details/icon-shipping.png"></img>
            </div> */}
            <p>Ships</p>
            <p>{formmattedShipDate}</p>
        </div>
    )
}

export default SelectedShipDate