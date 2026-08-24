import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axiosInstance from "../../api/axiosInstance";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

function PaymentForm({ request, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    setError("");

    try {
      const { data } = await axiosInstance.post(
        `/requests/${request._id}/create-payment-intent`
      );

      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        setError(result.error.message);
        setLoading(false);
        return;
      }

      if (result.paymentIntent.status === "succeeded") {
        await axiosInstance.post(`/requests/${request._id}/confirm-payment`);
        onSuccess();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Payment failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="border border-gray-200 rounded-xl px-4 py-3">
        <CardElement
          options={{
            style: {
              base: { fontSize: "16px", color: "#1a1a2e", "::placeholder": { color: "#9ca3af" } },
            },
          }}
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl text-sm">
          ⚠️ {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || loading}
        style={{ backgroundColor: "#151c5c" }}
        className="w-full text-white py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition"
      >
        {loading ? "Processing..." : `Pay $${request.budget} →`}
      </button>
    </form>
  );
}

export default function Payment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchRequest();
  }, [id]);

  const fetchRequest = async () => {
    try {
      const res = await axiosInstance.get(`/requests/${id}`);
      setRequest(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ backgroundColor: "#ffffff" }} className="min-h-screen flex items-center justify-center">
        <div style={{ borderColor: "#151c5c" }} className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!request) {
    return (
      <div style={{ backgroundColor: "#ffffff" }} className="min-h-screen flex items-center justify-center">
        <p style={{ color: "#1a1a2e" }} className="text-lg font-semibold">Request not found!</p>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#ffffff" }} className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-2xl border border-[#e5e0d8]">

        {success ? (
          <div className="text-center py-6">
            <p className="text-5xl mb-3">🎉</p>
            <h2 style={{ color: "#1a1a2e" }} className="text-xl font-bold mb-2">
              Payment Successful!
            </h2>
            <p className="text-gray-400 text-sm mb-6">
              Your payment of ${request.budget} has been confirmed.
            </p>
            <button
              onClick={() => navigate("/dashboard")}
              style={{ backgroundColor: "#151c5c" }}
              className="w-full text-white py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition"
            >
              Back to Dashboard
            </button>
          </div>
        ) : (
          <>
            <h2 style={{ color: "#1a1a2e" }} className="text-xl font-bold mb-1">
              Complete Payment
            </h2>
            <p className="text-gray-400 text-sm mb-6">
              {request.serviceId?.title} — ${request.budget}
            </p>

            <Elements stripe={stripePromise}>
              <PaymentForm request={request} onSuccess={() => setSuccess(true)} />
            </Elements>
          </>
        )}
      </div>
    </div>
  );
}