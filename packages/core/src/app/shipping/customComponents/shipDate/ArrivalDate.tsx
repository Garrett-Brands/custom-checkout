import React from "react";
import IconContainer from "../IconContainer";
import ArrivalDateIcon from "../CustomIcon";

function ArrivalDate(props: any) {
    const { arrivalDate } = props
    const formattedArrivalDate = arrivalDate.toLocaleDateString('en-us', { weekday:"short", month:"short", day:"numeric"})
    return(
        <div className="arrival-date-container">
            <IconContainer className='arrival-date-icon-container'>
                <ArrivalDateIcon imageSource='https://res.cloudinary.com/garrett-brands/image/upload/v1645542024/Garrett-Website/2022/2-February/Promo%20Details/icon-shipping.png' />
            </IconContainer>
            <p>Arrives</p>
            <p>{formattedArrivalDate}</p>
        </div>
    )
}

export default ArrivalDate