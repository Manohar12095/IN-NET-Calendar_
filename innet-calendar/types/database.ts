export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string | null;
          avatar_url: string | null;
          timezone: string;
          created_at: string;
        };
        Insert: {
          id: string;
          name?: string | null;
          avatar_url?: string | null;
          timezone?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string | null;
          avatar_url?: string | null;
          timezone?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      settings: {
        Row: {
          user_id: string;
          theme: string;
          week_start: string;
          time_format: string;
          default_view: string;
          accent_color: string;
          quiet_hours_start: string | null;
          quiet_hours_end: string | null;
          dashboard_widgets: Json;
          ai_auto_apply: Json;
          reduced_motion: boolean;
        };
        Insert: {
          user_id: string;
          theme?: string;
          week_start?: string;
          time_format?: string;
          default_view?: string;
          accent_color?: string;
          quiet_hours_start?: string | null;
          quiet_hours_end?: string | null;
          dashboard_widgets?: Json;
          ai_auto_apply?: Json;
          reduced_motion?: boolean;
        };
        Update: {
          user_id?: string;
          theme?: string;
          week_start?: string;
          time_format?: string;
          default_view?: string;
          accent_color?: string;
          quiet_hours_start?: string | null;
          quiet_hours_end?: string | null;
          dashboard_widgets?: Json;
          ai_auto_apply?: Json;
          reduced_motion?: boolean;
        };
        Relationships: [];
      };
      categories: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          color: string;
          icon: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          color: string;
          icon?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          color?: string;
          icon?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      events: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          start_at: string;
          end_at: string | null;
          all_day: boolean;
          location: string | null;
          category_id: string | null;
          color: string | null;
          notes: string | null;
          rrule: string | null;
          rrule_exceptions: string[] | null;
          timezone: string;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string | null;
          start_at: string;
          end_at?: string | null;
          all_day?: boolean;
          location?: string | null;
          category_id?: string | null;
          color?: string | null;
          notes?: string | null;
          rrule?: string | null;
          rrule_exceptions?: string[] | null;
          timezone?: string;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string | null;
          start_at?: string;
          end_at?: string | null;
          all_day?: boolean;
          location?: string | null;
          category_id?: string | null;
          color?: string | null;
          notes?: string | null;
          rrule?: string | null;
          rrule_exceptions?: string[] | null;
          timezone?: string;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Relationships: [];
      };
      tasks: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          due_at: string | null;
          due_time_set: boolean;
          status: string;
          urgency: string;
          urgency_is_manual: boolean;
          importance: boolean;
          category_id: string | null;
          estimated_minutes: number | null;
          parent_task_id: string | null;
          carried_count: number;
          rrule: string | null;
          completed_at: string | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string | null;
          due_at?: string | null;
          due_time_set?: boolean;
          status?: string;
          urgency?: string;
          urgency_is_manual?: boolean;
          importance?: boolean;
          category_id?: string | null;
          estimated_minutes?: number | null;
          parent_task_id?: string | null;
          carried_count?: number;
          rrule?: string | null;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string | null;
          due_at?: string | null;
          due_time_set?: boolean;
          status?: string;
          urgency?: string;
          urgency_is_manual?: boolean;
          importance?: boolean;
          category_id?: string | null;
          estimated_minutes?: number | null;
          parent_task_id?: string | null;
          carried_count?: number;
          rrule?: string | null;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Relationships: [];
      };
      reminders: {
        Row: {
          id: string;
          user_id: string;
          task_id: string | null;
          event_id: string | null;
          remind_at: string;
          offset_minutes: number | null;
          channel: string;
          status: string;
          snoozed_until: string | null;
          sent_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          task_id?: string | null;
          event_id?: string | null;
          remind_at: string;
          offset_minutes?: number | null;
          channel?: string;
          status?: string;
          snoozed_until?: string | null;
          sent_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          task_id?: string | null;
          event_id?: string | null;
          remind_at?: string;
          offset_minutes?: number | null;
          channel?: string;
          status?: string;
          snoozed_until?: string | null;
          sent_at?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      attachments: {
        Row: {
          id: string;
          user_id: string;
          task_id: string | null;
          event_id: string | null;
          storage_path: string;
          filename: string;
          mime_type: string | null;
          size_bytes: number | null;
          created_at: string;
        };
        Insert: Record<string, never>;
        Update: Record<string, never>;
        Relationships: [];
      };
      agent_accounts: {
        Row: {
          id: string;
          display_name: string;
          description: string | null;
          self_registered: boolean;
          created_at: string;
        };
        Insert: Record<string, never>;
        Update: Record<string, never>;
        Relationships: [];
      };
      agent_access_links: {
        Row: {
          id: string;
          user_id: string;
          token_hash: string;
          permissions: Json;
          label: string | null;
          expires_at: string;
          redeemed_at: string | null;
          redeemed_by_agent_id: string | null;
          revoked_at: string | null;
          created_at: string;
        };
        Insert: Record<string, never>;
        Update: Record<string, never>;
        Relationships: [];
      };
      api_keys: {
        Row: {
          id: string;
          user_id: string | null;
          agent_account_id: string | null;
          name: string;
          key_hash: string;
          key_prefix: string;
          created_via: string;
          permissions: Json;
          expires_at: string | null;
          last_used_at: string | null;
          revoked_at: string | null;
          created_at: string;
        };
        Insert: Record<string, never>;
        Update: Record<string, never>;
        Relationships: [];
      };
      api_requests: {
        Row: {
          id: string;
          user_id: string;
          api_key_id: string | null;
          method: string;
          path: string;
          status_code: number;
          ip: string | null;
          created_at: string;
        };
        Insert: Record<string, never>;
        Update: Record<string, never>;
        Relationships: [];
      };
      audit_log: {
        Row: {
          id: string;
          user_id: string;
          actor: string;
          api_key_id: string | null;
          entity_type: string;
          entity_id: string;
          action: string;
          before: Json | null;
          after: Json | null;
          created_at: string;
        };
        Insert: Record<string, never>;
        Update: Record<string, never>;
        Relationships: [];
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          body: string | null;
          type: string;
          read_at: string | null;
          created_at: string;
        };
        Insert: Record<string, never>;
        Update: Record<string, never>;
        Relationships: [];
      };
      ai_conversations: {
        Row: {
          id: string;
          user_id: string;
          title: string | null;
          created_at: string;
        };
        Insert: Record<string, never>;
        Update: Record<string, never>;
        Relationships: [];
      };
      ai_messages: {
        Row: {
          id: string;
          conversation_id: string;
          user_id: string;
          role: string;
          content: string | null;
          tool_calls: Json | null;
          created_at: string;
        };
        Insert: Record<string, never>;
        Update: Record<string, never>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Settings = Database["public"]["Tables"]["settings"]["Row"];
export type Task = Database["public"]["Tables"]["tasks"]["Row"];
export type EventRow = Database["public"]["Tables"]["events"]["Row"];
