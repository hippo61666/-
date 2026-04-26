import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
// 使用 Service Role Key 以便后端拥有管理权限 (绕过 RLS)，但在实际给用户的接口中
// 应该传递用户 Token 或通过 RLS 策略保证安全
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️ Warning: Supabase URL or Key is missing. Database operations will fail.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
