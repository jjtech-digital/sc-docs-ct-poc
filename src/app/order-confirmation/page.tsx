import { apiRoot } from "@/lib/ctClient";
import { redirect } from "next/navigation";
import OrderConfirmation from "./order-confirmation";

interface PageProps {
  searchParams: { orderId?: string };
}

export default async function Page({ searchParams }: PageProps) {
  const orderId = searchParams.orderId;
  if (!orderId) redirect("/");

  try {
    const res = await apiRoot.orders().withId({ ID: orderId }).get().execute();
    const order = res.body;

    return <OrderConfirmation order={order} />;
  } catch {
    return <div>Order not found.</div>;
  }
}
