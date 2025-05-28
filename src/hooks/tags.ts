import { Tag } from "@/generated/prisma";
import api from "@/lib/api";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";

const useTags = () => {
  const { data: session, status } = useSession();
  const [tags, setTags] = useState([] as Tag[]);
  const [loading, setLoading] = useState(true);

  const fetchTags = useCallback(async () => {
    if (!session || !session.user) return;
    setLoading(true);

    try {
      const tags = await api.get("/tags", {
        params: { user_id: session?.user.id },
      });
      setTags(tags.data);
      console.info("[INFO] tags fetched");
    } catch (error) {
      console.error("[ERROR] fetching tags:", error);
    } finally {
      setLoading(false);
    }
  }, [session]);

  const addTag = useCallback(
    async (name: string) => {
      try {
        const { data: response } = await api.post("/tags", {
          tag: {
            name,
            userId: session?.user.id,
          },
        });
        fetchTags();
        console.info("[INFO] tag added");
        return response.tag;
      } catch (error) {
        console.error("[ERROR] adding new tag : ", error);
        return undefined;
      }
    },
    [fetchTags, session]
  );

  // Automatically fetch once session is ready
  useEffect(() => {
    if (status === "authenticated") {
      fetchTags();
    }
  }, [status, fetchTags]);

  return { tags, loading, fetchTags, addTag };
};

export default useTags;
