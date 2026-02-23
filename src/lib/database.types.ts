export interface Database {
  public: {
    Tables: {
      challenges: {
        Row: {
          id: string;
          title: string;
          difficulty: string;
          description: string;
          constraints: string[];
          examples: Example[];
          starter_code_cpp: string;
          starter_code_python: string;
          test_cases: TestCase[];
          created_at: string;
          is_daily: boolean;
          daily_date: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          difficulty?: string;
          description: string;
          constraints?: string[];
          examples?: Example[];
          starter_code_cpp?: string;
          starter_code_python?: string;
          test_cases?: TestCase[];
          created_at?: string;
          is_daily?: boolean;
          daily_date?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          difficulty?: string;
          description?: string;
          constraints?: string[];
          examples?: Example[];
          starter_code_cpp?: string;
          starter_code_python?: string;
          test_cases?: TestCase[];
          created_at?: string;
          is_daily?: boolean;
          daily_date?: string | null;
        };
      };
    };
  };
}

export interface Example {
  input: string;
  output: string;
  explanation?: string;
}

export interface TestCase {
  input: string;
  expected: string;
}

export type Challenge = Database['public']['Tables']['challenges']['Row'];
