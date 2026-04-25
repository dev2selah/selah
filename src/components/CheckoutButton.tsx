export default function CheckoutButton() {

  const handlePayment = () => {
    window.location.href = "https://instagram.com";
  };

  return (
    <button onClick={handlePayment}>
      Pagar agora
    </button>
  );
}