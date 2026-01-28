-- Add resend_email_id column to email_logs table for webhook tracking
ALTER TABLE public.email_logs 
ADD COLUMN IF NOT EXISTS resend_email_id TEXT;

-- Create index for faster webhook lookups
CREATE INDEX IF NOT EXISTS idx_email_logs_resend_email_id 
ON public.email_logs(resend_email_id);

-- Add comment
COMMENT ON COLUMN public.email_logs.resend_email_id IS 'Resend API email ID for webhook tracking';

