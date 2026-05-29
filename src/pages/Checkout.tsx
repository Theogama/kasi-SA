import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useUser } from "@clerk/react";
import { useCart } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogClose
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { 
  ShieldCheck, 
  Landmark, 
  Truck, 
  Store, 
  MapPin, 
  Search, 
  Gift, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight,
  User,
  Phone,
  Building,
  Mail,
  Lock
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { getOrCreateUserIdByEmail, validateCartStock } from "@/lib/orders";
import { parsePriceLabel } from "@/lib/products";
import { 
  CARRIERS, 
  FREE_SHIPPING_THRESHOLD, 
  PEP_STORES, 
  PARGO_POINTS, 
  type Carrier, 
  type PepStore, 
  type PargoPoint 
} from "@/lib/shippingCarriers";

const Checkout = () => {
  const { user } = useUser();
  const { items, totalPrice } = useCart();

  // Step state: 1 = Shipping & Carrier, 2 = Payment Review
  const [checkoutStep, setCheckoutStep] = useState<1 | 2>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // User input states
  const [shippingName, setShippingName] = useState("");
  const [shippingPhone, setShippingPhone] = useState("");
  
  // Carrier selection
  const [selectedCarrierId, setSelectedCarrierId] = useState("courier_guy");
  
  // Specific pickup point selections
  const [selectedPepStore, setSelectedPepStore] = useState<PepStore | null>(null);
  const [selectedPargoPoint, setSelectedPargoPoint] = useState<PargoPoint | null>(null);
  
  // Physical address for standard door-to-door
  const [physicalAddress, setPhysicalAddress] = useState({
    street: "",
    apartment: "",
    city: "",
    province: "",
    postalCode: ""
  });

  // Modal / Drawer state for pickup selectors
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [storeSearchTerm, setStoreSearchTerm] = useState("");

  // Sync Clerk details to state once loaded
  useEffect(() => {
    if (user) {
      setShippingName(`${user.firstName || ""} ${user.lastName || ""}`.trim());
      setShippingPhone(user.primaryPhoneNumber?.phoneNumber || "");
    }
  }, [user]);

  // Cart total calculations
  const shippingCost = useMemo(() => {
    if (totalPrice >= FREE_SHIPPING_THRESHOLD) return 0;
    const carrier = CARRIERS.find(c => c.id === selectedCarrierId);
    return carrier ? carrier.price : 0;
  }, [totalPrice, selectedCarrierId]);

  const progressToFreeShipping = useMemo(() => {
    return Math.min((totalPrice / FREE_SHIPPING_THRESHOLD) * 100, 100);
  }, [totalPrice]);

  const amountNeededForFreeShipping = useMemo(() => {
    return Math.max(FREE_SHIPPING_THRESHOLD - totalPrice, 0);
  }, [totalPrice]);

  const finalTotal = useMemo(() => totalPrice + shippingCost, [totalPrice, shippingCost]);

  // Get currently selected carrier object
  const selectedCarrier = useMemo(() => {
    return CARRIERS.find(c => c.id === selectedCarrierId) || CARRIERS[0];
  }, [selectedCarrierId]);

  // Filtered lists for Store selectors
  const filteredPepStores = useMemo(() => {
    if (!storeSearchTerm.trim()) return PEP_STORES;
    return PEP_STORES.filter(store => 
      store.name.toLowerCase().includes(storeSearchTerm.toLowerCase()) ||
      store.city.toLowerCase().includes(storeSearchTerm.toLowerCase()) ||
      store.province.toLowerCase().includes(storeSearchTerm.toLowerCase()) ||
      store.code.toLowerCase().includes(storeSearchTerm.toLowerCase())
    );
  }, [storeSearchTerm]);

  const filteredPargoPoints = useMemo(() => {
    if (!storeSearchTerm.trim()) return PARGO_POINTS;
    return PARGO_POINTS.filter(point => 
      point.name.toLowerCase().includes(storeSearchTerm.toLowerCase()) ||
      point.city.toLowerCase().includes(storeSearchTerm.toLowerCase()) ||
      point.province.toLowerCase().includes(storeSearchTerm.toLowerCase()) ||
      point.id.toLowerCase().includes(storeSearchTerm.toLowerCase())
    );
  }, [storeSearchTerm]);

  const mPaymentId = useMemo(() => `ORD-${Date.now()}`, []);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <p className="animate-pulse text-lg font-medium">Loading secure checkout...</p>
      </div>
    );
  }

  // Payfast environment configuration
  const merchantId = import.meta.env.VITE_PAYFAST_MERCHANT_ID;
  const merchantKey = import.meta.env.VITE_PAYFAST_MERCHANT_KEY;
  const payfastMode = import.meta.env.VITE_PAYFAST_MODE || "live";
  const baseUrl = import.meta.env.VITE_APP_URL || window.location.origin;
  const isLocalHost = baseUrl.includes("localhost") || baseUrl.includes("127.0.0.1");
  const useSandboxForLocal = payfastMode === "live" && isLocalHost;
  const payfastUrl = useSandboxForLocal
    ? "https://sandbox.payfast.co.za/eng/process"
    : payfastMode === "live"
      ? "https://www.payfast.co.za/eng/process"
      : "https://sandbox.payfast.co.za/eng/process";

  const validateShippingForm = () => {
    if (!shippingName.trim()) {
      toast.error("Please enter a recipient name");
      return false;
    }
    if (!shippingPhone.trim()) {
      toast.error("Please enter a delivery phone number");
      return false;
    }

    if (selectedCarrierId === "courier_guy") {
      if (!physicalAddress.street.trim() || !physicalAddress.city.trim() || !physicalAddress.province || !physicalAddress.postalCode.trim()) {
        toast.error("Please complete all physical address fields");
        return false;
      }
    } else if (selectedCarrierId === "paxi_pep" && !selectedPepStore) {
      toast.error("Please select a PEP Store for PAXI collection");
      return false;
    } else if (selectedCarrierId === "pargo_collect" && !selectedPargoPoint) {
      toast.error("Please select a Pargo pickup point");
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (validateShippingForm()) {
      setCheckoutStep(2);
      window.scrollTo(0, 0);
    }
  };

  const handlePayfastSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!merchantId || !merchantKey) {
      toast.error("Payment configuration error", {
        description: "Payfast credentials are not configured.",
      });
      return;
    }

    if (!validateShippingForm()) return;

    setIsSubmitting(true);

    try {
      const email = user.primaryEmailAddress?.emailAddress;
      if (!email) throw new Error("Could not retrieve user email address");

      const stockValidation = await validateCartStock(
        items.map((item) => ({
          id: item.id,
          quantity: item.quantity,
          name: item.name,
          size: item.size,
        }))
      );

      if (!stockValidation.ok) {
        toast.error(stockValidation.message);
        setIsSubmitting(false);
        return;
      }

      // 1. Resolve / sync Supabase User ID
      const dbUserId = await getOrCreateUserIdByEmail({
        email,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phone: shippingPhone || user.primaryPhoneNumber?.phoneNumber || "",
      });

      // 2. Format shipping details and carrier details
      let carrierName = selectedCarrier.name;
      let streetAddress = "";
      let deliveryCity = "";
      let deliveryProvince = "";
      let deliveryPostal = "";

      if (selectedCarrierId === "courier_guy") {
        streetAddress = physicalAddress.street + (physicalAddress.apartment ? `, ${physicalAddress.apartment}` : "");
        deliveryCity = physicalAddress.city;
        deliveryProvince = physicalAddress.province;
        deliveryPostal = physicalAddress.postalCode;
      } else if (selectedCarrierId === "paxi_pep" && selectedPepStore) {
        carrierName = `PAXI - ${selectedPepStore.name}`;
        streetAddress = `${selectedPepStore.name} (${selectedPepStore.code}), ${selectedPepStore.address}`;
        deliveryCity = selectedPepStore.city;
        deliveryProvince = selectedPepStore.province;
        deliveryPostal = selectedPepStore.code;
      } else if (selectedCarrierId === "pargo_collect" && selectedPargoPoint) {
        carrierName = `Pargo - ${selectedPargoPoint.name}`;
        streetAddress = `${selectedPargoPoint.name} (${selectedPargoPoint.id}), ${selectedPargoPoint.address}`;
        deliveryCity = selectedPargoPoint.city;
        deliveryProvince = selectedPargoPoint.province;
        deliveryPostal = selectedPargoPoint.id;
      }

      // 3. Create Pending Order in Supabase
      const { data: dbOrder, error: orderError } = await supabase
        .from("orders")
        .insert([
          {
            user_id: dbUserId,
            order_number: mPaymentId,
            total_amount: finalTotal,
            shipping_cost: shippingCost,
            shipping_method: carrierName,
            payment_status: "pending",
            order_status: "pending",
          }
        ])
        .select()
        .single();

      if (orderError) throw orderError;

      // 4. Create Order Items
      const dbItems = items.map(item => ({
        order_id: dbOrder.id,
        product_id: item.id,
        quantity: item.quantity,
        size: item.size || "M",
        unit_price: parsePriceLabel(item.price),
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(dbItems);

      if (itemsError) throw itemsError;

      // 5. Create Customer Address linked to Order
      const { error: addressError } = await supabase
        .from("customer_addresses")
        .insert([
          {
            user_id: dbUserId,
            order_id: dbOrder.id,
            full_name: shippingName,
            email: email,
            phone: shippingPhone,
            street_address: streetAddress,
            city: deliveryCity,
            province: deliveryProvince,
            postal_code: deliveryPostal,
          }
        ]);

      if (addressError) console.warn("Could not save shipping address details:", addressError);

      // 6. Pre-payment success logic: redirect to Payfast Sandbox
      const form = event.target as HTMLFormElement;
      toast.success("Order recorded! Redirecting to secure payment...");
      
      // Delay slightly for visual comfort
      setTimeout(() => {
        form.submit();
      }, 800);

    } catch (err) {
      setIsSubmitting(false);
      console.error("Checkout database sync failed:", err);
      toast.error("Failed to place order", {
        description: err instanceof Error ? err.message : "Database synchronization error. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Navbar />
      
      <div className="flex-grow pt-24 pb-20">
        <div className="container mx-auto px-6 max-w-5xl">
          
          {/* Progress Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-border pb-6">
            <div>
              <h1 className="text-4xl font-heading tracking-tight font-extrabold text-foreground">Secure Checkout</h1>
              <p className="text-sm text-muted-foreground mt-1">Order Ref: {mPaymentId}</p>
            </div>
            
            {/* Step indicators */}
            <div className="flex items-center gap-3">
              <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full transition-all ${
                checkoutStep === 1 
                  ? "bg-foreground text-background" 
                  : "bg-secondary text-muted-foreground"
              }`}>
                1. Shipping Details
              </span>
              <ArrowRight size={16} className="text-muted-foreground" />
              <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full transition-all ${
                checkoutStep === 2 
                  ? "bg-foreground text-background" 
                  : "bg-secondary text-muted-foreground"
              }`}>
                2. Review & Pay
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Main Interactive Form Column */}
            <div className="lg:col-span-2 space-y-6">
              
              {checkoutStep === 1 ? (
                /* STEP 1: Shipping and Carrier Select */
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <Card className="p-6 border border-border">
                    <h2 className="text-2xl font-heading font-bold mb-6 flex items-center gap-2">
                      <User size={20} className="text-muted-foreground" />
                      Recipient Information
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="shippingName" className="font-semibold text-sm">Recipient Full Name</Label>
                        <div className="relative">
                          <User size={16} className="absolute left-3 top-3 text-muted-foreground" />
                          <Input
                            id="shippingName"
                            placeholder="e.g. Sipho Ndlovu"
                            value={shippingName}
                            onChange={(e) => setShippingName(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="shippingPhone" className="font-semibold text-sm">Mobile Phone Number (For Courier SMS)</Label>
                        <div className="relative">
                          <Phone size={16} className="absolute left-3 top-3 text-muted-foreground" />
                          <Input
                            id="shippingPhone"
                            type="tel"
                            placeholder="e.g. +27 82 123 4567"
                            value={shippingPhone}
                            onChange={(e) => setShippingPhone(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Carriers use this to send collection PINs or coordinate delivery.</p>
                      </div>
                    </div>
                  </Card>

                  {/* Carrier Selection */}
                  <Card className="p-6 border border-border">
                    <h2 className="text-2xl font-heading font-bold mb-4 flex items-center gap-2">
                      <Truck size={20} className="text-muted-foreground" />
                      Choose Shipping Method
                    </h2>
                    <p className="text-sm text-muted-foreground mb-6">Select from our local South African shipping partners tailored for township and urban delivery.</p>

                    <div className="grid grid-cols-1 gap-4">
                      {CARRIERS.map((carrier) => {
                        const isSelected = selectedCarrierId === carrier.id;
                        
                        return (
                          <div
                            key={carrier.id}
                            onClick={() => {
                              setSelectedCarrierId(carrier.id);
                              // Reset specific points if carrier changes
                              setStoreSearchTerm("");
                            }}
                            className={`p-4 border rounded-xl cursor-pointer transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-foreground/40 ${
                              isSelected 
                                ? "border-foreground bg-secondary/20 shadow-sm" 
                                : "border-border bg-card"
                            }`}
                          >
                            <div className="flex gap-4 items-center">
                              <div className={`p-3 rounded-lg ${isSelected ? "bg-foreground text-background" : "bg-secondary text-muted-foreground"}`}>
                                {carrier.icon === "Truck" && <Truck size={24} />}
                                {carrier.icon === "Store" && <Store size={24} />}
                                {carrier.icon === "MapPin" && <MapPin size={24} />}
                              </div>
                              <div>
                                <h3 className="font-heading font-bold text-base flex items-center gap-2">
                                  {carrier.name}
                                  {isSelected && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />}
                                </h3>
                                <p className="text-xs text-muted-foreground pr-2 mt-1 leading-normal max-w-md">{carrier.description}</p>
                              </div>
                            </div>
                            
                            <div className="text-right w-full md:w-auto flex md:flex-col justify-between items-center md:items-end border-t md:border-0 pt-3 md:pt-0 mt-2 md:mt-0">
                              <span className="text-sm font-semibold text-muted-foreground">{carrier.estimatedDays}</span>
                              <span className="text-lg font-bold font-heading mt-0.5">
                                {totalPrice >= FREE_SHIPPING_THRESHOLD ? (
                                  <span className="text-emerald-600 font-bold uppercase tracking-wider text-sm flex items-center gap-1">
                                    <Gift size={14} /> FREE
                                  </span>
                                ) : (
                                  `R${carrier.price.toFixed(2)}`
                                )}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </Card>

                  {/* Custom Carrier Location Fields */}
                  <Card className="p-6 border border-border">
                    {selectedCarrierId === "courier_guy" && (
                      <div className="space-y-4 animate-in fade-in duration-200">
                        <h3 className="text-xl font-heading font-bold mb-4 flex items-center gap-2">
                          <Building size={18} className="text-muted-foreground" />
                          Delivery Address
                        </h3>
                        
                        <div className="space-y-3">
                          <div className="space-y-1">
                            <Label htmlFor="street" className="text-xs font-semibold">Street Address</Label>
                            <Input
                              id="street"
                              placeholder="e.g. 128 Vilakazi Street"
                              value={physicalAddress.street}
                              onChange={(e) => setPhysicalAddress({...physicalAddress, street: e.target.value})}
                            />
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <Label htmlFor="apartment" className="text-xs font-semibold">Apartment, Unit, or Complex (Optional)</Label>
                              <Input
                                id="apartment"
                                placeholder="e.g. Unit 4B"
                                value={physicalAddress.apartment}
                                onChange={(e) => setPhysicalAddress({...physicalAddress, apartment: e.target.value})}
                              />
                            </div>
                            <div className="space-y-1">
                              <Label htmlFor="city" className="text-xs font-semibold">Suburb / City</Label>
                              <Input
                                id="city"
                                placeholder="e.g. Orlando West, Soweto"
                                value={physicalAddress.city}
                                onChange={(e) => setPhysicalAddress({...physicalAddress, city: e.target.value})}
                              />
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <Label htmlFor="province" className="text-xs font-semibold">Province</Label>
                              <select
                                id="province"
                                value={physicalAddress.province}
                                onChange={(e) => setPhysicalAddress({...physicalAddress, province: e.target.value})}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                <option value="">Select Province</option>
                                <option value="Gauteng">Gauteng</option>
                                <option value="Western Cape">Western Cape</option>
                                <option value="KwaZulu-Natal">KwaZulu-Natal</option>
                                <option value="Eastern Cape">Eastern Cape</option>
                                <option value="Free State">Free State</option>
                                <option value="Limpopo">Limpopo</option>
                                <option value="Mpumalanga">Mpumalanga</option>
                                <option value="North West">North West</option>
                                <option value="Northern Cape">Northern Cape</option>
                              </select>
                            </div>
                            <div className="space-y-1">
                              <Label htmlFor="postal" className="text-xs font-semibold">Postal Code</Label>
                              <Input
                                id="postal"
                                placeholder="e.g. 1804"
                                value={physicalAddress.postalCode}
                                onChange={(e) => setPhysicalAddress({...physicalAddress, postalCode: e.target.value})}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedCarrierId === "paxi_pep" && (
                      <div className="space-y-4 animate-in fade-in duration-200">
                        <h3 className="text-xl font-heading font-bold mb-2 flex items-center gap-2">
                          <Store size={18} className="text-muted-foreground" />
                          PAXI PEP Collection Point
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          Your order will be shipped to a PEP Store of your choice. Once it arrives, you will receive an SMS containing a secure collection PIN.
                        </p>
                        
                        {selectedPepStore ? (
                          <div className="bg-emerald-50/50 border border-emerald-200 rounded-xl p-4 flex justify-between items-center gap-4">
                            <div className="flex gap-3 items-center">
                              <div className="bg-emerald-100 text-emerald-800 p-2 rounded-full">
                                <CheckCircle2 size={20} />
                              </div>
                              <div>
                                <p className="font-bold text-sm text-emerald-950">{selectedPepStore.name}</p>
                                <p className="text-xs text-emerald-800/80 mt-0.5">{selectedPepStore.address}</p>
                                <p className="text-[10px] font-bold text-emerald-700 bg-emerald-100/50 px-2 py-0.5 rounded-full inline-block mt-2">CODE: {selectedPepStore.code}</p>
                              </div>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => {
                                setIsSelectorOpen(true);
                                setStoreSearchTerm("");
                              }}
                              className="border-emerald-300 hover:bg-emerald-50 shrink-0 text-emerald-900 text-xs font-bold"
                            >
                              Change Store
                            </Button>
                          </div>
                        ) : (
                          <div className="border border-dashed border-border rounded-xl p-8 text-center bg-secondary/10">
                            <Store size={36} className="mx-auto text-muted-foreground mb-3 opacity-60 animate-bounce" />
                            <p className="font-semibold text-sm mb-4">No PEP Store selected</p>
                            <Button 
                              onClick={() => {
                                setIsSelectorOpen(true);
                                setStoreSearchTerm("");
                              }}
                              size="lg"
                              className="font-bold"
                            >
                              Select PEP Store for Collection
                            </Button>
                          </div>
                        )}
                      </div>
                    )}

                    {selectedCarrierId === "pargo_collect" && (
                      <div className="space-y-4 animate-in fade-in duration-200">
                        <h3 className="text-xl font-heading font-bold mb-2 flex items-center gap-2">
                          <MapPin size={18} className="text-muted-foreground" />
                          Pargo Pickup Point
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          Pick up your order at convenient partner locations such as Clicks and FreshStop. You will get an SMS and email notification when it is ready.
                        </p>
                        
                        {selectedPargoPoint ? (
                          <div className="bg-emerald-50/50 border border-emerald-200 rounded-xl p-4 flex justify-between items-center gap-4">
                            <div className="flex gap-3 items-center">
                              <div className="bg-emerald-100 text-emerald-800 p-2 rounded-full">
                                <CheckCircle2 size={20} />
                              </div>
                              <div>
                                <p className="font-bold text-sm text-emerald-950">{selectedPargoPoint.name}</p>
                                <p className="text-xs text-emerald-800/80 mt-0.5">{selectedPargoPoint.address}</p>
                                <p className="text-[10px] font-bold text-emerald-700 bg-emerald-100/50 px-2 py-0.5 rounded-full inline-block mt-2">ID: {selectedPargoPoint.id} | {selectedPargoPoint.partner}</p>
                              </div>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => {
                                setIsSelectorOpen(true);
                                setStoreSearchTerm("");
                              }}
                              className="border-emerald-300 hover:bg-emerald-50 shrink-0 text-emerald-900 text-xs font-bold"
                            >
                              Change Point
                            </Button>
                          </div>
                        ) : (
                          <div className="border border-dashed border-border rounded-xl p-8 text-center bg-secondary/10">
                            <MapPin size={36} className="mx-auto text-muted-foreground mb-3 opacity-60 animate-bounce" />
                            <p className="font-semibold text-sm mb-4">No Pargo Pickup Point selected</p>
                            <Button 
                              onClick={() => {
                                setIsSelectorOpen(true);
                                setStoreSearchTerm("");
                              }}
                              size="lg"
                              className="font-bold"
                            >
                              Select Pargo Pickup Point
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </Card>

                  {/* Proceed CTA */}
                  <Button onClick={handleNextStep} className="w-full font-bold uppercase tracking-wider py-6" size="lg">
                    Continue to Payment Review
                    <ArrowRight size={18} className="ml-2" />
                  </Button>
                </div>
              ) : (
                /* STEP 2: Payment Gateway & Review */
                <div className="space-y-6 animate-in fade-in slide-in-from-right-2 duration-300">
                  <Card className="p-6 border border-border space-y-6">
                    <div className="flex justify-between items-center border-b border-border pb-4">
                      <h2 className="text-2xl font-heading font-bold flex items-center gap-2">
                        <ShieldCheck size={24} className="text-green-600" />
                        Order & Delivery Review
                      </h2>
                      <Button variant="ghost" size="sm" onClick={() => setCheckoutStep(1)} className="font-semibold text-xs text-muted-foreground underline">
                        Edit Shipping
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                      <div className="space-y-3 bg-secondary/10 p-4 rounded-xl">
                        <p className="font-bold text-xs uppercase tracking-wider text-muted-foreground">Recipient Details</p>
                        <div>
                          <p className="font-semibold text-base">{shippingName}</p>
                          <p className="text-muted-foreground mt-1 flex items-center gap-1.5"><Phone size={14} /> {shippingPhone}</p>
                          <p className="text-muted-foreground flex items-center gap-1.5 mt-0.5"><Mail size={14} /> {user.primaryEmailAddress?.emailAddress}</p>
                        </div>
                      </div>

                      <div className="space-y-3 bg-secondary/10 p-4 rounded-xl">
                        <p className="font-bold text-xs uppercase tracking-wider text-muted-foreground">Delivery Method</p>
                        <div>
                          <p className="font-semibold text-base flex items-center gap-1.5">
                            {selectedCarrierId === "courier_guy" && <Truck size={16} />}
                            {selectedCarrierId === "paxi_pep" && <Store size={16} />}
                            {selectedCarrierId === "pargo_collect" && <MapPin size={16} />}
                            {selectedCarrier.name}
                          </p>
                          
                          <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                            {selectedCarrierId === "courier_guy" && `${physicalAddress.street}, ${physicalAddress.apartment ? physicalAddress.apartment + ", " : ""}${physicalAddress.city}, ${physicalAddress.province}, ${physicalAddress.postalCode}`}
                            {selectedCarrierId === "paxi_pep" && selectedPepStore && `${selectedPepStore.name} (Code: ${selectedPepStore.code}) - ${selectedPepStore.address}`}
                            {selectedCarrierId === "pargo_collect" && selectedPargoPoint && `${selectedPargoPoint.name} (ID: ${selectedPargoPoint.id}) - ${selectedPargoPoint.address}`}
                          </p>
                          <p className="text-xs font-bold text-emerald-600 mt-2 bg-emerald-50 border border-emerald-100 py-1 px-2.5 rounded-full inline-block">
                            Est: {selectedCarrier.estimatedDays}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-border pt-6">
                      <div className="flex items-center gap-3 text-sm text-green-700 bg-green-50/50 p-4 rounded-xl border border-green-200">
                        <ShieldCheck size={24} className="text-green-600 shrink-0" />
                        <div>
                          <p className="font-bold">Secure Payment processed by Payfast</p>
                          <p className="text-xs text-green-800/80 leading-normal mt-0.5">Your personal data is encrypted, and no bank card details are saved on our servers.</p>
                        </div>
                      </div>

                      {useSandboxForLocal && (
                        <div className="mt-4 rounded-xl border border-yellow-300 bg-yellow-50/40 p-4 text-xs text-yellow-900 leading-normal">
                          Live Payfast credentials are not active on local server environments. Standard Sandbox gateway will be used to simulate checkout safely.
                        </div>
                      )}

                      {(!merchantId || !merchantKey) && (
                        <div className="mt-4 rounded-xl border border-red-300 bg-red-50 p-4 text-xs text-red-950 font-medium">
                          ⚠️ Payfast merchant credentials are not configured. Payment forms will remain disabled until VITE_PAYFAST_MERCHANT_ID is properly loaded.
                        </div>
                      )}
                    </div>

                    {/* Payfast Submission Form */}
                    <form action={payfastUrl} method="POST" onSubmit={handlePayfastSubmit}>
                      {/* Payfast Required Fields */}
                      <input type="hidden" name="merchant_id" value={merchantId} />
                      <input type="hidden" name="merchant_key" value={merchantKey} />
                      <input type="hidden" name="return_url" value={`${baseUrl}/checkout/success?m_payment_id=${mPaymentId}`} />
                      <input type="hidden" name="cancel_url" value={`${baseUrl}/cart?payment_canceled=true`} />
                      <input type="hidden" name="notify_url" value={`${import.meta.env.VITE_API_URL || `${baseUrl}/api`}/payment/payfast/notify`} />
                      
                      {/* Customer Details */}
                      <input type="hidden" name="name_first" value={shippingName.split(" ")[0]} />
                      <input type="hidden" name="name_last" value={shippingName.split(" ").slice(1).join(" ")} />
                      <input type="hidden" name="email_address" value={user.primaryEmailAddress?.emailAddress || ""} />
                      
                      <input type="hidden" name="m_payment_id" value={mPaymentId} />
                      <input type="hidden" name="amount" value={finalTotal.toFixed(2)} />
                      <input type="hidden" name="item_name" value={`Kasi Street Style Order - ${mPaymentId}`} />

                      <div className="flex gap-4">
                        <Button type="button" variant="outline" onClick={() => setCheckoutStep(1)} className="font-semibold w-1/3 py-6 h-auto" disabled={isSubmitting}>
                          Back
                        </Button>
                        <Button type="submit" className="w-2/3 font-bold uppercase tracking-wider py-6 h-auto bg-black hover:bg-black/90 text-white" disabled={isSubmitting || !merchantId || !merchantKey}>
                          {isSubmitting ? (
                            <span className="flex items-center gap-2 justify-center">
                              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Redirecting to Payfast...
                            </span>
                          ) : (
                            <span className="flex items-center justify-center gap-1">
                              <Lock size={16} /> Pay R{finalTotal.toFixed(2)} Now
                            </span>
                          )}
                        </Button>
                      </div>
                    </form>
                  </Card>
                </div>
              )}
            </div>

            {/* Sidebar Order Summary Column */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* Free Shipping Promo Widget */}
              <Card className="p-5 border border-border space-y-3 bg-secondary/5 overflow-hidden relative">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Gift size={14} className="text-foreground" />
                    Delivery Promotion
                  </h3>
                  {totalPrice >= FREE_SHIPPING_THRESHOLD ? (
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wide">Achieved</span>
                  ) : (
                    <span className="text-[10px] bg-secondary text-foreground font-semibold px-2 py-0.5 rounded-full">SA Only</span>
                  )}
                </div>
                
                {totalPrice >= FREE_SHIPPING_THRESHOLD ? (
                  <div className="space-y-1.5 animate-in zoom-in-95 duration-200">
                    <p className="font-bold text-sm text-foreground flex items-center gap-1">
                      🎉 Free Delivery Unlocked!
                    </p>
                    <p className="text-xs text-muted-foreground leading-normal">
                      Your order totals R{totalPrice.toFixed(2)} which exceeds the R1000 threshold. Free courier shipping applied!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground leading-normal">
                      Spend <strong className="text-foreground">R{amountNeededForFreeShipping.toFixed(2)}</strong> more to get <strong className="text-foreground">FREE shipping</strong> anywhere in SA!
                    </p>
                    <Progress value={progressToFreeShipping} className="h-2" />
                  </div>
                )}
              </Card>

              {/* Summary Items */}
              <Card className="p-6 border border-border space-y-6">
                <h2 className="text-xl font-heading font-extrabold pb-3 border-b border-border">Order Items</h2>
                
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div key={`${item.id}-${item.size}`} className="flex justify-between items-start gap-4 text-sm pb-4 border-b border-border/40 last:border-0 last:pb-0">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-16 bg-secondary/40 rounded overflow-hidden flex-shrink-0 border border-border/30">
                          <img src={item.frontImage} alt={item.name} className="w-full h-full object-contain p-1" />
                        </div>
                        <div>
                          <p className="font-bold text-xs uppercase tracking-tight text-foreground line-clamp-1">{item.name}</p>
                          <p className="text-[11px] text-muted-foreground mt-0.5">
                            Qty: {item.quantity}{item.size && ` | Size: ${item.size}`}
                          </p>
                        </div>
                      </div>
                      <p className="font-semibold text-xs pt-1">
                        R{(parseFloat(item.price.replace("R", "").replace(",", "")) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 pt-4 border-t border-border text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Items Subtotal</span>
                    <span className="font-medium">R{totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping ({selectedCarrier.name})</span>
                    <span className="font-medium text-right">
                      {totalPrice >= FREE_SHIPPING_THRESHOLD ? (
                        <span className="text-emerald-600 font-semibold uppercase tracking-wider text-xs">FREE</span>
                      ) : (
                        `R${shippingCost.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  
                  <div className="pt-4 border-t border-border flex justify-between items-end">
                    <div>
                      <span className="font-heading font-extrabold text-base">Grand Total</span>
                      <p className="text-[10px] text-muted-foreground leading-none mt-0.5">Includes VAT (where applicable)</p>
                    </div>
                    <span className="font-heading font-black text-2xl tracking-tight text-foreground">
                      R{finalTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              </Card>

              {/* Accepted Payments Icons */}
              <div className="pt-2 text-center">
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-3">Secure Gateways</p>
                <div className="flex flex-wrap items-center justify-center gap-2 opacity-70">
                  <div className="w-10 h-7 bg-secondary/50 border border-border rounded flex items-center justify-center text-[8px] font-bold text-muted-foreground">VISA</div>
                  <div className="w-10 h-7 bg-secondary/50 border border-border rounded flex items-center justify-center text-[8px] font-bold text-muted-foreground">MC</div>
                  <div className="w-10 h-7 bg-secondary/50 border border-border rounded flex items-center justify-center text-[8px] font-bold text-muted-foreground">EFT</div>
                  <div className="w-10 h-7 bg-secondary/50 border border-border rounded flex items-center justify-center text-[8px] font-bold text-muted-foreground">SNAP</div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
      
      {/* PEP STORES & PARGO POINTS SELECTOR DIALOG */}
      <Dialog open={isSelectorOpen} onOpenChange={setIsSelectorOpen}>
        <DialogContent className="max-w-xl w-[95%] max-h-[85vh] flex flex-col p-6 rounded-2xl gap-4">
          <DialogHeader>
            <DialogTitle className="text-2xl font-heading font-extrabold flex items-center gap-2">
              {selectedCarrierId === "paxi_pep" ? <Store size={22} /> : <MapPin size={22} />}
              {selectedCarrierId === "paxi_pep" ? "Choose Collection PEP Store" : "Select Pargo Pickup Location"}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Search by township, city, province, or postal code. Select the most convenient location for collection.
            </DialogDescription>
          </DialogHeader>

          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-3 text-muted-foreground" size={18} />
            <Input
              placeholder="e.g. Soweto, Khayelitsha, Clicks..."
              value={storeSearchTerm}
              onChange={(e) => setStoreSearchTerm(e.target.value)}
              className="pl-10 text-sm font-medium py-5"
            />
          </div>

          {/* List items */}
          <div className="flex-grow overflow-y-auto max-h-[40vh] pr-1 space-y-2 mt-2">
            {selectedCarrierId === "paxi_pep" ? (
              filteredPepStores.length > 0 ? (
                filteredPepStores.map((store) => (
                  <div
                    key={store.code}
                    onClick={() => {
                      setSelectedPepStore(store);
                      setIsSelectorOpen(false);
                      toast.success(`Selected PEP Store: ${store.name}`);
                    }}
                    className="p-3 border border-border hover:border-foreground/40 rounded-xl cursor-pointer bg-card hover:bg-secondary/10 transition-all flex flex-col gap-1.5"
                  >
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-sm text-foreground">{store.name}</span>
                      <span className="text-[10px] font-extrabold uppercase bg-secondary text-muted-foreground px-2 py-0.5 rounded-full">{store.code}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{store.address}</p>
                    <div className="flex gap-2 items-center text-[10px] font-medium text-muted-foreground mt-1">
                      <span>{store.city}</span>
                      <span>•</span>
                      <span>{store.province}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-center text-muted-foreground py-6">No matching PEP Stores found. Try searching for a different area.</p>
              )
            ) : (
              filteredPargoPoints.length > 0 ? (
                filteredPargoPoints.map((point) => (
                  <div
                    key={point.id}
                    onClick={() => {
                      setSelectedPargoPoint(point);
                      setIsSelectorOpen(false);
                      toast.success(`Selected Pargo Point: ${point.name}`);
                    }}
                    className="p-3 border border-border hover:border-foreground/40 rounded-xl cursor-pointer bg-card hover:bg-secondary/10 transition-all flex flex-col gap-1.5"
                  >
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-sm text-foreground flex items-center gap-1.5">
                        <span className="text-[9px] font-extrabold bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
                          {point.partner}
                        </span>
                        {point.name}
                      </span>
                      <span className="text-[10px] font-extrabold uppercase bg-secondary text-muted-foreground px-2 py-0.5 rounded-full">{point.id}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{point.address}</p>
                    <div className="flex gap-2 items-center text-[10px] font-medium text-muted-foreground mt-1">
                      <span>{point.city}</span>
                      <span>•</span>
                      <span>{point.province}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-center text-muted-foreground py-6">No matching Pargo Pickup Points found. Try searching for another name or city.</p>
              )
            )}
          </div>

          <div className="border-t border-border pt-3 mt-2 flex justify-end">
            <DialogClose asChild>
              <Button variant="outline" size="sm" className="font-bold">Cancel</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Checkout;
