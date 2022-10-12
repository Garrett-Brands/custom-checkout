import React from "react";
import CustomIcon from "../CustomIcon";
import IconContainer from "../IconContainer";

const ShippingBanner = (props: any) => {
    const { mainMessage, mainMessageIcon, secondMessage, secondMessageIcon, className } = props

    const renderIcon = (source: String) => {
        return(
            <IconContainer className='banner-icon-container'>
                <CustomIcon imageSource={source} />
            </IconContainer>
        )
    }

    const IconsContainer =  () => {
        return (
            <div className="banner-icons-container">
                { mainMessageIcon && renderIcon(mainMessageIcon) }
                { secondMessageIcon && renderIcon(secondMessageIcon) }
            </div>
        )
    }

    const MessageContainer = () => {
        return (
            <div className="banner-message-container">
                { mainMessage && <p className="banner-main-message">{ mainMessage }</p> }
                { secondMessage && <p className="banner-second-message">{ secondMessage }</p> }
            </div>
        )
    }

    return(
        <div className={className}>
            { mainMessageIcon && <IconsContainer /> }
            { mainMessage && <MessageContainer /> }
        </div>
    )
}

export default ShippingBanner