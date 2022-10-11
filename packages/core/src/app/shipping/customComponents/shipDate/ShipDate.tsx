import React, { useEffect, useState } from "react";
import { Legend, Fieldset } from "../../../ui/form";
import ShippingCalendar from "./ShippingCalendar";
import DatePicker from 'react-datepicker'
import ShippingInfo from "./ShippingInfo";
import DatesSummary from "./DatesSummary";
import SelectedShipDate from "./SelectedShipDate";
import ArrivalDate from "./ArrivalDate";
import ShippingBanner from "./ShippingBanner";

const ShipDate = (props: any) => {
    
    const {
        cart,
        consignments, 
        shipDate, 
        setShipDate, 
        arrivalDate, 
        setArrivalDate,
        isActiveCart,
        dateUnavailable,
        setDateUnvailable
    } = props

    const today = new Date()
    const todayReset = today.setHours(0,0,0,0)
    const advanceShippingMessage = "Ordering to enjoy at a later date? Schedule your shipping date up to 25 days in advance. Available on select items."
    const shipDateMessage = 'Cook and ship date is when your order is cooked, it leaves our kitchen on the same day.'
    const arrivalDateMessage = 'Estimated arrival date depends on the ship date and UPS shipping method chosen.'
    const unavailableDateMessage = 'You have a promotional item in your cart. The promo period ends before your selected cook and ship date. Please select a date within the promo period or remove the item from your cart.'
    const customFields = consignments[0]?.shippingAddress.customFields.length > 0
    
    const [address, setAddress] = useState(Object)
    const [selectedShippingOption, setSelectedShippingOption] = useState(Object)
    const [availableDates, setAvailableDates] = useState(new Array)
    const [blackoutDates, setBlackoutDates] = useState(new Array)
    const [shipByDates, setShipByDates] = useState(new Array)
    const [nextAvailableDate, setNextAvailableDate] = useState(today)

    useEffect(() => {
        fetchBlackoutDates()
        fetchShipByDates()
    }, [])

    useEffect(() => {
        setAvailableDates(getAvailableDates(today, maxDate()))
    }, [blackoutDates])

    useEffect(() => {
        if (availableDates.length > 0) {
            setNextAvailableDate(availableDates[0])
        }
    }, [availableDates])
    
    useEffect(() => {
        const currentShipDate = shipDate
        var savedShipDate
        if (customFields && isActiveCart) {
            savedShipDate = consignments[0].shippingAddress.customFields.find((customField: { fieldId: string; }) => customField.fieldId === 'field_30')
            savedShipDate = new Date(savedShipDate.fieldValue)
        }
        savedShipDate && isAfterNextAvailable(savedShipDate) && filterDates(savedShipDate) 
        ? setShipDate(savedShipDate)
        : ( currentShipDate.getYear() !== 69 && filterDates(currentShipDate)
        ? setShipDate(currentShipDate)
        : setShipDate(nextAvailableDate) )
    }, [nextAvailableDate])

    useEffect(() => {
        if (props.consignments[0]) {
            const { address, selectedShippingOption } = props.consignments[0]
            setAddress(address)
            setSelectedShippingOption(selectedShippingOption)
        }
    }, [props])

    useEffect(() => {
        if (Object.keys(address).length > 0 && selectedShippingOption) {
            fetchUPSEstimate()
        }
    }, [shipDate, address, selectedShippingOption])

    useEffect(() => {
        if (shipByDates) {
            setDateUnvailable(isAfterShipByDates(shipDate))
        }
    }, [shipDate, shipByDates])

    useEffect(() => {
        window.scroll(0, 0)
        const calendarDays: NodeListOf<HTMLDivElement> | null = document.querySelectorAll('.react-datepicker__day')
        if (calendarDays instanceof NodeList) {
            calendarDays.forEach(day => day.removeAttribute('tabIndex'))
        }
    }, [])

    const getAvailableDates = (start: Date, end: Date) => {
        var dates = new Array
        var date = new Date(start);
        while (date <= end) {
            if (filterDates(date)) {
                dates.push(new Date(date))
            }
            date.setDate(date.getDate() + 1)
        }
        return dates
    }

    const filterDates = (date: Date) => {
        return !isToday(date) && isWeekday(date) && !isBlackoutDate(date)
    }

    const isAfterNextAvailable = (date: Date) => {
        return date.getTime() > nextAvailableDate.getTime()
    }

    const isToday = (date: Date) => {
        return date.getTime() === today.getTime()
    }

    const isWeekday = (date: Date) => {
        const day = date.getDay()
        return day !== 0 && day !== 6;
    }

    const isBlackoutDate = (date: Date) => {
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        const formattedDate = [year, month, day].join('-')
        return blackoutDates.includes(formattedDate)
    }

    const isAfterShipByDates = (date: Date) => {
        var isAfter = false
        shipByDates.map(shipByDate => {
            const [year, month, day] = shipByDate.split('-')
            const formattedDate = new Date([month, day, year].join('-'))
            if (date.getTime() > formattedDate.getTime()) {
                isAfter = true
            }
        })
        return isAfter
    }

    const maxDate = () => {
        const maxDate = new Date(todayReset)
        maxDate.setDate(maxDate.getDate() + 25)
        return maxDate
    }

    const fetchUPSEstimate = () => {

        const year = shipDate.getFullYear()
        const month = String(shipDate.getMonth() + 1).padStart(2, '0')
        const date = String(shipDate.getDate()).padStart(2, '0')
        const formattedDate = [year, month, date].join('')

        var body = {
            "to": {
                "city": address.city,
                "state": address.stateOrProvince,
                "postal_code": address.postalCode,
                "country": address.country
            },
            "pickup_date": formattedDate,
            "shipping_method": selectedShippingOption.description
        }
        
        var reqObj = {
            method: 'POST',
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
              "x-access-key": "XM9xCpdv7TC1ZrzZ3ZeNYKUoCK1GHbZw"
            },
            body: JSON.stringify(body)
          }

        fetch(`https://api.gbdev.cloud/v1/shipping/expected-date`, reqObj)
        .then(resp => resp.json())
        .then(estimate => {
            const estimatedArrival = new Date(estimate.data.EstimatedArrival.Date.replaceAll('-', '/'))
            setArrivalDate(estimatedArrival)
        })
        .catch(error => {
            console.log('UPS ESTIMATED ARRIVAL ERROR =>', error)
        })

    }

    const fetchBlackoutDates = async () => {

        const year = today.getFullYear()
        const month = String(today.getMonth() + 1).padStart(2, '0')
        const date = String(today.getDate()).padStart(2, '0')
        const formattedDate = [date, month, year].join('-')

        const reqObj = {
            method: 'GET',
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
              "x-access-key": "XM9xCpdv7TC1ZrzZ3ZeNYKUoCK1GHbZw"
            }
          }

        fetch(`https://api.gbdev.cloud/v1/ship-dates/blackout-dates?afterDate=${formattedDate}`, reqObj)
        .then(resp => resp.json())
        .then(({results}) => {
            const dates = results.map((result: any) => result.blackoutDate.split('-'))
            const formattedDates = dates.map((date: string) => [date[2], date[1], date[0]].join('-'))
            setBlackoutDates(formattedDates)
        })
        .catch(error => {
            console.log('BLACKOUT DATES ERROR =>', error)
        })
    }

    const fetchShipByDates = async () => {

        const reqObj = {
            method: 'GET',
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
              "x-access-key": "XM9xCpdv7TC1ZrzZ3ZeNYKUoCK1GHbZw"
            }
          }

        // PRODUCTION
        // fetch(`https://api.gbdev.cloud/v1/ship-dates/must-ship-dates/`, reqObj)
        fetch(`https://api-dev.gbdev.cloud/v1/ship-dates/must-ship-dates/`, reqObj)
        .then(resp => resp.json())
        .then(({results}) => {
            var productIds = new Array
            var productSKUs = new Array
            var dates = new Array
            cart.lineItems.physicalItems.map((item: { productId: Number, sku: String }) => {
                productIds.push(item.productId.toString())
                productSKUs.push(item.sku)
            })
            results.map((item: { productSKU: String, mustShipDate: String }) => {
                const date = item.mustShipDate.split('-')
                const formattedDate = [date[2], date[1], date[0]].join('-')
                if (productIds.includes(item.productSKU) || productSKUs.includes(item.productSKU)) {
                    dates.push(formattedDate)
                }
            } )
            setShipByDates(dates)
        })
        .catch(error => {
            console.log('SHIP BY DATES ERROR =>', error)
        })
    }

    return(
        <Fieldset id='ship-date'>
            <Legend testId="ship-date-form-heading">Cooking and Shipping Date</Legend>
                    <ShippingBanner
                        className='advance-shipping-banner'
                        mainMessage={advanceShippingMessage} 
                    />
                <ShippingCalendar>
                        <DatePicker 
                            calendarClassName="ship-date-calendar"
                            selected={shipDate}
                            onChange={(date:Date) => setShipDate(date)}
                            minDate={today}
                            maxDate={maxDate()}
                            filterDate={filterDates}
                            highlightDates={[arrivalDate]}
                            inline 
                        />
                </ShippingCalendar>
                
                    { dateUnavailable && 
                        <ShippingBanner
                        className='unavailable-date-alert-banner'
                        mainMessage={unavailableDateMessage} />
                    }

            { !dateUnavailable &&
                <ShippingInfo>
                    <DatesSummary>
                        <SelectedShipDate shipDate={shipDate} />
                        <ArrivalDate arrivalDate={arrivalDate} />
                    </DatesSummary>
                        <ShippingBanner
                            className='shipping-info-banner'
                            mainMessage={shipDateMessage}
                            secondMessage={arrivalDateMessage}
                        />
                </ShippingInfo>
            }    
        </Fieldset>
    )
}

export default ShipDate