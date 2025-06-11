export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      stock_baskets: {
        Row: {
          id: string
          user_id: string
          name: string
          created_at: string
          updated_at: string
          source_weights: Json
          is_locked: boolean
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          created_at?: string
          updated_at?: string
          source_weights?: Json
          is_locked?: boolean
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          created_at?: string
          updated_at?: string
          source_weights?: Json
          is_locked?: boolean
        }
      }
      basket_stocks: {
        Row: {
          id: string
          basket_id: string
          symbol: string
          name: string
          sector: string
          allocation: number
          is_locked: boolean
        }
        Insert: {
          id?: string
          basket_id: string
          symbol: string
          name: string
          sector: string
          allocation: number
          is_locked?: boolean
        }
        Update: {
          id?: string
          basket_id?: string
          symbol?: string
          name?: string
          sector?: string
          allocation?: number
          is_locked?: boolean
        }
      }
      news_signals_full: {
        Row: {
          id: number
          date: string
          comp_symbol: string
          analyzed_articles: number
          sentiment_score: number
          sentiment: string
          entry_price: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          date: string
          comp_symbol: string
          analyzed_articles: number
          sentiment_score: number
          sentiment: string
          entry_price: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          date?: string
          comp_symbol?: string
          analyzed_articles?: number
          sentiment_score?: number
          sentiment?: string
          entry_price?: number
          created_at?: string
          updated_at?: string
        }
      }
      twitter_signals_full: {
        Row: {
          id: number
          date: string
          comp_symbol: string
          analyzed_tweets: number
          sentiment_score: number
          sentiment: string
          entry_price: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          date: string
          comp_symbol: string
          analyzed_tweets: number
          sentiment_score: number
          sentiment: string
          entry_price: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          date?: string
          comp_symbol?: string
          analyzed_tweets?: number
          sentiment_score?: number
          sentiment?: string
          entry_price?: number
          created_at?: string
          updated_at?: string
        }
      }
      gtrend_signals_full: {
        Row: {
          id: number
          date: string
          comp_symbol: string
          analyzed_keywords: number
          sentiment_score: number
          sentiment: string
          entry_price: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          date: string
          comp_symbol: string
          analyzed_keywords: number
          sentiment_score: number
          sentiment: string
          entry_price: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          date?: string
          comp_symbol?: string
          analyzed_keywords?: number
          sentiment_score?: number
          sentiment?: string
          entry_price?: number
          created_at?: string
          updated_at?: string
        }
      }
      models_performance: {
        Row: {
          id: number
          date: string
          comp_symbol: string
          sentiment: string
          entry_price: number
          "30d_pl": number
          "60d_pl": number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          date: string
          comp_symbol: string
          sentiment: string
          entry_price: number
          "30d_pl": number
          "60d_pl": number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          date?: string
          comp_symbol?: string
          sentiment?: string
          entry_price?: number
          "30d_pl"?: number
          "60d_pl"?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
