import React from "react"

function SelectedShipDate(props: any) {
    const { shipDate } = props
    const formmattedShipDate = shipDate.toLocaleDateString('en-us', { weekday:"short", month:"short", day:"numeric"})
    return(
        <div className="ship-date-container">
            <p>Ships</p>
            <p>{formmattedShipDate}</p>
        </div>
    )
}

export default SelectedShipDate