import { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { fetchOrdersForEmail, type UserOrder } from "@/lib/orders";
import { formatPrice } from "@/lib/products";

const statusClass = (status: string) => {
  const normalized = status.toLowerCase();
  if (normalized === "completed" || normalized === "success" || normalized === "paid") {
    return "bg-emerald-100 text-emerald-900 border-emerald-300";
  }
  if (normalized === "pending" || normalized === "processing") {
    return "bg-amber-100 text-amber-900 border-amber-300";
  }
  return "bg-secondary text-foreground border-border";
};

const Orders = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<UserOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      navigate("/");
    }
  }, [isLoaded, isSignedIn, navigate]);

  useEffect(() => {
    const loadOrders = async () => {
      const email = user?.primaryEmailAddress?.emailAddress;
      if (!email) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const result = await fetchOrdersForEmail(email);
        setOrders(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    if (isLoaded && isSignedIn) {
      loadOrders();
    }
  }, [isLoaded, isSignedIn, user]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-6 max-w-5xl">
          <h1 className="text-4xl md:text-5xl font-heading mb-3">My Orders</h1>
          <p className="text-muted-foreground mb-10">Track your payments and delivery progress.</p>

          {loading && (
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <Card key={item}>
                  <CardHeader>
                    <Skeleton className="h-6 w-48" />
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!loading && error && (
            <Alert variant="destructive">
              <AlertCircle size={16} />
              <AlertTitle>Could not load orders</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!loading && !error && orders.length === 0 && (
            <Card>
              <CardContent className="pt-6 text-muted-foreground">
                You have no orders yet. Place your first order from the shop.
              </CardContent>
            </Card>
          )}

          {!loading && !error && orders.length > 0 && (
            <div className="space-y-4">
              {orders.map((order) => (
                <Card key={order.id}>
                  <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <CardTitle className="text-xl">Order {order.order_number}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={statusClass(order.payment_status)}>
                        Payment: {order.payment_status}
                      </Badge>
                      <Badge variant="outline" className={statusClass(order.order_status)}>
                        Status: {order.order_status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <p className="text-foreground font-medium">Total</p>
                      <p>{formatPrice(order.total_amount)}</p>
                    </div>
                    <div>
                      <p className="text-foreground font-medium">Shipping</p>
                      <p>{order.shipping_method}</p>
                    </div>
                    <div>
                      <p className="text-foreground font-medium">Placed</p>
                      <p>{new Date(order.created_at).toLocaleString()}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Orders;
