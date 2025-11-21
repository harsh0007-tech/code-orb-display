import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminCheck } from '@/hooks/useAdminCheck';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { LogOut, Shield, Mail, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

const Owner = () => {
  const { isAdmin, loading } = useAdminCheck();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(true);

  useEffect(() => {
    if (isAdmin) {
      fetchMessages();
    }
  }, [isAdmin]);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setMessagesLoading(false);
    }
  };

  const handleDeleteMessage = async (id: string) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setMessages(messages.filter(msg => msg.id !== id));
      toast({
        title: 'Success',
        description: 'Message deleted successfully.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete message.',
      });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: 'Logged out',
      description: 'Successfully logged out.',
    });
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="glass rounded-2xl p-8 max-w-md w-full text-center space-y-4">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
            <Shield className="w-8 h-8 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Access Denied</h1>
          <p className="text-muted-foreground">
            You don't have admin privileges to access this page.
          </p>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => navigate('/')} variant="outline">
              Go Home
            </Button>
            <Button onClick={handleLogout} variant="destructive">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="glass rounded-2xl p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                <Shield className="w-8 h-8 text-primary" />
                Owner Dashboard
              </h1>
              <p className="text-muted-foreground mt-2">
                Welcome to the admin panel
              </p>
            </div>
            <Button onClick={handleLogout} variant="outline">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="glass rounded-xl p-6 space-y-2">
              <h3 className="text-lg font-semibold text-foreground">Statistics</h3>
              <p className="text-3xl font-bold text-primary">0</p>
              <p className="text-sm text-muted-foreground">Total Users</p>
            </div>

            <div className="glass rounded-xl p-6 space-y-2">
              <h3 className="text-lg font-semibold text-foreground">Content</h3>
              <p className="text-3xl font-bold text-primary">0</p>
              <p className="text-sm text-muted-foreground">Total Projects</p>
            </div>

            <div className="glass rounded-xl p-6 space-y-2">
              <h3 className="text-lg font-semibold text-foreground">Messages</h3>
              <p className="text-3xl font-bold text-primary">{messages.length}</p>
              <p className="text-sm text-muted-foreground">Contact Forms</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Contact Messages
              </h2>
            </div>
            
            {messagesLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              </div>
            ) : messages.length === 0 ? (
              <div className="glass rounded-xl p-8 text-center">
                <p className="text-muted-foreground">No messages yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className="glass rounded-xl p-6 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h3 className="font-semibold text-foreground">{msg.name}</h3>
                        <p className="text-sm text-muted-foreground">{msg.email}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(msg.created_at), 'PPpp')}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteMessage(msg.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-foreground whitespace-pre-wrap">{msg.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Owner;
