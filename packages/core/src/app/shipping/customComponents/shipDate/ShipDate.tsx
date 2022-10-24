import React, { useEffect, useState } from "react";
import { Legend, Fieldset } from "../../../ui/form";
import ShippingCalendar from "./ShippingCalendar";
import DatePicker from 'react-datepicker'
import ShippingInfo from "./ShippingInfo";
import DatesSummary from "./DatesSummary";
import SelectedShipDate from "./SelectedShipDate";
import ArrivalDate from "./ArrivalDate";
import ShippingBanner from "./ShippingBanner";
import ShippingInfoBanner from "./ShippingInfoBanner";

const ShipDate = (props: any) => {
    
    const {
        cart,
        isMultiShippingMode,
        consignments, 
        shipDate, 
        setShipDate, 
        arrivalDate, 
        setArrivalDate,
        isActiveCart,
        setUnavailableItems,
        itemsUnavailableToShip,
        setItemsUnavailableToShip,
    } = props

    const today = new Date()
    const todayReset = today.setHours(0,0,0,0)
    const advanceShippingMessage = "Ordering to enjoy at a later date? Schedule your shipping date up to 25 days in advance. Available on select items."
    const shipDateMessage = 'Cook and ship date is when your order is cooked, it leaves our kitchen on the same day.'
    const arrivalDateMessage = 'Estimated arrival date depends on the ship date and UPS shipping method chosen.'
    const customFields = consignments[0]?.shippingAddress.customFields.length > 0
    
    const [address, setAddress] = useState(Object)
    const [selectedShippingOption, setSelectedShippingOption] = useState(Object)
    const [availableDates, setAvailableDates] = useState(new Array)
    const [blackoutDates, setBlackoutDates] = useState(new Array)
    const [promotionalItems, setPromotionalItems] = useState(new Array)
    const [nextAvailableDate, setNextAvailableDate] = useState(today)
    const [inventoryData, setInventoryData] = useState(new Array)

    useEffect(() => {
        fetchBlackoutDates()
        fetchShipByDates()
        fetchInventoryData()
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
        if (Object.keys(address).length > 0 && selectedShippingOption && !isMultiShippingMode) {
            fetchUPSEstimate()
        }
    }, [shipDate, address, selectedShippingOption])

    useEffect(() => {
        var itemsUnavailableToShip = new Array
        if (promotionalItems.length > 0) {
            promotionalItems.map(item => {
                if (endsAfterShipDate(shipDate, item)) {
                    itemsUnavailableToShip.push(item)
                }
            })
            setItemsUnavailableToShip(itemsUnavailableToShip)
        }
    }, [shipDate, promotionalItems])

    useEffect(() => {
        window.scroll(0, 0)
        const calendarDays: NodeListOf<HTMLDivElement> | null = document.querySelectorAll('.react-datepicker__day')
        if (calendarDays instanceof NodeList) {
            calendarDays.forEach(day => day.removeAttribute('tabIndex'))
        }
    }, [])

    useEffect(() => {
        var unavailableItems = new Array
        inventoryData.map(item => {
            if (item.quantity > item.qty_available || item.status === 'OOS') {
                unavailableItems.push(item)
            }
        })
        if (unavailableItems.length > 0) {
            setUnavailableItems(unavailableItems)
        }
    }, [inventoryData.length > 0])

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

    const endsAfterShipDate = (date: Date, item: { mustShipDate: String }) => {
        var isAfter = false
            const shipByDate = item.mustShipDate
            const [day, month, year] = shipByDate.split('-')
            const formattedDate = new Date([month, day, year].join('/'))
            if (date.getTime() > formattedDate.getTime()) {
                isAfter = true
            }
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

    const fetchBlackoutDates = () => {

        const year = today.getFullYear()
        const month = String(today.getMonth() + 1).padStart(2, '0')
        const date = String(today.getDate()).padStart(2, '0')
        const formattedDate = [date, month, year].join('-')

        fetch(`https://api.gbdev.cloud/v1/ship-dates/blackout-dates?afterDate=${formattedDate}`, {
            method: 'GET',
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
              "x-access-key": "XM9xCpdv7TC1ZrzZ3ZeNYKUoCK1GHbZw"
            }
        })
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

    const fetchShipByDates = () => {

        // PRODUCTION
        // fetch(`https://api.gbdev.cloud/v1/ship-dates/must-ship-dates/`, reqObj)
        fetch(`https://api-dev.gbdev.cloud/v1/ship-dates/must-ship-dates/`, {
            method: 'GET',
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
              "x-access-key": "XM9xCpdv7TC1ZrzZ3ZeNYKUoCK1GHbZw"
            }
        })
        .then(resp => resp.json())
        .then(({results}) => {
            console.log('SHIP DATES RESULTS =>', results)
            var productIds = new Array
            var productSKUs = new Array
            var promotionalItems = new Array
            cart.lineItems.physicalItems.map((item: { productId: Number, sku: String }) => {
                productIds.push(item.productId.toString())
                productSKUs.push(item.sku)
            })
            results.map((item: { productSKU: String, productName: String, mustShipDate: String }) => {
                if (productIds.includes(item.productSKU) || productSKUs.includes(item.productSKU)) {
                    promotionalItems.push(item)
                }
            } )
            setPromotionalItems(promotionalItems)
        })
        .catch(error => {
            console.log('SHIP BY DATES ERROR =>', error)
        })
    }

    const fetchInventoryData = () => {
        var skus = new Array
        cart.lineItems.physicalItems.map((item: {sku: String, quantity: String, name: String, options: Object}) => {
            skus.push({
                'sku': item.sku, 
                'quantity': item.quantity,
                'name': item.name,
                'options': item.options
            })
        })

        var body = {
            "inventoryList": skus
        }

        const reqObj = {
            method: 'POST',
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
              "x-access-key": "XM9xCpdv7TC1ZrzZ3ZeNYKUoCK1GHbZw"
            },
            body: JSON.stringify(body)
          }

        fetch(`https://api.gbdev.cloud/v1/client/inventory/check-quantities`, reqObj)
        .then(resp => resp.json())
        .then(({data}) => {
            data.map((item: {qty_available: Number, status: String, variant_sku: string}) => {
                skus.find(sku => {
                    if (sku.sku === item.variant_sku) {
                        sku.qty_available = item.qty_available
                        sku.status = item.status
                    }
                })
            })
            setInventoryData(skus)
        })
        .catch(error => {
            console.log('INVENTORY REQUEST ERROR =>', error)
        })
    }
    
    const renderUnavailableToShipMessage = (type: string) => {
        var products = new Array
        itemsUnavailableToShip.map((item: { productName: string, mustShipDate: any }) => {
            const shipByDate = item.mustShipDate
            const [day, month, year] = shipByDate.split('-')
            const formattedShipDate = new Date([month, day, year].join('/')).toLocaleDateString('en-us', { weekday:"short", month:"short", day:"numeric"})
            var productDetails = { message: `${item.productName} must ship by ${formattedShipDate}` }
            products.push(productDetails)
        })
        var message = [`Selected Cook and Ship date (${shipDate.toLocaleDateString('en-us', { weekday:"short", month:"short", day:"numeric"})}) is not available for ${products.length} ${products.length > 1 ? 'promotional or seasonal items in your cart.': 'promotional or seasonal item in your cart.' } Please select an earlier date or choose a different item.`]
        return type === 'main'
        ? message
        : products
    }

    const highlightDates = () => {
        if (!isMultiShippingMode) {
            return [arrivalDate]
        }
        else {
            return []
        }
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
                            highlightDates={highlightDates()}
                            inline 
                        />
                </ShippingCalendar>
                    { itemsUnavailableToShip.length > 0 &&
                        <ShippingBanner
                            className='unavailable-date-alert-banner'
                            mainMessage={renderUnavailableToShipMessage('main')}
                            listItems={renderUnavailableToShipMessage('second')}/>
                    }
            { itemsUnavailableToShip.length === 0 &&
                <ShippingInfo>
                    <DatesSummary>
                        <SelectedShipDate shipDate={shipDate} />
                        { !isMultiShippingMode && <ArrivalDate arrivalDate={arrivalDate} /> }
                    </DatesSummary>
                        <ShippingInfoBanner
                            mainMessage={shipDateMessage}
                            secondMessage={arrivalDateMessage}
                        />
                </ShippingInfo>
            }
        </Fieldset>
    )
}

export default ShipDate