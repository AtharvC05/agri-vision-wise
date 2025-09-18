import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string
          phone: string
          language: 'en' | 'hi' | 'ta' | 'te'
          location: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          phone: string
          language: 'en' | 'hi' | 'ta' | 'te'
          location: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          phone?: string
          language?: 'en' | 'hi' | 'ta' | 'te'
          location?: string
          created_at?: string
        }
      }
      farms: {
        Row: {
          id: string
          user_id: string
          name: string
          location: string
          size: number
          crop_type: string
          sowing_date: string
          irrigation_type: 'drip' | 'sprinkler' | 'flood' | 'manual'
          soil_nitrogen: number
          soil_phosphorus: number
          soil_potassium: number
          soil_ph: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          location: string
          size: number
          crop_type: string
          sowing_date: string
          irrigation_type: 'drip' | 'sprinkler' | 'flood' | 'manual'
          soil_nitrogen: number
          soil_phosphorus: number
          soil_potassium: number
          soil_ph: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          location?: string
          size?: number
          crop_type?: string
          sowing_date?: string
          irrigation_type?: 'drip' | 'sprinkler' | 'flood' | 'manual'
          soil_nitrogen?: number
          soil_phosphorus?: number
          soil_potassium?: number
          soil_ph?: number
          created_at?: string
        }
      }
      alerts: {
        Row: {
          id: string
          farm_id: string
          type: 'irrigation' | 'fertilizer' | 'pest' | 'weather'
          priority: 'low' | 'medium' | 'high'
          title: string
          message: string
          action_required: boolean
          created_at: string
        }
        Insert: {
          id?: string
          farm_id: string
          type: 'irrigation' | 'fertilizer' | 'pest' | 'weather'
          priority: 'low' | 'medium' | 'high'
          title: string
          message: string
          action_required: boolean
          created_at?: string
        }
        Update: {
          id?: string
          farm_id?: string
          type?: 'irrigation' | 'fertilizer' | 'pest' | 'weather'
          priority?: 'low' | 'medium' | 'high'
          title?: string
          message?: string
          action_required?: boolean
          created_at?: string
        }
      }
      feedback: {
        Row: {
          id: string
          farm_id: string
          actual_yield: number
          issues: string[]
          rating: number
          comments: string
          created_at: string
        }
        Insert: {
          id?: string
          farm_id: string
          actual_yield: number
          issues: string[]
          rating: number
          comments: string
          created_at?: string
        }
        Update: {
          id?: string
          farm_id?: string
          actual_yield?: number
          issues?: string[]
          rating?: number
          comments?: string
          created_at?: string
        }
      }
    }
  }
}