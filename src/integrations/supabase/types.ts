export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      hashtag_metrics: {
        Row: {
          hashtag_id: string
          id: string
          recorded_at: string
          video_count: number | null
          view_count: number | null
        }
        Insert: {
          hashtag_id: string
          id?: string
          recorded_at?: string
          video_count?: number | null
          view_count?: number | null
        }
        Update: {
          hashtag_id?: string
          id?: string
          recorded_at?: string
          video_count?: number | null
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "hashtag_metrics_hashtag_id_fkey"
            columns: ["hashtag_id"]
            isOneToOne: false
            referencedRelation: "hashtags"
            referencedColumns: ["id"]
          },
        ]
      }
      hashtags: {
        Row: {
          created_at: string
          current_video_count: number | null
          current_view_count: number | null
          first_seen_at: string
          id: string
          is_tracked: boolean | null
          tag: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_video_count?: number | null
          current_view_count?: number | null
          first_seen_at?: string
          id?: string
          is_tracked?: boolean | null
          tag: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_video_count?: number | null
          current_view_count?: number | null
          first_seen_at?: string
          id?: string
          is_tracked?: boolean | null
          tag?: string
          updated_at?: string
        }
        Relationships: []
      }
      product_hashtags: {
        Row: {
          hashtag_id: string
          id: string
          product_id: string
        }
        Insert: {
          hashtag_id: string
          id?: string
          product_id: string
        }
        Update: {
          hashtag_id?: string
          id?: string
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_hashtags_hashtag_id_fkey"
            columns: ["hashtag_id"]
            isOneToOne: false
            referencedRelation: "hashtags"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_hashtags_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "tracked_products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_mention_metrics: {
        Row: {
          avg_engagement: number | null
          id: string
          mention_count: number | null
          new_videos_count: number | null
          product_id: string
          recorded_at: string
          total_comments: number | null
          total_likes: number | null
          total_views: number | null
        }
        Insert: {
          avg_engagement?: number | null
          id?: string
          mention_count?: number | null
          new_videos_count?: number | null
          product_id: string
          recorded_at?: string
          total_comments?: number | null
          total_likes?: number | null
          total_views?: number | null
        }
        Update: {
          avg_engagement?: number | null
          id?: string
          mention_count?: number | null
          new_videos_count?: number | null
          product_id?: string
          recorded_at?: string
          total_comments?: number | null
          total_likes?: number | null
          total_views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "product_mention_metrics_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "tracked_products"
            referencedColumns: ["id"]
          },
        ]
      }
      tiktok_videos: {
        Row: {
          author_username: string | null
          collected_at: string
          comment_count: number | null
          description: string | null
          id: string
          like_count: number | null
          product_id: string | null
          published_at: string | null
          share_count: number | null
          thumbnail_url: string | null
          video_id: string
          video_url: string | null
          view_count: number | null
        }
        Insert: {
          author_username?: string | null
          collected_at?: string
          comment_count?: number | null
          description?: string | null
          id?: string
          like_count?: number | null
          product_id?: string | null
          published_at?: string | null
          share_count?: number | null
          thumbnail_url?: string | null
          video_id: string
          video_url?: string | null
          view_count?: number | null
        }
        Update: {
          author_username?: string | null
          collected_at?: string
          comment_count?: number | null
          description?: string | null
          id?: string
          like_count?: number | null
          product_id?: string | null
          published_at?: string | null
          share_count?: number | null
          thumbnail_url?: string | null
          video_id?: string
          video_url?: string | null
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "tiktok_videos_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "tracked_products"
            referencedColumns: ["id"]
          },
        ]
      }
      tracked_products: {
        Row: {
          avg_engagement: number | null
          category: string | null
          created_at: string
          first_detected_at: string
          growth_percentage: number | null
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          total_mentions: number | null
          total_views: number | null
          trend_level: string | null
          trend_score: number | null
          updated_at: string
        }
        Insert: {
          avg_engagement?: number | null
          category?: string | null
          created_at?: string
          first_detected_at?: string
          growth_percentage?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          total_mentions?: number | null
          total_views?: number | null
          trend_level?: string | null
          trend_score?: number | null
          updated_at?: string
        }
        Update: {
          avg_engagement?: number | null
          category?: string | null
          created_at?: string
          first_detected_at?: string
          growth_percentage?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          total_mentions?: number | null
          total_views?: number | null
          trend_level?: string | null
          trend_score?: number | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
