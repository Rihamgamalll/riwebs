import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const body = await req.json();

    const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;

    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error("Missing server configuration");
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Call the create_order RPC function
    const { data: orderResult, error: orderError } = await supabase.rpc("create_order", {
      p_user_id: body.user_id || null,
      p_full_name: body.full_name,
      p_phone: body.phone,
      p_whatsapp: body.whatsapp || null,
      p_governorate: body.governorate,
      p_city: body.city,
      p_address_detail: body.address_detail,
      p_landmark: body.landmark || null,
      p_notes: body.notes || null,
      p_subtotal: body.subtotal,
      p_discount: body.discount,
      p_total: body.total,
      p_payment_method: body.payment_method,
      p_coupon_code: body.coupon_code || null,
      p_items: body.items,
    });

    if (orderError) {
      throw new Error(orderError.message);
    }

    const result = orderResult as { order_id: string; order_number: string; status: string };

    // Fetch order items for WhatsApp message
    const { data: items } = await supabase
      .from("order_items")
      .select("product_name, quantity, price")
      .eq("order_id", result.order_id);

    // Build WhatsApp message
    const itemsList = (items || [])
      .map((item: any) => `${item.product_name} × ${item.quantity}`)
      .join("\n");

    const paymentLabel: Record<string, string> = {
      cod: "Cash on Delivery",
      vodafone: "Vodafone Cash",
      instapay: "InstaPay",
    };

    const adminUrl = `${supabaseUrl.replace(".supabase.co", "")}/admin`;
    const whatsappMessage = `New Order – Riham's Beauty

Order Number: ${result.order_number}
Customer Name: ${body.full_name}
Phone: ${body.phone}
${body.whatsapp ? `WhatsApp: ${body.whatsapp}\n` : ""}Address: ${body.governorate} – ${body.city}
${body.address_detail}
Products:
${itemsList}
Total: ${body.total} EGP
Payment Method: ${paymentLabel[body.payment_method] || body.payment_method}
${body.notes ? `Notes: ${body.notes}\n` : ""}
View in Admin Dashboard: ${adminUrl}`;

    // Send WhatsApp notification via WhatsApp Business API (if configured)
    const whatsappApiToken = Deno.env.get("WHATSAPP_API_TOKEN");
    const whatsappPhoneNumberId = Deno.env.get("WHATSAPP_PHONE_NUMBER_ID");
    const adminWhatsAppNumber = Deno.env.get("ADMIN_WHATSAPP_NUMBER");

    if (whatsappApiToken && whatsappPhoneNumberId && adminWhatsAppNumber) {
      try {
        const waResponse = await fetch(
          `https://graph.facebook.com/v18.0/${whatsappPhoneNumberId}/messages`,
          {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${whatsappApiToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              messaging_product: "whatsapp",
              to: adminWhatsAppNumber,
              type: "text",
              text: { body: whatsappMessage },
            }),
          }
        );

        if (!waResponse.ok) {
          console.error("WhatsApp API error:", await waResponse.text());
        }
      } catch (waError) {
        console.error("Failed to send WhatsApp message:", waError);
      }
    } else {
      console.log("WhatsApp not configured. Order message:");
      console.log(whatsappMessage);
    }

    return new Response(
      JSON.stringify({
        order_id: result.order_id,
        order_number: result.order_number,
        status: "success",
        whatsapp_message: whatsappMessage,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
