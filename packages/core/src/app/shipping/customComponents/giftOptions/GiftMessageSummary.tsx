import React from "react";
import IconContainer from "../IconContainer";
import GiftMessageIcon from "../CustomIcon";

const GiftMessageSummary = (props: any) => {
    const { giftMessage } = props
    // const [showGiftMessagePreview, setShowGiftMessagePreview] = useState(Boolean)
    
    const imageSource = () => {
        return giftMessage.length > 0
        ? 'https://res.cloudinary.com/garrett-brands/image/upload/v1663968753/Garrett-Website/2022/9-September/Checkout%20Icons/gift-yass.svg'
        : 'https://res.cloudinary.com/garrett-brands/image/upload/v1663968753/Garrett-Website/2022/9-September/Checkout%20Icons/gift-nope.svg'
    }

    return(
        <div className="gift-message-summary-container"> 
            {/* onMouseEnter={() => setShowGiftMessagePreview(true)}  */}
            {/* onMouseLeave={() => setShowGiftMessagePreview(false)}> */}
                <IconContainer className='gift-message-icon-container'>
                    <GiftMessageIcon imageSource={imageSource()} />
                </IconContainer>
            { giftMessage.length > 0 ? <p>Gift Message Included</p> : <p>No Gift Message Included</p> }
            {/* { showGiftMessagePreview && <p>{ giftMessage }</p> } */}
        </div>
    )
}

export default GiftMessageSummary