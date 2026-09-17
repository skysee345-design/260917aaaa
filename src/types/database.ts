export type PurchaseStatus = "pending" | "paid" | "failed" | "canceled";

export type Profile = {
  id: string;
  nickname: string;
  is_admin: boolean;
  created_at: string;
};

export type Ebook = {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number;
  cover_url: string | null;
  file_path: string;
  is_published: boolean;
  created_at: string;
};

export type Purchase = {
  id: string;
  user_id: string;
  ebook_id: string;
  amount: number;
  status: PurchaseStatus;
  kakao_tid: string | null;
  kakao_partner_order_id: string;
  created_at: string;
  paid_at: string | null;
};

export type Post = {
  id: string;
  user_id: string;
  title: string;
  content: string;
  is_answered: boolean;
  created_at: string;
};

export type Comment = {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  is_admin_answer: boolean;
  created_at: string;
};

type Relationship = {
  foreignKeyName: string;
  columns: string[];
  isOneToOne?: boolean;
  referencedRelation: string;
  referencedColumns: string[];
};

type TableDef<Row, Insert, Relationships extends Relationship[] = [], Update = Partial<Insert>> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: Relationships;
};

export type Database = {
  public: {
    Tables: {
      profiles: TableDef<Profile, Partial<Profile> & { id: string }>;
      ebooks: TableDef<
        Ebook,
        Partial<Omit<Ebook, "id" | "created_at">> &
          Pick<Ebook, "slug" | "title" | "price" | "file_path">
      >;
      purchases: TableDef<
        Purchase,
        Partial<Omit<Purchase, "id" | "created_at">> &
          Pick<Purchase, "user_id" | "ebook_id" | "amount" | "kakao_partner_order_id">,
        [
          {
            foreignKeyName: "purchases_ebook_id_fkey";
            columns: ["ebook_id"];
            isOneToOne: false;
            referencedRelation: "ebooks";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "purchases_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ]
      >;
      posts: TableDef<
        Post,
        Partial<Omit<Post, "id" | "created_at">> & Pick<Post, "user_id" | "title" | "content">,
        [
          {
            foreignKeyName: "posts_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ]
      >;
      comments: TableDef<
        Comment,
        Partial<Omit<Comment, "id" | "created_at">> &
          Pick<Comment, "post_id" | "user_id" | "content">,
        [
          {
            foreignKeyName: "comments_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "posts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "comments_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ]
      >;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      purchase_status: PurchaseStatus;
    };
    CompositeTypes: Record<string, never>;
  };
};
