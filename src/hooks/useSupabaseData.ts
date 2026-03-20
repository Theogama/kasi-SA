import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export const useSupabaseData = <T,>(
  table: string,
  query?: { column: string; value: unknown }
) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let request = supabase.from(table).select();

        if (query) {
          request = request.eq(query.column, query.value);
        }

        const { data: result, error: err } = await request;

        if (err) throw err;
        setData(result || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [table, query]);

  return { data, loading, error };
};

export const useSupabaseSingle = <T,>(
  table: string,
  id: string | undefined
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const { data: result, error: err } = await supabase
          .from(table)
          .select()
          .eq("id", id)
          .single();

        if (err) throw err;
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [table, id]);

  return { data, loading, error };
};
