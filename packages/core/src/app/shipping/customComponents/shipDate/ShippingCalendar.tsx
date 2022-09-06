import React from "react"

function ShippingCalendar(props: any) {
    const className = () => {
        return props.disabled
        ? 'shipping-calendar-container-disabled'
        : 'shipping-calendar-container'
    }
    return(
        <div className={className()}>{props.children}</div>
    )
}

export default ShippingCalendar