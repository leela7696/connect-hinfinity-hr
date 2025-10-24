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
      document_audit_logs: {
        Row: {
          action: string
          actor_id: string | null
          actor_name: string | null
          after_state: Json | null
          before_state: Json | null
          created_at: string | null
          document_id: string | null
          id: string
          ip_address: string | null
          request_id: string | null
          user_agent: string | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          actor_name?: string | null
          after_state?: Json | null
          before_state?: Json | null
          created_at?: string | null
          document_id?: string | null
          id?: string
          ip_address?: string | null
          request_id?: string | null
          user_agent?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          actor_name?: string | null
          after_state?: Json | null
          before_state?: Json | null
          created_at?: string | null
          document_id?: string | null
          id?: string
          ip_address?: string | null
          request_id?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "document_audit_logs_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "employee_documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_audit_logs_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "document_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      document_requests: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          approver_id: string | null
          attachments: Json | null
          comment: string | null
          created_at: string | null
          delivery_method: Database["public"]["Enums"]["delivery_method"] | null
          document_type: Database["public"]["Enums"]["document_type"]
          due_by: string | null
          employee_id: string
          employee_name: string | null
          escalation_level: number | null
          format: Database["public"]["Enums"]["document_format"] | null
          generated_document_url: string | null
          id: string
          metadata: Json | null
          period: string | null
          purpose: string
          rejection_reason: string | null
          sla_hours: number | null
          status: Database["public"]["Enums"]["document_request_status"] | null
          template_id: string | null
          updated_at: string | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          approver_id?: string | null
          attachments?: Json | null
          comment?: string | null
          created_at?: string | null
          delivery_method?:
            | Database["public"]["Enums"]["delivery_method"]
            | null
          document_type: Database["public"]["Enums"]["document_type"]
          due_by?: string | null
          employee_id: string
          employee_name?: string | null
          escalation_level?: number | null
          format?: Database["public"]["Enums"]["document_format"] | null
          generated_document_url?: string | null
          id?: string
          metadata?: Json | null
          period?: string | null
          purpose: string
          rejection_reason?: string | null
          sla_hours?: number | null
          status?: Database["public"]["Enums"]["document_request_status"] | null
          template_id?: string | null
          updated_at?: string | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          approver_id?: string | null
          attachments?: Json | null
          comment?: string | null
          created_at?: string | null
          delivery_method?:
            | Database["public"]["Enums"]["delivery_method"]
            | null
          document_type?: Database["public"]["Enums"]["document_type"]
          due_by?: string | null
          employee_id?: string
          employee_name?: string | null
          escalation_level?: number | null
          format?: Database["public"]["Enums"]["document_format"] | null
          generated_document_url?: string | null
          id?: string
          metadata?: Json | null
          period?: string | null
          purpose?: string
          rejection_reason?: string | null
          sla_hours?: number | null
          status?: Database["public"]["Enums"]["document_request_status"] | null
          template_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "document_requests_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "document_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      document_templates: {
        Row: {
          auto_generate_allowed: boolean | null
          created_at: string | null
          created_by: string | null
          default_approver_role: Database["public"]["Enums"]["app_role"] | null
          default_delivery_method:
            | Database["public"]["Enums"]["delivery_method"]
            | null
          default_sla_hours: number | null
          document_type: Database["public"]["Enums"]["document_type"]
          footer_asset_url: string | null
          header_asset_url: string | null
          id: string
          is_active: boolean | null
          name: string
          placeholders: Json | null
          requires_approval: boolean | null
          template_content: string
          updated_at: string | null
          version: number | null
        }
        Insert: {
          auto_generate_allowed?: boolean | null
          created_at?: string | null
          created_by?: string | null
          default_approver_role?: Database["public"]["Enums"]["app_role"] | null
          default_delivery_method?:
            | Database["public"]["Enums"]["delivery_method"]
            | null
          default_sla_hours?: number | null
          document_type: Database["public"]["Enums"]["document_type"]
          footer_asset_url?: string | null
          header_asset_url?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          placeholders?: Json | null
          requires_approval?: boolean | null
          template_content: string
          updated_at?: string | null
          version?: number | null
        }
        Update: {
          auto_generate_allowed?: boolean | null
          created_at?: string | null
          created_by?: string | null
          default_approver_role?: Database["public"]["Enums"]["app_role"] | null
          default_delivery_method?:
            | Database["public"]["Enums"]["delivery_method"]
            | null
          default_sla_hours?: number | null
          document_type?: Database["public"]["Enums"]["document_type"]
          footer_asset_url?: string | null
          header_asset_url?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          placeholders?: Json | null
          requires_approval?: boolean | null
          template_content?: string
          updated_at?: string | null
          version?: number | null
        }
        Relationships: []
      }
      employee_documents: {
        Row: {
          created_at: string | null
          document_type: Database["public"]["Enums"]["document_type"]
          employee_id: string
          expires_at: string | null
          file_name: string
          file_size: number | null
          file_url: string
          generated_by_request_id: string | null
          id: string
          is_signed: boolean | null
          metadata: Json | null
          signer_metadata: Json | null
          tags: string[] | null
          updated_at: string | null
          uploaded_by: string | null
          version: number | null
        }
        Insert: {
          created_at?: string | null
          document_type: Database["public"]["Enums"]["document_type"]
          employee_id: string
          expires_at?: string | null
          file_name: string
          file_size?: number | null
          file_url: string
          generated_by_request_id?: string | null
          id?: string
          is_signed?: boolean | null
          metadata?: Json | null
          signer_metadata?: Json | null
          tags?: string[] | null
          updated_at?: string | null
          uploaded_by?: string | null
          version?: number | null
        }
        Update: {
          created_at?: string | null
          document_type?: Database["public"]["Enums"]["document_type"]
          employee_id?: string
          expires_at?: string | null
          file_name?: string
          file_size?: number | null
          file_url?: string
          generated_by_request_id?: string | null
          id?: string
          is_signed?: boolean | null
          metadata?: Json | null
          signer_metadata?: Json | null
          tags?: string[] | null
          updated_at?: string | null
          uploaded_by?: string | null
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "employee_documents_generated_by_request_id_fkey"
            columns: ["generated_by_request_id"]
            isOneToOne: false
            referencedRelation: "document_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          department: string | null
          full_name: string
          id: string
          is_onboarded: boolean | null
          phone: string | null
          position: string | null
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          department?: string | null
          full_name: string
          id?: string
          is_onboarded?: boolean | null
          phone?: string | null
          position?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          department?: string | null
          full_name?: string
          id?: string
          is_onboarded?: boolean | null
          phone?: string | null
          position?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      team_members: {
        Row: {
          employee_id: string
          id: string
          is_primary: boolean | null
          joined_on: string
          role_in_team: string
          status: string
          team_id: string
        }
        Insert: {
          employee_id: string
          id?: string
          is_primary?: boolean | null
          joined_on?: string
          role_in_team: string
          status?: string
          team_id: string
        }
        Update: {
          employee_id?: string
          id?: string
          is_primary?: boolean | null
          joined_on?: string
          role_in_team?: string
          status?: string
          team_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_members_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "team_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          created_at: string
          created_by: string | null
          department: string
          description: string | null
          id: string
          is_active: boolean | null
          manager_id: string
          name: string
          slug: string
          tags: string[] | null
          tenant_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          department: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          manager_id: string
          name: string
          slug: string
          tags?: string[] | null
          tenant_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          department?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          manager_id?: string
          name?: string
          slug?: string
          tags?: string[] | null
          tenant_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "teams_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "teams_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_primary_role: { Args: { _user_id: string }; Returns: string }
      get_user_role: { Args: { user_uuid: string }; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "hr" | "manager" | "employee"
      delivery_method: "portal" | "email" | "both"
      document_format: "pdf" | "docx"
      document_request_status:
        | "pending"
        | "awaiting_approval"
        | "in_progress"
        | "completed"
        | "rejected"
        | "changes_requested"
        | "auto_generating"
        | "sla_breached"
      document_type:
        | "offer_letter"
        | "experience_letter"
        | "salary_slip"
        | "employment_verification"
        | "relieving_letter"
        | "custom"
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
      app_role: ["admin", "hr", "manager", "employee"],
      delivery_method: ["portal", "email", "both"],
      document_format: ["pdf", "docx"],
      document_request_status: [
        "pending",
        "awaiting_approval",
        "in_progress",
        "completed",
        "rejected",
        "changes_requested",
        "auto_generating",
        "sla_breached",
      ],
      document_type: [
        "offer_letter",
        "experience_letter",
        "salary_slip",
        "employment_verification",
        "relieving_letter",
        "custom",
      ],
    },
  },
} as const
