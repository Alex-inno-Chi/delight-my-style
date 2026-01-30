import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Интерфейс для входящего письма от Resend
interface InboundEmail {
  from: string
  to: string
  subject: string
  html?: string
  text?: string
  reply_to?: string
  headers?: Record<string, string>
  attachments?: Array<{
    filename: string
    content_type: string
    size: number
  }>
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('=== 📧 ПОЛУЧЕНО ВХОДЯЩЕЕ ПИСЬМО ===')
    
    // Получаем данные письма от Resend
    const email: InboundEmail = await req.json()
    
    // Логируем основную информацию
    console.log('\n📨 ОСНОВНАЯ ИНФОРМАЦИЯ:')
    console.log('От кого:', email.from)
    console.log('Кому:', email.to)
    console.log('Тема:', email.subject)
    console.log('Reply-To:', email.reply_to || 'не указан')
    
    // Логируем содержимое письма
    console.log('\n📝 СОДЕРЖИМОЕ:')
    if (email.text) {
      console.log('Текстовая версия:')
      console.log('---')
      console.log(email.text)
      console.log('---')
    }
    
    if (email.html) {
      console.log('\nHTML версия (первые 500 символов):')
      console.log('---')
      console.log(email.html.substring(0, 500))
      console.log('---')
    }
    
    // Логируем вложения
    if (email.attachments && email.attachments.length > 0) {
      console.log('\n📎 ВЛОЖЕНИЯ:')
      email.attachments.forEach((attachment, index) => {
        console.log(`${index + 1}. ${attachment.filename}`)
        console.log(`   Тип: ${attachment.content_type}`)
        console.log(`   Размер: ${attachment.size} байт`)
      })
    } else {
      console.log('\n📎 ВЛОЖЕНИЯ: нет')
    }
    
    // Логируем заголовки
    if (email.headers) {
      console.log('\n📋 ЗАГОЛОВКИ:')
      Object.entries(email.headers).forEach(([key, value]) => {
        console.log(`${key}: ${value}`)
      })
    }
    
    console.log('\n=== ✅ ПИСЬМО ОБРАБОТАНО ===\n')
    
    // Возвращаем успешный ответ Resend
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Email received and logged',
        from: email.from,
        subject: email.subject
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('❌ ОШИБКА при обработке письма:', error)
    
    // Возвращаем ошибку
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})

