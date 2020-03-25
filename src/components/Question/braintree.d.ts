interface PaymentMethod {
    nonce: string
}
export interface BraintreeDropInInstance {
    requestPaymentMethod(): Promise<PaymentMethod>
}

declare module 'braintree-web-drop-in-react'