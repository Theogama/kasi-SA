import { supabase } from "../config/supabase.js";

const generateOrderNumber = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `KSS-${timestamp}-${random}`;
};

export const createOrder = async (req, res) => {
  try {
    const { userId } = req;
    const {
      items,
      shippingMethod,
      shippingCost,
      customerInfo,
      totalAmount,
    } = req.body;

    // Validation
    if (!items || !items.length || !shippingMethod || totalAmount === undefined) {
      return res.status(400).json({ error: "Missing required order data" });
    }

    const orderNumber = generateOrderNumber();

    // Create order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert([
        {
          user_id: userId,
          order_number: orderNumber,
          total_amount: totalAmount,
          shipping_cost: shippingCost || 0,
          shipping_method: shippingMethod,
          payment_status: "pending",
          order_status: "pending",
        },
      ])
      .select()
      .single();

    if (orderError) throw orderError;

    // Create order items
    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.id,
      quantity: item.quantity,
      size: item.size,
      unit_price: item.price,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) throw itemsError;

    // Save customer address
    if (customerInfo) {
      const { error: addressError } = await supabase
        .from("customer_addresses")
        .insert([
          {
            user_id: userId,
            order_id: order.id,
            full_name: customerInfo.fullName,
            email: customerInfo.email,
            phone: customerInfo.phone,
            street_address: customerInfo.streetAddress,
            city: customerInfo.city,
            province: customerInfo.province,
            postal_code: customerInfo.postalCode,
          },
        ]);

      if (addressError) console.warn("Address save warning:", addressError);
    }

    res.status(201).json({
      message: "Order created successfully",
      order: {
        id: order.id,
        orderNumber: order.order_number,
        totalAmount: order.total_amount,
        shippingCost: order.shipping_cost,
        paymentStatus: order.payment_status,
      },
    });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
};

export const getOrder = async (req, res) => {
  try {
    const { userId } = req;
    const { orderId } = req.params;

    // Get order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .eq("user_id", userId)
      .single();

    if (!order || orderError) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Get order items
    const { data: items, error: itemsError } = await supabase
      .from("order_items")
      .select("*, products(*)")
      .eq("order_id", orderId);

    if (itemsError) throw itemsError;

    // Get customer address
    const { data: address } = await supabase
      .from("customer_addresses")
      .select("*")
      .eq("order_id", orderId)
      .single();

    // Get payment info
    const { data: payment } = await supabase
      .from("payments")
      .select("*")
      .eq("order_id", orderId)
      .single();

    res.json({
      order: {
        ...order,
        items: items || [],
        address: address || null,
        payment: payment || null,
      },
    });
  } catch (error) {
    console.error("Get order error:", error);
    res.status(500).json({ error: "Failed to fetch order" });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const { userId } = req;

    const { data: orders, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.json({ orders: orders || [] });
  } catch (error) {
    console.error("Get user orders error:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { orderStatus, paymentStatus } = req.body;

    const updateData = {};
    if (orderStatus) updateData.order_status = orderStatus;
    if (paymentStatus) updateData.payment_status = paymentStatus;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: "No fields to update" });
    }

    const { data: order, error } = await supabase
      .from("orders")
      .update(updateData)
      .eq("id", orderId)
      .select()
      .single();

    if (error) throw error;

    res.json({
      message: "Order updated successfully",
      order: order,
    });
  } catch (error) {
    console.error("Update order error:", error);
    res.status(500).json({ error: "Failed to update order" });
  }
};
