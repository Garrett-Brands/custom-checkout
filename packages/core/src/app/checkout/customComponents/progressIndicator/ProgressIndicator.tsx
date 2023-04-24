import React from "react";

const ProgressIndicator = (props: any) => {
    const { steps } = props
    console.log(steps)
    return (
        <ul className="progress-indicator-container">
            <li>Contact</li>
            <li>Shipping</li>
            <li>Billing</li>
            <li>Payment</li>
        </ul>
    )
}

export default ProgressIndicator;