import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminCheck } from '@/hooks/useAdminCheck';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { LogOut, Shield, Mail, Trash2, TrendingUp, Users, Eye } from 'lucide-react';
import { format, subDays, startOfDay, endOfDay, startOfWeek, startOfMonth } from 'date-fns';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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

  useEffect(() => {
    if (isAdmin) {
      fetchMessages();
      fetchAnalytics();
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
      </div>
    </div>
  );
};

export default Owner;
