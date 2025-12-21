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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      articles: {
        Row: {
          author: string | null
          author_id: string | null
          category: string | null
          content: string
          created_at: string
          editor: string | null
          id: string
          image_url: string | null
          likes_count: number
          published_at: string | null
          source: string | null
          title: string
          updated_at: string
          view_count: number
        }
        Insert: {
          author?: string | null
          author_id?: string | null
          category?: string | null
          content: string
          created_at?: string
          editor?: string | null
          id?: string
          image_url?: string | null
          likes_count?: number
          published_at?: string | null
          title: string
          updated_at?: string
          view_count?: number
        }
        Update: {
          author?: string | null
          author_id?: string | null
          category?: string | null
          content?: string
          created_at?: string
          editor?: string | null
          id?: string
          image_url?: string | null
          likes_count?: number
          published_at?: string | null
          title?: string
          updated_at?: string
          view_count?: number
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          created_at: string | null
          email: string
          id: string
          is_testimonial: boolean | null
          message: string
          nama: string
          phone: string | null
          program: string | null
          subject: string | null
          testimonial_order: number | null
          testimonial_rating: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          is_testimonial?: boolean | null
          message: string
          nama: string
          phone?: string | null
          program?: string | null
          subject?: string | null
          testimonial_order?: number | null
          testimonial_rating?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          is_testimonial?: boolean | null
          message?: string
          nama?: string
          phone?: string | null
          program?: string | null
          subject?: string | null
          testimonial_order?: number | null
          testimonial_rating?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      content_likes: {
        Row: {
          content_id: string
          content_type: string
          created_at: string
          id: string
          user_identifier: string
        }
        Insert: {
          content_id: string
          content_type: string
          created_at?: string
          id?: string
          user_identifier: string
        }
        Update: {
          content_id?: string
          content_type?: string
          created_at?: string
          id?: string
          user_identifier?: string
        }
        Relationships: []
      }
      division_logos: {
        Row: {
          created_at: string | null
          division_name: string
          id: string
          logo_url: string
          order_index: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          division_name: string
          id?: string
          logo_url: string
          order_index?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          division_name?: string
          id?: string
          logo_url?: string
          order_index?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      events: {
        Row: {
          created_at: string
          description: string
          event_date: string
          event_time: string
          id: string
          location: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          event_date: string
          event_time: string
          id?: string
          location: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          event_date?: string
          event_time?: string
          id?: string
          location?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      home_slideshow: {
        Row: {
          created_at: string
          id: string
          image_url: string
          order_index: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_url: string
          order_index?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string
          order_index?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      map_settings: {
        Row: {
          embed_url: string | null
          id: string
          latitude: number | null
          location_name: string | null
          longitude: number | null
          updated_at: string | null
        }
        Insert: {
          embed_url?: string | null
          id?: string
          latitude?: number | null
          location_name?: string | null
          longitude?: number | null
          updated_at?: string | null
        }
        Update: {
          embed_url?: string | null
          id?: string
          latitude?: number | null
          location_name?: string | null
          longitude?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      news: {
        Row: {
          author: string | null
          author_id: string | null
          cameraman: string[] | null
          category: string | null
          content: string
          created_at: string
          editor: string | null
          id: string
          image_url: string | null
          likes_count: number
          published_at: string | null
          title: string
          updated_at: string
          view_count: number
        }
        Insert: {
          author?: string | null
          author_id?: string | null
          cameraman?: string[] | null
          category?: string | null
          content: string
          created_at?: string
          editor?: string | null
          id?: string
          image_url?: string | null
          likes_count?: number
          published_at?: string | null
          title: string
          updated_at?: string
          view_count?: number
        }
        Update: {
          author?: string | null
          author_id?: string | null
          cameraman?: string[] | null
          category?: string | null
          content?: string
          created_at?: string
          editor?: string | null
          id?: string
          image_url?: string | null
          likes_count?: number
          published_at?: string | null
          title?: string
          updated_at?: string
          view_count?: number
        }
        Relationships: []
      }
      organization: {
        Row: {
          category: string | null
          created_at: string
          id: string
          level: number | null
          name: string
          order_index: number | null
          photo_url: string | null
          position: string
          updated_at: string
          year: number | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          id?: string
          level?: number | null
          name: string
          order_index?: number | null
          photo_url?: string | null
          position: string
          updated_at?: string
          year?: number | null
        }
        Update: {
          category?: string | null
          created_at?: string
          id?: string
          level?: number | null
          name?: string
          order_index?: number | null
          photo_url?: string | null
          position?: string
          updated_at?: string
          year?: number | null
        }
        Relationships: []
      }
      profile_settings: {
        Row: {
          banner_url: string | null
          created_at: string
          description: string | null
          id: string
          organization_image_url: string | null
          updated_at: string
        }
        Insert: {
          banner_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          organization_image_url?: string | null
          updated_at?: string
        }
        Update: {
          banner_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          organization_image_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      radio_programs: {
        Row: {
          air_time: string
          created_at: string
          day_of_week: number
          description: string
          end_time: string | null
          host: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          air_time: string
          created_at?: string
          day_of_week: number
          description: string
          end_time?: string | null
          host: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          air_time?: string
          created_at?: string
          day_of_week?: number
          description?: string
          end_time?: string | null
          host?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      radio_settings: {
        Row: {
          banner_image_url: string | null
          id: string
          streaming_url: string
          updated_at: string
        }
        Insert: {
          banner_image_url?: string | null
          id?: string
          streaming_url: string
          updated_at?: string
        }
        Update: {
          banner_image_url?: string | null
          id?: string
          streaming_url?: string
          updated_at?: string
        }
        Relationships: []
      }
      slideshow_settings: {
        Row: {
          auto_play_speed: number
          created_at: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          auto_play_speed?: number
          created_at?: string | null
          id?: string
          updated_at?: string | null
        }
        Update: {
          auto_play_speed?: number
          created_at?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      social_media_links: {
        Row: {
          created_at: string | null
          id: string
          organization: string
          platform: string
          updated_at: string | null
          url: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          organization: string
          platform: string
          updated_at?: string | null
          url: string
        }
        Update: {
          created_at?: string | null
          id?: string
          organization?: string
          platform?: string
          updated_at?: string | null
          url?: string
        }
        Relationships: []
      }
      struktur_organisasi: {
        Row: {
          angkatan: string
          created_at: string
          foto_url: string
          id: string
          updated_at: string
        }
        Insert: {
          angkatan: string
          created_at?: string
          foto_url: string
          id?: string
          updated_at?: string
        }
        Update: {
          angkatan?: string
          created_at?: string
          foto_url?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
