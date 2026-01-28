import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ResendWebhookEvent {
  type: 'email.sent' | 'email.delivered' | 'email.opened' | 'email.clicked' | 'email.bounced' | 'email.complained'
  created_at: string
  data: {
    email_id: string
    from: string
    to: string[]
    subject: string
    created_at: string
  }
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Parse webhook event from Resend
    const event: ResendWebhookEvent = await req.json()

    console.log('Received Resend webhook event:', event.type, event.data.email_id)

    // Create Supabase client with SERVICE_ROLE_KEY
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    const resendEmailId = event.data.email_id
    const now = new Date().toISOString()

    // Handle different event types
    switch (event.type) {
      case 'email.delivered':
        console.log(`Email ${resendEmailId} delivered`)
        // Можно добавить поле delivered_at в будущем
        break

      case 'email.opened':
        console.log(`Email ${resendEmailId} opened`)

        // Find email log by resend_email_id
        const { data: emailLog, error: fetchError } = await supabaseClient
          .from('email_logs')
          .select('*')
          .eq('resend_email_id', resendEmailId)
          .single()

        if (fetchError) {
          console.error('Error fetching email log:', fetchError)
          break
        }

        if (emailLog) {
          const isFirstOpen = !emailLog.opened_at

          // Update email log with open tracking
          const { error: updateError } = await supabaseClient
            .from('email_logs')
            .update({
              opened_at: emailLog.opened_at || now,
              opened_count: emailLog.opened_count + 1,
              last_opened_at: now,
              updated_at: now,
            })
            .eq('resend_email_id', resendEmailId)

          if (updateError) {
            console.error('Error updating email log:', updateError)
          } else {
            console.log(`Email ${resendEmailId} marked as opened. Count: ${emailLog.opened_count + 1}, First open: ${isFirstOpen}`)
          }
        }
        break

      case 'email.clicked':
        console.log(`Link clicked in email ${resendEmailId}`)
        // Можно добавить отслеживание кликов в будущем
        break

      case 'email.bounced':
        console.log(`Email ${resendEmailId} bounced`)
        // Можно добавить поле bounced_at в будущем
        break

      case 'email.complained':
        console.log(`Spam complaint for email ${resendEmailId}`)
        // Можно добавить поле complained_at в будущем
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    // Always return 200 OK to Resend
    return new Response(
      JSON.stringify({ received: true, event_type: event.type }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error processing webhook:', error)

    // Return 200 even on error to prevent Resend from retrying
    return new Response(
      JSON.stringify({ error: 'Internal error', received: true }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/resend-webhook' \
    --header 'Authorization: Bearer eyJhbGciOiJFUzI1NiIsImtpZCI6ImI4MTI2OWYxLTIxZDgtNGYyZS1iNzE5LWMyMjQwYTg0MGQ5MCIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjIwODQ5NjY4NjV9.d5rBc0fc1N1PMeRF3Lb0OojZmvFQCgj-CjFYd6tKfQshlPUmSsIocgMZMCNgxDZIoyclJOS1C2SVpmk1o6AXZg' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
