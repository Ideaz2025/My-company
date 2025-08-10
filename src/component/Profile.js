import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Avatar,
  Typography,
  Divider,
  Button,
  TextField,
  CircularProgress,
  Stack,
  Grid,
  Chip,
  LinearProgress,
  IconButton,
} from "@mui/material";
import {
  Edit as EditIcon,
  School as SchoolIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  CalendarToday as CalendarIcon,
  TrendingUp as TrendingUpIcon,
  EmojiEvents as TrophyIcon,
  Star as StarIcon,
  BookmarkBorder as BookmarkIcon,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { AppProvider } from "@toolpad/core/AppProvider";
import { PageContainer } from "@toolpad/core/PageContainer";
import { auth } from "../firebase";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import Dash from "./Dash";

export default function Profile() {
  const theme = useTheme();
  const user = auth.currentUser;
  const uid = user?.uid;
  const db = getFirestore();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [photoURL, setPhotoURL] = useState(user?.photoURL || "");
  const [phone, setPhone] = useState("");
  const [college, setCollege] = useState("");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState("");
  const [saving, setSaving] = useState(false);

  // Mock data for demonstration - in real app, fetch from database
  const [stats] = useState({
    coursesCompleted: 12,
    totalHours: 156,
    currentStreak: 7,
    achievements: 8,
    rank: "Advanced Learner",
    progress: 75,
  });

  const [recentActivity] = useState([
    { title: "Completed React Fundamentals", date: "2 days ago", type: "course" },
    { title: "Earned JavaScript Expert Badge", date: "1 week ago", type: "achievement" },
    { title: "Started Node.js Masterclass", date: "2 weeks ago", type: "course" },
  ]);

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      if (!uid) return;
      const profileRef = doc(db, "profiles", uid);
      const profileSnap = await getDoc(profileRef);
      if (profileSnap.exists()) {
        const data = profileSnap.data();
        setProfile(data);
        setPhone(data.phone || "");
        setCollege(data.college || "");
        setBio(data.bio || "");
        setSkills(data.skills || "");
      }
      setLoading(false);
    };

    fetchProfile();
  }, [uid, db]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile(user, { displayName, photoURL });
      await setDoc(doc(db, "profiles", uid), {
        ...profile,
        displayName,
        photoURL,
        phone,
        college,
        bio,
        skills,
        email: user.email,
      }, { merge: true });

      setEditMode(false);
    } catch (err) {
      alert("Failed to save profile: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return <Box p={5}>No user logged in.</Box>;
  }

  if (loading) {
    return (
      <Box sx={{ textAlign: "center", py: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <AppProvider theme={theme}>
        <PageContainer>
          <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
            <Grid container spacing={3}>
              {/* Main Profile Card */}
              <Grid item xs={12} md={4}>
                <Card
                  sx={{
                    background: 'linear-gradient(145deg, #1a1a2e 0%, #16213e 100%)',
                    border: '1px solid #334155',
                    borderRadius: '16px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 40px rgba(99, 102, 241, 0.2)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Stack spacing={3} alignItems="center">
                      <Box sx={{ position: 'relative' }}>
                        <Avatar
                          src={photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName || user.email)}&background=6366f1&color=fff`}
                          sx={{
                            width: 120,
                            height: 120,
                            border: '4px solid #6366f1',
                            boxShadow: '0 8px 24px rgba(99, 102, 241, 0.3)',
                          }}
                        />
                        <IconButton
                          onClick={() => setEditMode(true)}
                          sx={{
                            position: 'absolute',
                            bottom: 0,
                            right: 0,
                            bgcolor: '#6366f1',
                            color: 'white',
                            '&:hover': { bgcolor: '#4f46e5' },
                            width: 36,
                            height: 36,
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Box>

                      {editMode ? (
                        <Stack spacing={2} sx={{ width: '100%' }}>
                          <TextField
                            label="Display Name"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
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
                          <TextField
                            label="Photo URL"
                            value={photoURL}
                            onChange={(e) => setPhotoURL(e.target.value)}
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
                          <TextField
                            label="Phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
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
                          <TextField
                            label="College"
                            value={college}
                            onChange={(e) => setCollege(e.target.value)}
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
                          <TextField
                            label="Bio"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            fullWidth
                            multiline
                            rows={3}
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
                          <TextField
                            label="Skills (comma separated)"
                            value={skills}
                            onChange={(e) => setSkills(e.target.value)}
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
                          <Stack spacing={1} direction="row">
                            <Button
                              onClick={handleSave}
                              variant="contained"
                              disabled={saving}
                              sx={{
                                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                '&:hover': {
                                  background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                                },
                              }}
                            >
                              {saving ? "Saving..." : "Save"}
                            </Button>
                            <Button
                              onClick={() => setEditMode(false)}
                              variant="outlined"
                              sx={{
                                borderColor: '#6366f1',
                                color: '#6366f1',
                                '&:hover': {
                                  backgroundColor: 'rgba(99, 102, 241, 0.1)',
                                  borderColor: '#8b5cf6',
                                },
                              }}
                            >
                              Cancel
                            </Button>
                          </Stack>
                        </Stack>
                      ) : (
                        <>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography
                              variant="h4"
                              fontWeight={700}
                              sx={{
                                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                mb: 1,
                              }}
                            >
                              {displayName || "No Name"}
                            </Typography>
                            <Typography variant="body1" sx={{ color: '#cbd5e1', mb: 1 }}>
                              {stats.rank}
                            </Typography>
                            <Chip
                              label={`Level ${stats.coursesCompleted >= 50 ? "Master" : stats.coursesCompleted >= 30 ? "Expert" : stats.coursesCompleted >= 15 ? "Advanced" : stats.coursesCompleted >= 5 ? "Intermediate" : "Beginner"}`}
                              sx={{
                                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                color: 'white',
                                fontWeight: 600,
                              }}
                            />
                          </Box>

                          <Divider sx={{ width: "100%", borderColor: "#334155" }} />

                          <Stack spacing={2} sx={{ width: '100%' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <EmailIcon sx={{ color: '#6366f1' }} />
                              <Typography variant="body2" sx={{ color: '#e2e8f0' }}>
                                {user.email}
                              </Typography>
                            </Box>
                            {phone && (
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <PhoneIcon sx={{ color: '#6366f1' }} />
                                <Typography variant="body2" sx={{ color: '#e2e8f0' }}>
                                  {phone}
                                </Typography>
                              </Box>
                            )}
                            {college && (
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <SchoolIcon sx={{ color: '#6366f1' }} />
                                <Typography variant="body2" sx={{ color: '#e2e8f0' }}>
                                  {college}
                                </Typography>
                              </Box>
                            )}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <CalendarIcon sx={{ color: '#6366f1' }} />
                              <Typography variant="body2" sx={{ color: '#e2e8f0' }}>
                                Joined {new Date(user.metadata.creationTime).toLocaleDateString()}
                              </Typography>
                            </Box>
                          </Stack>

                          {bio && (
                            <>
                              <Divider sx={{ width: "100%", borderColor: "#334155" }} />
                              <Box>
                                <Typography variant="h6" sx={{ color: '#f8fafc', mb: 1 }}>
                                  About
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#cbd5e1' }}>
                                  {bio}
                                </Typography>
                              </Box>
                            </>
                          )}

                          {skills && (
                            <>
                              <Divider sx={{ width: "100%", borderColor: "#334155" }} />
                              <Box>
                                <Typography variant="h6" sx={{ color: '#f8fafc', mb: 2 }}>
                                  Skills
                                </Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                  {skills.split(',').map((skill, index) => (
                                    <Chip
                                      key={index}
                                      label={skill.trim()}
                                      size="small"
                                      sx={{
                                        backgroundColor: 'rgba(99, 102, 241, 0.2)',
                                        color: '#8b5cf6',
                                        border: '1px solid rgba(99, 102, 241, 0.3)',
                                      }}
                                    />
                                  ))}
                                </Box>
                              </Box>
                            </>
                          )}
                        </>
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>

              {/* Stats and Progress */}
              <Grid item xs={12} md={8}>
                <Stack spacing={3}>
                  {/* Stats Cards */}
                  <Grid container spacing={2}>
                    <Grid item xs={6} sm={3}>
                      <Card
                        sx={{
                          background: 'linear-gradient(145deg, #1a1a2e 0%, #16213e 100%)',
                          border: '1px solid #334155',
                          borderRadius: '12px',
                          p: 2,
                          textAlign: 'center',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 24px rgba(99, 102, 241, 0.2)',
                          },
                        }}
                      >
                        <TrophyIcon sx={{ color: '#f59e0b', fontSize: 32, mb: 1 }} />
                        <Typography variant="h4" fontWeight={700} sx={{ color: '#f8fafc' }}>
                          {stats.coursesCompleted}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#cbd5e1' }}>
                          Courses
                        </Typography>
                      </Card>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Card
                        sx={{
                          background: 'linear-gradient(145deg, #1a1a2e 0%, #16213e 100%)',
                          border: '1px solid #334155',
                          borderRadius: '12px',
                          p: 2,
                          textAlign: 'center',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 24px rgba(99, 102, 241, 0.2)',
                          },
                        }}
                      >
                        <TrendingUpIcon sx={{ color: '#10b981', fontSize: 32, mb: 1 }} />
                        <Typography variant="h4" fontWeight={700} sx={{ color: '#f8fafc' }}>
                          {stats.totalHours}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#cbd5e1' }}>
                          Hours
                        </Typography>
                      </Card>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Card
                        sx={{
                          background: 'linear-gradient(145deg, #1a1a2e 0%, #16213e 100%)',
                          border: '1px solid #334155',
                          borderRadius: '12px',
                          p: 2,
                          textAlign: 'center',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 24px rgba(99, 102, 241, 0.2)',
                          },
                        }}
                      >
                        <StarIcon sx={{ color: '#ec4899', fontSize: 32, mb: 1 }} />
                        <Typography variant="h4" fontWeight={700} sx={{ color: '#f8fafc' }}>
                          {stats.currentStreak}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#cbd5e1' }}>
                          Day Streak
                        </Typography>
                      </Card>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Card
                        sx={{
                          background: 'linear-gradient(145deg, #1a1a2e 0%, #16213e 100%)',
                          border: '1px solid #334155',
                          borderRadius: '12px',
                          p: 2,
                          textAlign: 'center',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 24px rgba(99, 102, 241, 0.2)',
                          },
                        }}
                      >
                        <BookmarkIcon sx={{ color: '#3b82f6', fontSize: 32, mb: 1 }} />
                        <Typography variant="h4" fontWeight={700} sx={{ color: '#f8fafc' }}>
                          {stats.achievements}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#cbd5e1' }}>
                          Badges
                        </Typography>
                      </Card>
                    </Grid>
                  </Grid>

                  {/* Progress Card */}
                  <Card
                    sx={{
                      background: 'linear-gradient(145deg, #1a1a2e 0%, #16213e 100%)',
                      border: '1px solid #334155',
                      borderRadius: '16px',
                      p: 3,
                    }}
                  >
                    <Typography variant="h5" fontWeight={600} sx={{ color: '#f8fafc', mb: 3 }}>
                      Learning Progress
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" sx={{ color: '#cbd5e1' }}>
                          Overall Progress
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#6366f1', fontWeight: 600 }}>
                          {stats.progress}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={stats.progress}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: 'rgba(99, 102, 241, 0.2)',
                          '& .MuiLinearProgress-bar': {
                            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                            borderRadius: 4,
                          },
                        }}
                      />
                    </Box>
                  </Card>

                  {/* Recent Activity */}
                  <Card
                    sx={{
                      background: 'linear-gradient(145deg, #1a1a2e 0%, #16213e 100%)',
                      border: '1px solid #334155',
                      borderRadius: '16px',
                      p: 3,
                    }}
                  >
                    <Typography variant="h5" fontWeight={600} sx={{ color: '#f8fafc', mb: 3 }}>
                      Recent Activity
                    </Typography>
                    <Stack spacing={2}>
                      {recentActivity.map((activity, index) => (
                        <Box
                          key={index}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            p: 2,
                            borderRadius: '8px',
                            backgroundColor: 'rgba(99, 102, 241, 0.1)',
                            border: '1px solid rgba(99, 102, 241, 0.2)',
                          }}
                        >
                          {activity.type === 'course' ? (
                            <SchoolIcon sx={{ color: '#6366f1' }} />
                          ) : (
                            <TrophyIcon sx={{ color: '#f59e0b' }} />
                          )}
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="body1" sx={{ color: '#f8fafc', fontWeight: 500 }}>
                              {activity.title}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#cbd5e1' }}>
                              {activity.date}
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                    </Stack>
                  </Card>
                </Stack>
              </Grid>
            </Grid>
          </Box>
        </PageContainer>
      </AppProvider>
      <Dash />
    </>
  );
}

