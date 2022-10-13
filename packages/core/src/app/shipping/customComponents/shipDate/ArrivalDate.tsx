import React from "react";
import IconContainer from "../IconContainer";
import ArrivalDateIcon from "../CustomIcon";

function ArrivalDate(props: any) {
    const { arrivalDate } = props
    const formattedArrivalDate = arrivalDate.toLocaleDateString('en-us', { weekday:"short", month:"short", day:"numeric"})
    return(
        <div className="arrival-date-container">
            <IconContainer className='arrival-date-icon-container'>
                <ArrivalDateIcon imageSource='https://res.cloudinary.com/garrett-brands/image/upload/v1663968753/Garrett-Website/2022/9-September/Checkout%20Icons/arrival-estimate.svg' />
            </IconContainer>
            <p>Estimated Arrival</p>
            <p>{formattedArrivalDate}</p>
        </div>
    )
}

export default ArrivalDate