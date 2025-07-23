import { apiRoot } from "@/lib/ctClient";
import { redirect } from "next/navigation";
import OrderConfirmation from "./order-confirmation";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  const { orderId } = await searchParams;

  if (!orderId) redirect("/");

  try {
    const res = await apiRoot.orders().withId({ ID: orderId }).get().execute();
    const order = {
      ...res.body,
      lineItems: res.body.lineItems.map(
        (item: (typeof res.body.lineItems)[number]) => ({
          ...item,
          price: {
            ...item.price,
            discounted: !!item.price.discounted,
          },
        })
      ),
    };
    return <OrderConfirmation order={order} />;
  } catch {
    return <div>Order not found.</div>;
  }
}
