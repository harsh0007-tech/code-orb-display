import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminCheck } from '@/hooks/useAdminCheck';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { LogOut, Shield, Mail, Trash2, TrendingUp, Users, Eye, User, MessageCircle, Image, Video, Mic, Send } from 'lucide-react';
import { format, subDays, startOfDay, endOfDay, startOfWeek, startOfMonth } from 'date-fns';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Textarea } from '@/components/ui/textarea';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  mobile_number: string | null;
  message: string;
  created_at: string;
}

interface PageVisit {
  id: string;
  visitor_id: string;
  page_path: string;
  user_agent: string;
  referrer: string;
  created_at: string;
}

interface AnalyticsStats {
  totalVisits: number;
  uniqueVisitors: number;
  todayVisits: number;
  weekVisits: number;
  monthVisits: number;
}

interface UserProfile {
  id: string;
  email: string;
  created_at: string;
}

interface ChatMessage {
  id: string;
  user_id: string;
  content: string | null;
  message_type: string;
  media_url: string | null;
  created_at: string;
  user_email?: string;
  is_admin?: boolean;
}

const Owner = () => {
  const { isAdmin, loading } = useAdminCheck();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(true);
  const [visits, setVisits] = useState<PageVisit[]>([]);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [stats, setStats] = useState<AnalyticsStats>({
    totalVisits: 0,
    uniqueVisitors: 0,
    todayVisits: 0,
    weekVisits: 0,
    monthVisits: 0,
  });
  const [openSections, setOpenSections] = useState<string[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatMessagesLoading, setChatMessagesLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<string>('');

  useEffect(() => {
    if (isAdmin) {
      fetchMessages();
      fetchAnalytics();
      fetchUsers();
      fetchChatMessages();
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

  const fetchAnalytics = async () => {
    try {
      const { data, error } = await supabase
        .from('page_visits')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const visitsData = data || [];
      setVisits(visitsData);

      // Calculate stats
      const now = new Date();
      const todayStart = startOfDay(now);
      const weekStart = startOfWeek(now);
      const monthStart = startOfMonth(now);

      const uniqueVisitorIds = new Set(visitsData.map(v => v.visitor_id));
      
      setStats({
        totalVisits: visitsData.length,
        uniqueVisitors: uniqueVisitorIds.size,
        todayVisits: visitsData.filter(v => new Date(v.created_at) >= todayStart).length,
        weekVisits: visitsData.filter(v => new Date(v.created_at) >= weekStart).length,
        monthVisits: visitsData.filter(v => new Date(v.created_at) >= monthStart).length,
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setUsersLoading(false);
    }
  };

  const fetchChatMessages = async () => {
    try {
      const { data: messagesData, error: messagesError } = await supabase
        .from('chat_messages')
        .select('*')
        .order('created_at', { ascending: true }); // Changed to ascending for proper grouping

      if (messagesError) throw messagesError;

      // Get user emails for each message
      const userIds = [...new Set((messagesData || []).map(m => m.user_id))];
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, email')
        .in('id', userIds);

      const emailMap = new Map(profilesData?.map(p => [p.id, p.email]) || []);

      const messagesWithEmails = (messagesData || []).map(msg => ({
        ...msg,
        user_email: emailMap.get(msg.user_id) || 'Unknown'
      }));

      setChatMessages(messagesWithEmails);
    } catch (error) {
      console.error('Error fetching chat messages:', error);
    } finally {
      setChatMessagesLoading(false);
    }
  };

  // Group messages: user message followed by admin replies
  const groupMessages = () => {
    const groups: { userMessage: ChatMessage; adminReplies: ChatMessage[] }[] = [];
    
    chatMessages.forEach((msg) => {
      if (!msg.is_admin) {
        // It's a user message, create a new group
        groups.push({
          userMessage: msg,
          adminReplies: []
        });
      } else {
        // It's an admin reply, add to the last group for this user
        const lastGroupForUser = [...groups].reverse().find(
          g => g.userMessage.user_id === msg.user_id
        );
        if (lastGroupForUser) {
          lastGroupForUser.adminReplies.push(msg);
        }
      }
    });

    return groups.reverse(); // Show newest first
  };

  const handleDeleteChatMessage = async (id: string) => {
    try {
      const { error } = await supabase
        .from('chat_messages')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setChatMessages(chatMessages.filter(msg => msg.id !== id));
      toast({
        title: 'Success',
        description: 'Chat message deleted successfully.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete chat message.',
      });
    }
  };

  const handleReplyToMessage = async (userId: string, userEmail: string) => {
    if (!replyText.trim()) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Reply message cannot be empty.',
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          user_id: userId,
          content: replyText,
          message_type: 'text',
          is_admin: true,
        })
        .select()
        .single();

      if (error) throw error;

      // Add the new reply to the chat messages list immediately
      const newMessage = {
        ...data,
        user_email: userEmail,
        is_admin: true,
      };
      setChatMessages([...chatMessages, newMessage]);

      toast({
        title: 'Success',
        description: 'Reply sent successfully.',
      });
      
      setReplyText('');
      setReplyingTo(null);
    } catch (error) {
      console.error('Error sending reply:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to send reply.',
      });
    }
  };

  // Prepare chart data
  const getDailyVisitsData = () => {
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = subDays(new Date(), 29 - i);
      return {
        date: format(date, 'MMM dd'),
        visits: visits.filter(v => {
          const visitDate = new Date(v.created_at);
          return visitDate >= startOfDay(date) && visitDate <= endOfDay(date);
        }).length,
      };
    });
    return last30Days;
  };

  const getPopularPagesData = () => {
    const pageCounts: Record<string, number> = {};
    visits.forEach(v => {
      pageCounts[v.page_path] = (pageCounts[v.page_path] || 0) + 1;
    });
    
    return Object.entries(pageCounts)
      .map(([page, visits]) => ({ page, visits }))
      .sort((a, b) => b.visits - a.visits)
      .slice(0, 5);
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

  const toggleSection = (section: string) => {
    setOpenSections(prev => 
      prev.includes(section) 
        ? [] // Close if already open
        : [section] // Open only this section, closing others
    );
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
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="glass rounded-2xl p-8">
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
        </div>

        {/* Section Navigation */}
        <div className="glass rounded-2xl p-6">
          <div className="flex gap-4 flex-wrap">
            <Button
              variant={openSections.includes("analytics") ? "default" : "outline"}
              onClick={() => toggleSection("analytics")}
              className="flex items-center gap-2"
            >
              <TrendingUp className="w-4 h-4" />
              Analytics & Statistics
            </Button>
            <Button
              variant={openSections.includes("messages") ? "default" : "outline"}
              onClick={() => toggleSection("messages")}
              className="flex items-center gap-2"
            >
              <Mail className="w-4 h-4" />
              Contact Messages
            </Button>
            <Button
              variant={openSections.includes("users") ? "default" : "outline"}
              onClick={() => toggleSection("users")}
              className="flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              Users
            </Button>
            <Button
              variant={openSections.includes("chatMessages") ? "default" : "outline"}
              onClick={() => toggleSection("chatMessages")}
              className="flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              Received Chat Messages
            </Button>
          </div>
        </div>

        {/* Analytics Section */}
        {openSections.includes("analytics") && (
          <div className="glass rounded-2xl p-8 space-y-8 animate-fade-in">
            <div className="flex items-center gap-3 border-b border-border pb-4">
              <TrendingUp className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">Analytics & Statistics</h2>
            </div>
            
            {/* Statistics Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="glass rounded-xl p-6 space-y-2">
                <div className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">Total Visits</h3>
                </div>
                <p className="text-3xl font-bold text-primary">{analyticsLoading ? '...' : stats.totalVisits}</p>
                <p className="text-sm text-muted-foreground">All time page views</p>
              </div>

              <div className="glass rounded-xl p-6 space-y-2">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">Unique Visitors</h3>
                </div>
                <p className="text-3xl font-bold text-primary">{analyticsLoading ? '...' : stats.uniqueVisitors}</p>
                <p className="text-sm text-muted-foreground">Distinct visitors</p>
              </div>

              <div className="glass rounded-xl p-6 space-y-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">Today</h3>
                </div>
                <p className="text-3xl font-bold text-primary">{analyticsLoading ? '...' : stats.todayVisits}</p>
                <p className="text-sm text-muted-foreground">Visits today</p>
              </div>

              <div className="glass rounded-xl p-6 space-y-2">
                <h3 className="text-lg font-semibold text-foreground">This Week</h3>
                <p className="text-3xl font-bold text-primary">{analyticsLoading ? '...' : stats.weekVisits}</p>
                <p className="text-sm text-muted-foreground">Last 7 days</p>
              </div>

              <div className="glass rounded-xl p-6 space-y-2">
                <h3 className="text-lg font-semibold text-foreground">This Month</h3>
                <p className="text-3xl font-bold text-primary">{analyticsLoading ? '...' : stats.monthVisits}</p>
                <p className="text-sm text-muted-foreground">Current month</p>
              </div>

              <div className="glass rounded-xl p-6 space-y-2">
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">Messages</h3>
                </div>
                <p className="text-3xl font-bold text-primary">{messages.length}</p>
                <p className="text-sm text-muted-foreground">Contact forms</p>
              </div>
            </div>

            {/* Charts Section */}
            {!analyticsLoading && visits.length > 0 && (
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Daily Visits Chart */}
                <div className="glass rounded-2xl p-8 space-y-6">
                  <div className="flex items-center gap-3 border-b border-border pb-4">
                    <TrendingUp className="w-6 h-6 text-primary" />
                    <h2 className="text-2xl font-bold text-foreground">Visit Trends</h2>
                  </div>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={getDailyVisitsData()}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis 
                        dataKey="date" 
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                      />
                      <YAxis 
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'hsl(var(--background))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="visits" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2}
                        dot={{ fill: 'hsl(var(--primary))' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Popular Pages Chart */}
                <div className="glass rounded-2xl p-8 space-y-6">
                  <div className="flex items-center gap-3 border-b border-border pb-4">
                    <Eye className="w-6 h-6 text-primary" />
                    <h2 className="text-2xl font-bold text-foreground">Popular Pages</h2>
                  </div>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={getPopularPagesData()}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis 
                        dataKey="page" 
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                      />
                      <YAxis 
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'hsl(var(--background))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                      />
                      <Bar 
                        dataKey="visits" 
                        fill="hsl(var(--primary))" 
                        radius={[8, 8, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Users Section */}
        {openSections.includes("users") && (
          <div className="glass rounded-2xl p-8 space-y-6 animate-fade-in">
            <div className="flex items-center gap-3 border-b border-border pb-4">
              <Users className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">Registered Users</h2>
              <span className="ml-auto text-sm text-muted-foreground">
                {users.length} total users
              </span>
            </div>
            
            {usersLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Loading users...</p>
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-lg text-muted-foreground">No users yet.</p>
                <p className="text-sm text-muted-foreground mt-2">Users who sign up will appear here.</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {users.map((user) => (
                  <div key={user.id} className="glass rounded-xl p-6 space-y-3 hover:glass-strong transition-all duration-300">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{user.email}</p>
                        <p className="text-xs text-muted-foreground">
                          Joined {format(new Date(user.created_at), 'PP')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Contact Messages Section */}
        {openSections.includes("messages") && (
          <div className="glass rounded-2xl p-8 space-y-6 animate-fade-in">
            <div className="flex items-center gap-3 border-b border-border pb-4">
              <Mail className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">Contact Messages</h2>
            </div>
            
            {messagesLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Loading messages...</p>
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-12">
                <Mail className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-lg text-muted-foreground">No messages yet.</p>
                <p className="text-sm text-muted-foreground mt-2">Messages from your contact form will appear here.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className="glass rounded-xl p-6 space-y-3 hover:glass-strong transition-all duration-300">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <h3 className="font-semibold text-lg text-foreground">{msg.name}</h3>
                        <p className="text-sm text-primary">{msg.email}</p>
                        {msg.mobile_number && (
                          <p className="text-sm text-muted-foreground">📱 {msg.mobile_number}</p>
                        )}
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
                    <div className="pt-3 border-t border-border">
                      <p className="text-foreground whitespace-pre-wrap leading-relaxed">{msg.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Chat Messages Section */}
        {openSections.includes("chatMessages") && (
          <div className="glass rounded-2xl p-8 space-y-6 animate-fade-in">
            <div className="flex items-center gap-3 border-b border-border pb-4">
              <MessageCircle className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">Received Chat Messages</h2>
              <span className="ml-auto text-sm text-muted-foreground">
                {chatMessages.length} messages
              </span>
            </div>
            
            {chatMessagesLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Loading chat messages...</p>
              </div>
            ) : chatMessages.length === 0 ? (
              <div className="text-center py-12">
                <MessageCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-lg text-muted-foreground">No chat messages yet.</p>
                <p className="text-sm text-muted-foreground mt-2">Messages from users will appear here.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {groupMessages().map((group) => (
                  <div key={group.userMessage.id} className="glass rounded-xl p-6 space-y-4 hover:glass-strong transition-all duration-300">
                    {/* User Message Header */}
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-primary" />
                          <p className="text-sm font-medium text-foreground">{group.userMessage.user_email}</p>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          {group.userMessage.message_type === 'image' && <Image className="w-3 h-3" />}
                          {group.userMessage.message_type === 'video' && <Video className="w-3 h-3" />}
                          {group.userMessage.message_type === 'voice' && <Mic className="w-3 h-3" />}
                          <span className="capitalize">{group.userMessage.message_type}</span>
                          <span>•</span>
                          <span>{format(new Date(group.userMessage.created_at), 'PPpp')}</span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteChatMessage(group.userMessage.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* User Message Content */}
                    <div className="border-t border-border pt-3">
                      {group.userMessage.content && (
                        <p className="text-foreground whitespace-pre-wrap leading-relaxed">{group.userMessage.content}</p>
                      )}
                      {group.userMessage.media_url && group.userMessage.message_type === 'image' && (
                        <img src={group.userMessage.media_url} alt="Chat image" className="max-w-md rounded-lg mt-2" />
                      )}
                      {group.userMessage.media_url && group.userMessage.message_type === 'video' && (
                        <video src={group.userMessage.media_url} controls className="max-w-md rounded-lg mt-2" />
                      )}
                      {group.userMessage.media_url && group.userMessage.message_type === 'voice' && (
                        <audio src={group.userMessage.media_url} controls className="mt-2 w-full max-w-md" />
                      )}
                    </div>

                    {/* Admin Replies */}
                    {group.adminReplies.length > 0 && (
                      <div className="space-y-3 pl-4 border-l-2 border-primary/30">
                        {group.adminReplies.map((reply) => (
                          <div key={reply.id} className="bg-secondary/30 rounded-lg p-4 space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Shield className="w-4 h-4 text-primary" />
                                <p className="text-sm font-medium text-primary">Admin Reply</p>
                                <span className="text-xs text-muted-foreground">
                                  {format(new Date(reply.created_at), 'PPpp')}
                                </span>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteChatMessage(reply.id)}
                                className="h-6 w-6 text-destructive hover:text-destructive hover:bg-destructive/10"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                            {reply.content && (
                              <p className="text-foreground whitespace-pre-wrap leading-relaxed text-sm">{reply.content}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Reply Section */}
                    {replyingTo === group.userMessage.id ? (
                      <div className="pt-3 space-y-2 border-t border-border">
                        <Textarea
                          placeholder="Type your reply..."
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          className="min-h-[80px]"
                        />
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleReplyToMessage(group.userMessage.user_id, group.userMessage.user_email || 'Unknown')}
                            size="sm"
                            className="flex items-center gap-2"
                          >
                            <Send className="w-4 h-4" />
                            Send Reply
                          </Button>
                          <Button
                            onClick={() => {
                              setReplyingTo(null);
                              setReplyText('');
                            }}
                            size="sm"
                            variant="outline"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="pt-3 border-t border-border">
                        <Button
                          onClick={() => setReplyingTo(group.userMessage.id)}
                          size="sm"
                          variant="outline"
                          className="flex items-center gap-2"
                        >
                          <MessageCircle className="w-4 h-4" />
                          Reply
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Owner;
