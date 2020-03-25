import React, { useState } from 'react';
// @ts-ignore
import DropIn from "braintree-web-drop-in-react"
import { PaymentMethod, BraintreeDropInInstance } from "./braintree"

const BRAINTREE_CONFIG = {
    authorization: process.env.REACT_APP_BRAINTREE_SANDBOX_KEY,
    card: {
        cardholderName: {
            required: true
        }
    }
}

const ReleaseAnswer = () => {
    const INIT_BRAINTREE_INSTANCE: BraintreeDropInInstance = {
        requestPaymentMethod: async () => ({ nonce: '' })
    }

    const [instance, setInstance] = useState(INIT_BRAINTREE_INSTANCE)

    const submitDonation = async () => {
        try {
            const paymentMethod: PaymentMethod = await instance.requestPaymentMethod()
            const { nonce } = paymentMethod
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div>
            <DropIn
                options={BRAINTREE_CONFIG}
                onInstance={(instance: BraintreeDropInInstance) => (setInstance(instance))}
            />
            <button onClick={submitDonation}>Reveal</button>
        </div>
    )
}