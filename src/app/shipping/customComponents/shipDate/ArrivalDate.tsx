import React from "react";

function ArrivalDate(props: any) {
    const { arrivalDate } = props
    const formattedArrivalDate = arrivalDate.toLocaleDateString('en-us', { weekday:"short", month:"short", day:"numeric"})
    return(
        <div className="arrival-date-container">
            <p>Arrives</p>
            <p>{formattedArrivalDate}</p>
        </div>
    )
}

export default ArrivalDate