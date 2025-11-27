import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useToast } from "@/components/ui/use-toast";

export interface ChatMessage {
  id: string;
  user_id: string;
  content: string | null;
  message_type: "text" | "image" | "video" | "voice";
  media_url: string | null;
  created_at: string;
  is_admin: boolean;
}

export const useChatMessages = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) return;

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching messages:", error);
        toast({ title: "Error loading messages", variant: "destructive" });
      } else {
        setMessages(data as ChatMessage[]);
      }
      setLoading(false);
    };

    fetchMessages();

    // Subscribe to realtime updates
    const channel = supabase
      .channel("chat-messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as ChatMessage]);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "chat_messages",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          setMessages((prev) => prev.filter((m) => m.id !== payload.old.id));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, toast]);

  const sendMessage = async (
    content: string | null,
    messageType: "text" | "image" | "video" | "voice",
    mediaUrl: string | null = null
  ) => {
    if (!user) return;

    const { error } = await supabase.from("chat_messages").insert({
      user_id: user.id,
      content,
      message_type: messageType,
      media_url: mediaUrl,
    });

    if (error) {
      console.error("Error sending message:", error);
      toast({ title: "Error sending message", variant: "destructive" });
    }
  };

  const deleteMessage = async (id: string) => {
    const { error } = await supabase.from("chat_messages").delete().eq("id", id);

    if (error) {
      console.error("Error deleting message:", error);
      toast({ title: "Error deleting message", variant: "destructive" });
    }
  };

  const uploadMedia = async (file: File, type: "image" | "video" | "voice"): Promise<string | null> => {
    if (!user) return null;

    const fileExt = file.name.split(".").pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("chat-media")
      .upload(fileName, file);

    if (uploadError) {
      console.error("Error uploading file:", uploadError);
      toast({ title: "Error uploading file", variant: "destructive" });
      return null;
    }

    const { data } = supabase.storage.from("chat-media").getPublicUrl(fileName);
    return data.publicUrl;
  };

  return { messages, loading, sendMessage, deleteMessage, uploadMedia };
};
