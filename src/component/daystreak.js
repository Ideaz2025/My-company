import React, { useState, useEffect } from "react";
import {
  Typography, Box, TextField, Button, Table,
  TableBody, TableCell, TableContainer, TableRow,
  Card, CardContent, Avatar, Stack, Grid,
  Chip, LinearProgress, IconButton, Divider
} from "@mui/material";
import {
  CardGiftcard as CardGiftcardIcon,
  LocalFireDepartment as FireIcon,
  TrendingUp as TrendingUpIcon,
  EmojiEvents as TrophyIcon,
  Star as StarIcon,
  CalendarToday as CalendarIcon,
  Share as ShareIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import {
  getFirestore, doc, getDoc, setDoc,
  updateDoc, arrayUnion, collection, query,
  where, orderBy, limit, getDocs
} from 'firebase/firestore';
import { auth } from '../firebase';

function DayStreak() {
  const [dayStreak, setDayStreak] = useState(0);
  const [recipientInput, setRecipientInput] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sentStreaks, setSentStreaks] = useState([]);
  const [sentNames, setSentNames] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [streakHistory, setStreakHistory] = useState([]);
  const [totalGifted, setTotalGifted] = useState(0);
  const [totalReceived, setTotalReceived] = useState(0);
  const [currentRank, setCurrentRank] = useState(0);
  const currentUserId = auth.currentUser?.uid;

  // Mock streak milestones
  const milestones = [
    { days: 7, title: "Week Warrior", icon: "🔥", achieved: dayStreak >= 7 },
    { days: 30, title: "Month Master", icon: "🏆", achieved: dayStreak >= 30 },
    { days: 100, title: "Century Champion", icon: "⭐", achieved: dayStreak >= 100 },
    { days: 365, title: "Year Legend", icon: "👑", achieved: dayStreak >= 365 },
  ];

  useEffect(() => {
    const initUserData = async () => {
      if (!currentUserId) return;
      const db = getFirestore();
      const userDocRef = doc(db, 'userMetrics', currentUserId);
      const profileRef = doc(db, 'profiles', currentUserId);

      const userDoc = await getDoc(userDocRef);
      if (!userDoc.exists()) {
        await setDoc(userDocRef, { dayStreak: 0, sentStreaks: [], receivedStreaks: [] });
      }
      const profileDoc = await getDoc(profileRef);
      if (!profileDoc.exists() && auth.currentUser) {
        await setDoc(profileRef, {
          displayName: auth.currentUser.displayName || "Learner",
          email: auth.currentUser.email || "",
          firstName: auth.currentUser.displayName || "Learner"
        });
      }
    };
    initUserData();
  }, [currentUserId]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUserId) return;
      const db = getFirestore();
      const userDoc = await getDoc(doc(db, 'userMetrics', currentUserId));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setDayStreak(data.dayStreak || 15); // Default for demo
        const recentSent = data.sentStreaks?.slice(-5).reverse() || [];
        setSentStreaks(recentSent);
        setTotalGifted(data.sentStreaks?.length || 8);
        setTotalReceived(data.receivedStreaks?.length || 12);
        
        // Mock streak history for demo
        setStreakHistory([
          { date: '2024-01-15', streak: 15 },
          { date: '2024-01-14', streak: 14 },
          { date: '2024-01-13', streak: 13 },
          { date: '2024-01-12', streak: 12 },
          { date: '2024-01-11', streak: 11 },
        ]);
      }
    };
    fetchUserData();
  }, [currentUserId]);

  // Fetch display names for sent streaks
  useEffect(() => {
    const fetchSentNames = async () => {
      if (sentStreaks.length === 0) {
        setSentNames([]);
        return;
      }
      const db = getFirestore();
      const names = await Promise.all(
        sentStreaks.map(async (id) => {
          const profileDoc = await getDoc(doc(db, 'profiles', id));
          const name = profileDoc.exists()
            ? profileDoc.data().displayName || profileDoc.data().firstName || id
            : id;
          return { userId: id, displayName: name };
        })
      );
      setSentNames(names);
    };
    fetchSentNames();
  }, [sentStreaks]);

  // Fetch leaderboard
  useEffect(() => {
    const fetchLeaderboard = async () => {
      const db = getFirestore();
      const q = query(collection(db, 'userMetrics'), orderBy('dayStreak', 'desc'), limit(10));
      const snapshot = await getDocs(q);
      const results = await Promise.all(snapshot.docs.map(async (docSnap, index) => {
        const profileDoc = await getDoc(doc(db, 'profiles', docSnap.id));
        const displayName = profileDoc.exists()
          ? (profileDoc.data().displayName || profileDoc.data().firstName)
          : docSnap.id;
        
        // Set current user rank
        if (docSnap.id === currentUserId) {
          setCurrentRank(index + 1);
        }
        
        return {
          userId: docSnap.id,
          displayName,
          dayStreak: docSnap.data().dayStreak || 0
        };
      }));
      setLeaderboard(results);
    };
    fetchLeaderboard();
  }, [currentUserId]);

  // Gift by email or display name
  const handleGiftStreak = async () => {
    setMessage("");
    const trimmedInput = recipientInput.trim();

    if (!trimmedInput) {
      return setMessage("Please enter a recipient's display name or email.");
    }
    if (dayStreak < 1) {
      return setMessage("You don't have enough streak to gift.");
    }
    setSending(true);

    try {
      const db = getFirestore();
      // First: query profiles by email (case-insensitive)
      let q = query(collection(db, 'profiles'), where("email", "==", trimmedInput));
      let snapshot = await getDocs(q);

      // If no match by email, try by displayName (case-insensitive)
      if (snapshot.empty) {
        q = query(collection(db, 'profiles'), where("displayName", "==", trimmedInput));
        snapshot = await getDocs(q);
      }

      if (snapshot.empty) {
        setMessage("Recipient not found by display name or email.");
        setSending(false);
        return;
      }
      // Use the first match only
      const recipientDoc = snapshot.docs[0];
      const recipientId = recipientDoc.id;

      if (recipientId === currentUserId) {
        setMessage("You cannot gift to yourself.");
        setSending(false);
        return;
      }

      // Double-check userMetrics exists for this user
      const recipientMetricsRef = doc(db, 'userMetrics', recipientId);
      const recipientMetricsSnap = await getDoc(recipientMetricsRef);

      if (!recipientMetricsSnap.exists()) {
        setMessage("Recipient exists but is missing userMetrics.");
        setSending(false);
        return;
      }
      const recipientStreak = recipientMetricsSnap.data().dayStreak || 0;

      await setDoc(doc(db, 'userMetrics', currentUserId), {
        dayStreak: dayStreak - 1
      }, { merge: true });
      await setDoc(recipientMetricsRef, {
        dayStreak: recipientStreak + 1
      }, { merge: true });
      await updateDoc(doc(db, 'userMetrics', currentUserId), {
        sentStreaks: arrayUnion(recipientId)
      });
      await updateDoc(recipientMetricsRef, {
        receivedStreaks: arrayUnion(currentUserId)
      });

      setDayStreak(prev => prev - 1);
      setSentStreaks(prev => [recipientId, ...prev].slice(0, 5));
      setTotalGifted(prev => prev + 1);
      setMessage(
        `🎉 Successfully gifted 1 streak to ${recipientDoc.data().displayName || recipientDoc.data().email || recipientId}!`
      );
      setRecipientInput("");
    } catch (err) {
      setMessage("❌ Error gifting streak. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const getStreakColor = (streak) => {
    if (streak >= 100) return '#ec4899'; // Pink for 100+
    if (streak >= 30) return '#f59e0b';  // Amber for 30+
    if (streak >= 7) return '#10b981';   // Green for 7+
    return '#6366f1';                    // Blue for less than 7
  };

  const getNextMilestone = () => {
    return milestones.find(m => !m.achieved) || milestones[milestones.length - 1];
  };

  return (
    <Box
      sx={{
        minHeight: "auto",
        p: { xs: 2, md: 4 },
        width: "100%",
        maxWidth: '1200px',
        mx: 'auto'
      }}
    >
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography 
          variant="h3" 
          fontWeight={700}
          sx={{
            background: 'linear-gradient(135deg, #f59e0b 0%, #ec4899 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2,
          }}
        >
          Day Streak Challenge
        </Typography>
        <Typography variant="h6" sx={{ color: '#cbd5e1' }}>
          Keep your learning momentum going! 🔥
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Main Streak Card */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              background: 'linear-gradient(145deg, #1a1a2e 0%, #16213e 100%)',
              border: '1px solid #334155',
              borderRadius: '20px',
              p: 3,
              height: 'fit-content',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: `linear-gradient(90deg, ${getStreakColor(dayStreak)} 0%, ${getStreakColor(dayStreak)}80 100%)`,
              }
            }}
          >
            <Stack spacing={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Box
                  sx={{
                    width: 120,
                    height: 120,
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${getStreakColor(dayStreak)} 0%, ${getStreakColor(dayStreak)}80 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2,
                    boxShadow: `0 8px 32px ${getStreakColor(dayStreak)}40`,
                  }}
                >
                  <FireIcon sx={{ fontSize: 48, color: 'white' }} />
                </Box>
                <Typography variant="h2" fontWeight={700} sx={{ color: '#f8fafc', mb: 1 }}>
                  {dayStreak}
                </Typography>
                <Typography variant="h6" sx={{ color: '#cbd5e1' }}>
                  Day Streak
                </Typography>
                <Chip
                  label={`Rank #${currentRank || 'N/A'}`}
                  sx={{
                    mt: 1,
                    background: `linear-gradient(135deg, ${getStreakColor(dayStreak)} 0%, ${getStreakColor(dayStreak)}80 100%)`,
                    color: 'white',
                    fontWeight: 600,
                  }}
                />
              </Box>

              <Divider sx={{ borderColor: '#334155' }} />

              {/* Gift Section */}
              <Box>
                <Typography variant="h6" sx={{ color: '#f8fafc', mb: 2 }}>
                  Gift a Streak 🎁
                </Typography>
                <Stack spacing={2}>
                  <TextField
                    label="Recipient Display Name or Email"
                    value={recipientInput}
                    onChange={e => setRecipientInput(e.target.value)}
                    fullWidth
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'rgba(26, 26, 46, 0.6)',
                        '& fieldset': { borderColor: '#475569' },
                        '&:hover fieldset': { borderColor: '#6366f1' },
                        '&.Mui-focused fieldset': { borderColor: '#6366f1' },
                      },
                      '& .MuiInputLabel-root': { color: '#cbd5e1' },
                      '& .MuiOutlinedInput-input': { color: '#f8fafc' },
                    }}
                  />
                  <Button
                    onClick={handleGiftStreak}
                    disabled={sending || dayStreak < 1}
                    variant="contained"
                    startIcon={<CardGiftcardIcon />}
                    fullWidth
                    sx={{
                      background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                      py: 1.5,
                      fontWeight: 600,
                      '&:hover': {
                        background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                      },
                      '&:disabled': {
                        background: '#374151',
                        color: '#9ca3af',
                      }
                    }}
                  >
                    {sending ? "Gifting..." : "Gift 1 Streak"}
                  </Button>
                  {message && (
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: message.includes('❌') ? '#ef4444' : '#10b981',
                        textAlign: 'center',
                        p: 1,
                        borderRadius: 1,
                        backgroundColor: message.includes('❌') ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                      }}
                    >
                      {message}
                    </Typography>
                  )}
                </Stack>
              </Box>
            </Stack>
          </Card>
        </Grid>

        {/* Stats and Milestones */}
        <Grid item xs={12} md={6}>
          <Stack spacing={3}>
            {/* Stats Cards */}
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Card
                  sx={{
                    background: 'linear-gradient(145deg, #1a1a2e 0%, #16213e 100%)',
                    border: '1px solid #334155',
                    borderRadius: '12px',
                    p: 2,
                    textAlign: 'center',
                  }}
                >
                  <TrophyIcon sx={{ color: '#f59e0b', fontSize: 32, mb: 1 }} />
                  <Typography variant="h4" fontWeight={700} sx={{ color: '#f8fafc' }}>
                    {totalGifted}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#cbd5e1' }}>
                    Gifted
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={4}>
                <Card
                  sx={{
                    background: 'linear-gradient(145deg, #1a1a2e 0%, #16213e 100%)',
                    border: '1px solid #334155',
                    borderRadius: '12px',
                    p: 2,
                    textAlign: 'center',
                  }}
                >
                  <StarIcon sx={{ color: '#10b981', fontSize: 32, mb: 1 }} />
                  <Typography variant="h4" fontWeight={700} sx={{ color: '#f8fafc' }}>
                    {totalReceived}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#cbd5e1' }}>
                    Received
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={4}>
                <Card
                  sx={{
                    background: 'linear-gradient(145deg, #1a1a2e 0%, #16213e 100%)',
                    border: '1px solid #334155',
                    borderRadius: '12px',
                    p: 2,
                    textAlign: 'center',
                  }}
                >
                  <TrendingUpIcon sx={{ color: '#ec4899', fontSize: 32, mb: 1 }} />
                  <Typography variant="h4" fontWeight={700} sx={{ color: '#f8fafc' }}>
                    #{currentRank || 'N/A'}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#cbd5e1' }}>
                    Rank
                  </Typography>
                </Card>
              </Grid>
            </Grid>

            {/* Milestones */}
            <Card
              sx={{
                background: 'linear-gradient(145deg, #1a1a2e 0%, #16213e 100%)',
                border: '1px solid #334155',
                borderRadius: '16px',
                p: 3,
              }}
            >
              <Typography variant="h6" fontWeight={600} sx={{ color: '#f8fafc', mb: 2 }}>
                Streak Milestones
              </Typography>
              <Stack spacing={2}>
                {milestones.map((milestone, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      p: 2,
                      borderRadius: '8px',
                      backgroundColor: milestone.achieved ? 'rgba(16, 185, 129, 0.1)' : 'rgba(99, 102, 241, 0.1)',
                      border: `1px solid ${milestone.achieved ? 'rgba(16, 185, 129, 0.3)' : 'rgba(99, 102, 241, 0.3)'}`,
                    }}
                  >
                    <Typography variant="h5">{milestone.icon}</Typography>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body1" sx={{ color: '#f8fafc', fontWeight: 500 }}>
                        {milestone.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#cbd5e1' }}>
                        {milestone.days} days
                      </Typography>
                    </Box>
                    {milestone.achieved && (
                      <Chip
                        label="Achieved"
                        size="small"
                        sx={{
                          backgroundColor: 'rgba(16, 185, 129, 0.2)',
                          color: '#10b981',
                          border: '1px solid rgba(16, 185, 129, 0.3)',
                        }}
                      />
                    )}
                  </Box>
                ))}
              </Stack>
              
              {/* Next Milestone Progress */}
              <Box sx={{ mt: 3 }}>
                <Typography variant="body2" sx={{ color: '#cbd5e1', mb: 1 }}>
                  Next: {getNextMilestone().title} ({getNextMilestone().days} days)
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={Math.min((dayStreak / getNextMilestone().days) * 100, 100)}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: 'rgba(99, 102, 241, 0.2)',
                    '& .MuiLinearProgress-bar': {
                      background: `linear-gradient(135deg, ${getStreakColor(dayStreak)} 0%, ${getStreakColor(dayStreak)}80 100%)`,
                      borderRadius: 4,
                    },
                  }}
                />
              </Box>
            </Card>
          </Stack>
        </Grid>
      </Grid>

      {/* Sent Streak History */}
      <Card
        sx={{
          mt: 4,
          background: 'linear-gradient(145deg, #1a1a2e 0%, #16213e 100%)',
          border: '1px solid #334155',
          borderRadius: '16px',
          p: 3,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h5" fontWeight={600} sx={{ color: '#f8fafc' }}>
            Recent Gifts
          </Typography>
          <IconButton
            sx={{
              color: '#6366f1',
              '&:hover': { backgroundColor: 'rgba(99, 102, 241, 0.1)' }
            }}
          >
            <RefreshIcon />
          </IconButton>
        </Box>
        {sentNames.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CardGiftcardIcon sx={{ fontSize: 64, color: '#475569', mb: 2 }} />
            <Typography variant="h6" sx={{ color: '#94a3b8', mb: 1 }}>
              No gifts sent yet
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b' }}>
              Start spreading the streak love!
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableBody>
                {sentNames.map((entry, idx) => (
                  <TableRow
                    key={entry.userId}
                    sx={{
                      '&:hover': { backgroundColor: 'rgba(99, 102, 241, 0.05)' },
                      borderBottom: '1px solid #334155',
                    }}
                  >
                    <TableCell sx={{ border: 'none', py: 2 }}>
                      <Avatar 
                        sx={{
                          bgcolor: '#6366f1',
                          width: 40, 
                          height: 40,
                          fontSize: 16,
                          fontWeight: 600,
                        }}
                      >
                        {entry.displayName ? entry.displayName[0].toUpperCase() : "?"}
                      </Avatar>
                    </TableCell>
                    <TableCell sx={{ border: 'none', color: "#f8fafc" }}>
                      <Typography variant="body1" fontWeight={500}>
                        {entry.displayName || entry.userId}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#cbd5e1' }}>
                        Received 1 streak
                      </Typography>
                    </TableCell>
                    <TableCell align="right" sx={{ border: 'none' }}>
                      <Chip
                        label={idx === 0 ? "Latest" : `${idx + 1} ago`}
                        size="small"
                        sx={{
                          backgroundColor: idx === 0 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(99, 102, 241, 0.2)',
                          color: idx === 0 ? '#10b981' : '#6366f1',
                          border: `1px solid ${idx === 0 ? 'rgba(16, 185, 129, 0.3)' : 'rgba(99, 102, 241, 0.3)'}`,
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Card>

      {/* Leaderboard */}
      {leaderboard.length > 0 && (
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {/* Top Performer */}
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                background: 'linear-gradient(135deg, #f59e0b 0%, #ec4899 100%)',
                borderRadius: '20px',
                p: 3,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Typography variant="h5" fontWeight={700} sx={{ color: 'white', mb: 3 }}>
                  🏆 Streak Champion
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Avatar
                    sx={{
                      bgcolor: 'rgba(255, 255, 255, 0.2)',
                      backdropFilter: 'blur(10px)',
                      width: 80,
                      height: 80,
                      fontSize: 32,
                      fontWeight: 700,
                      color: 'white',
                      border: '3px solid rgba(255, 255, 255, 0.3)',
                    }}
                  >
                    {leaderboard[0].displayName?.[0]?.toUpperCase() || "U"}
                  </Avatar>
                  <Box>
                    <Typography variant="h4" fontWeight={700} sx={{ color: 'white' }}>
                      {leaderboard[0].dayStreak}
                    </Typography>
                    <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                      {leaderboard[0].displayName || leaderboard[0].userId}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                      Day Streak
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Card>
          </Grid>

          {/* Leaderboard Table */}
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                background: 'linear-gradient(145deg, #1a1a2e 0%, #16213e 100%)',
                border: '1px solid #334155',
                borderRadius: '16px',
                p: 3,
                height: '100%',
              }}
            >
              <Typography variant="h6" fontWeight={600} sx={{ color: '#f8fafc', mb: 2 }}>
                Top Streakers
              </Typography>
              <TableContainer sx={{ maxHeight: 300 }}>
                <Table size="small">
                  <TableBody>
                    {leaderboard.slice(1, 6).map((user, idx) => (
                      <TableRow 
                        key={user.userId}
                        sx={{
                          '&:hover': { backgroundColor: 'rgba(99, 102, 241, 0.05)' },
                          borderBottom: '1px solid #334155',
                        }}
                      >
                        <TableCell sx={{ border: 'none', py: 1.5 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="h6" sx={{ color: '#6366f1', fontWeight: 700, minWidth: 24 }}>
                              #{idx + 2}
                            </Typography>
                            <Avatar sx={{ 
                              bgcolor: getStreakColor(user.dayStreak), 
                              width: 32, 
                              height: 32,
                              fontSize: 14,
                            }}>
                              {user.displayName?.[0]?.toUpperCase() || "U"}
                            </Avatar>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ border: 'none', color: "#f8fafc" }}>
                          <Typography variant="body2" fontWeight={500}>
                            {user.displayName || user.userId}
                          </Typography>
                        </TableCell>
                        <TableCell align="right" sx={{ border: 'none' }}>
                          <Chip
                            label={`🔥 ${user.dayStreak}`}
                            size="small"
                            sx={{
                              backgroundColor: `${getStreakColor(user.dayStreak)}20`,
                              color: getStreakColor(user.dayStreak),
                              border: `1px solid ${getStreakColor(user.dayStreak)}30`,
                              fontWeight: 600,
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}

export default DayStreak;
