import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useCallback } from "react";
import { Card, CardContent, CardHeader } from "./ui/card";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

type PaymentFormPropsType = {
  priceId: string | undefined;
  quantity: number;
  couponCode: string | undefined;
  invalidForms: string[];
};

const PaymentForm = ({
  priceId,
  quantity,
  couponCode,
  invalidForms,
}: PaymentFormPropsType) => {
  const fetchClientSecret = useCallback(() => {
    // Create a Checkout Session
    if (!priceId || invalidForms.length) return Promise.resolve("");
    const couponCodeUri = couponCode ? `&couponCode=${couponCode}` : "";
    return fetch(
      `/api/stripe?price_id=${priceId}&quantity=${quantity}${couponCodeUri}`,
      {
        method: "POST",
      }
    )
      .catch((err) => {
        console.error(err);
        return Promise.reject(err);
      })
      .then((res) => res.json())
      .then((data) => data.clientSecret);
  }, [couponCode, invalidForms.length, priceId, quantity]);

  if (!priceId) {
    return <div>Price ID not found</div>;
  }

  if (invalidForms.length) {
    return (
      <Card>
        <CardHeader>Submit your payment here.</CardHeader>
        <CardContent>
          <div>
            <p>
              There are some invalid forms. Please fix them before proceeding.
            </p>
            <br />
            <ul>
              {invalidForms.map((form) => (
                <li key={form}>{form}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isBeforeMay31st = new Date().getMonth() < 5;

  return (
    <Card>
      <CardHeader>
        <p>
          Submit your payment here. If your forms are complete but the payment
          information doesn&apos;t load, please try reloading the page.
        </p>
        <p>Please note there is a 2.9% fee added for payment processing.</p>
        {isBeforeMay31st && (
          <p>
            Use&nbsp;
            <code className="font-bold">EARLYBIRD10</code> for 10% off before
            May 31st! (Note: if you have selected the sibling discount, this is
            already applied)
          </p>
        )}
      </CardHeader>
      <CardContent>
        <div id="checkout">
          <EmbeddedCheckoutProvider
            stripe={stripePromise}
            options={{ fetchClientSecret }}
          >
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentForm;
