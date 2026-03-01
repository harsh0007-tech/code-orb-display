import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // JSONP endpoint for GET requests - bypasses fetch/XHR interception
  if (req.method === "GET") {
    try {
      const url = new URL(req.url);
      const callback = url.searchParams.get("callback") || "__dataCallback";
      const table = url.searchParams.get("table") || "projects";

      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const supabase = createClient(supabaseUrl, supabaseKey);

      const { data, error } = await supabase
        .from(table)
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        const js = `${callback}(null, ${JSON.stringify(error.message)});`;
        return new Response(js, {
          headers: { ...corsHeaders, "Content-Type": "application/javascript" },
        });
      }

      const js = `${callback}(${JSON.stringify(data)}, null);`;
      return new Response(js, {
        headers: { ...corsHeaders, "Content-Type": "application/javascript" },
      });
    } catch (error) {
      const js = `__dataCallback(null, ${JSON.stringify(error.message)});`;
      return new Response(js, {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/javascript" },
      });
    }
  }

  try {
    const { table, select, order, method, body, filters } = await req.json();

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    if (method === "SELECT") {
      let query = supabase.from(table).select(select || "*");
      
      if (order) {
        query = query.order(order.column, { ascending: order.ascending ?? false });
      }

      if (filters) {
        for (const filter of filters) {
          query = query.filter(filter.column, filter.operator, filter.value);
        }
      }

      const { data, error } = await query;

      if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (method === "INSERT") {
      const { data, error } = await supabase.from(table).insert(body).select();
      
      if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify(data), {
        status: 201,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Unsupported method" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Proxy error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
