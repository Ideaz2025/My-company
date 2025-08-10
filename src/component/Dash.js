import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SchoolIcon from '@mui/icons-material/School';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import BookIcon from '@mui/icons-material/Book';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StarIcon from '@mui/icons-material/Star';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { Doughnut, Line } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';
import LinearProgress from '@mui/material/LinearProgress';
import { getFirestore, collection, getDocs, doc, setDoc, getDoc } from 'firebase/firestore';
import { auth } from '../firebase';
import React from 'react';
import { useNavigate } from 'react-router-dom';

Chart.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);

// Example static course list (replace with Firestore fetch if needed)
const courseList = [
  { title: 'Introduction to React' },
  { title: 'Advanced React' },
  { title: 'React Hooks' },
  { title: 'React Router' },
  { title: 'Redux Basics' },
  { title: 'React and Firebase' },
  { title: 'React Testing' },
  { title: 'React Performance' },
  { title: 'React Patterns' },
  { title: 'React with TypeScript' },
];

export default function LearningDashboard() {
  // Fetch courses from Firestore
  const navigate = useNavigate();
  const [firebaseCourses, setFirebaseCourses] = React.useState([]);
  React.useEffect(() => {
    const db = getFirestore();
    const fetchCourses = async () => {
      const querySnapshot = await getDocs(collection(db, 'courses'));
      const courses = [];
      querySnapshot.forEach((doc) => {
        courses.push(doc.data());
      });
      setFirebaseCourses(courses);
    };
    fetchCourses();
  }, []);

  const maxCourse = firebaseCourses.length > 0 ? firebaseCourses.length : courseList.length;

  // User authentication
  const user = auth.currentUser;
  const userId = user ? user.uid : 'demo';

  // State for metrics
  const [metrics, setMetrics] = React.useState({
    coursesCompleted: 0,
    quizAverage: 0,
    dayStreak: 0,
    totalHours: 0,
    certificates: 0,
    rank: 'Beginner',
  });

  // Mock data for additional content
  const [weeklyProgress] = React.useState([65, 78, 82, 75, 88, 92, 85]);
  const [recentCourses] = React.useState([
    { title: 'Advanced React Patterns', progress: 85, instructor: 'John Doe', rating: 4.8 },
    { title: 'Node.js Masterclass', progress: 60, instructor: 'Jane Smith', rating: 4.9 },
    { title: 'TypeScript Fundamentals', progress: 95, instructor: 'Mike Johnson', rating: 4.7 },
  ]);

  const [achievements] = React.useState([
    { title: 'First Course Complete', icon: '🎓', date: '2 days ago' },
    { title: 'Week Streak Master', icon: '🔥', date: '1 week ago' },
    { title: 'Quiz Champion', icon: '🏆', date: '2 weeks ago' },
    { title: 'Fast Learner', icon: '⚡', date: '3 weeks ago' },
  ]);

  // Fetch user metrics from Firestore
  React.useEffect(() => {
    if (!userId) return;

    const db = getFirestore();

    async function fetchUserMetrics() {
      try {
        const userMetricsDoc = await getDoc(doc(db, 'userMetrics', userId));
        let data;

        if (userMetricsDoc.exists()) {
          data = userMetricsDoc.data();
        } else {
          // Fallback sample data
          data = {
            dayStreak: 15,
            courses: {},
          };
        }

        // Extract courses progress and compute metrics
        const coursesProgress = data.courses || {};

        // Use courses from Firestore if available, otherwise fallback list
        const allCourses = firebaseCourses.length > 0 ? firebaseCourses : courseList;

        let completedCount = 0;
        let totalScore = 0;
        let scoredCourses = 0;

        allCourses.forEach(course => {
          // Standardize course ID
          const courseId = course.id || (course.title ? course.title.replace(/\s+/g, '_').toLowerCase() : null);

          if (courseId && coursesProgress[courseId]) {
            const progress = coursesProgress[courseId];

            // Check if all modules are completed
            const totalModules = (course.modules && course.modules.length) || 0;
            const completedModulesCount = (progress.completedModules && progress.completedModules.length) || 0;

            if (totalModules > 0 && completedModulesCount >= totalModules) {
              completedCount++;
            }

            // Aggregate assessment scores
            if (typeof progress.assessmentScore === 'number') {
              totalScore += progress.assessmentScore;
              scoredCourses++;
            }
          }
        });

        const avgScore = scoredCourses > 0 ? Math.round(totalScore / scoredCourses) : 0;

        setMetrics({
          dayStreak: data.dayStreak ?? 15,
          coursesCompleted: completedCount || 8,
          quizAverage: avgScore || 92,
          totalHours: data.totalHours ?? 156,
          certificates: data.certificates ?? 5,
          rank: data.rank ?? 'Advanced Learner',
        });

      } catch (error) {
        console.error('Failed fetching user metrics:', error);
        // Optionally set fallback here
      }
    }

    fetchUserMetrics();

  }, [userId, firebaseCourses]);

  // Function to update metrics in Firestore
  const updateUserMetrics = async (newMetrics) => {
    const db = getFirestore();
    await setDoc(doc(db, 'userMetrics', userId), newMetrics, { merge: true });
    setMetrics(newMetrics);
  };

  const metricTiers = [
    {
      key: 'coursesCompleted',
      title: 'Courses Completed',
      value: metrics.coursesCompleted,
      postfix: `/${maxCourse}`,
      color: '#6366f1',
      icon: <SchoolIcon />,
      highlight: true,
      subheader: 'Learning Path',
      description: [
        'Excellent progress!',
        'Course completion rate',
      ],
    },
    {
      key: 'quizAverage',
      title: 'Quiz Average',
      value: metrics.quizAverage,
      postfix: '%',
      color: '#10b981',
      icon: <EmojiEventsIcon />,
      highlight: true,
      subheader: 'Top Performer',
      description: [
        'Outstanding scores!',
        'Quiz accuracy this month',
      ],
    },
    {
      key: 'dayStreak',
      title: 'Day Streak',
      value: metrics.dayStreak,
      color: '#f59e0b',
      icon: <LocalFireDepartmentIcon />,
      highlight: true,
      subheader: 'Consistency',
      description: [
        'Amazing dedication!',
        'Consecutive learning days',
      ],
    },
    {
      key: 'totalHours',
      title: 'Total Hours',
      value: metrics.totalHours,
      color: '#ec4899',
      icon: <TrendingUpIcon />,
      highlight: true,
      subheader: 'Time Invested',
      description: [
        'Great commitment!',
        'Learning hours logged',
      ],
    },
  ];

  const doughnutData = {
    labels: metricTiers.map((m) => m.title),
    datasets: [
      {
        data: metricTiers.map((m) => metrics[m.key] || 0),
        backgroundColor: metricTiers.map((m) => m.color),
        borderWidth: 0,
        borderRadius: 8,
      },
    ],
  };

  const doughnutOptions = {
    cutout: '70%',
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          color: '#f8fafc',
          font: {
            size: 12,
          },
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(26, 26, 46, 0.9)',
        titleColor: '#f8fafc',
        bodyColor: '#cbd5e1',
        borderColor: '#6366f1',
        borderWidth: 1,
      },
    },
  };

  const weeklyData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Learning Progress',
        data: weeklyProgress,
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#6366f1',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
      },
    ],
  };

  const weeklyOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(26, 26, 46, 0.9)',
        titleColor: '#f8fafc',
        bodyColor: '#cbd5e1',
        borderColor: '#6366f1',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(51, 65, 85, 0.3)',
        },
        ticks: {
          color: '#cbd5e1',
        },
      },
      y: {
        grid: {
          color: 'rgba(51, 65, 85, 0.3)',
        },
        ticks: {
          color: '#cbd5e1',
        },
      },
    },
  };

  return (
    <Container
      id="learning-dashboard"
      sx={{
        pt: { xs: 2, sm: 4 },
        pb: { xs: 4, sm: 8 },
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: { xs: 3, md: 4 },
        maxWidth: '1400px',
        background: 'transparent',
      }}
    >
      {/* Welcome Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography 
          variant="h3" 
          fontWeight={700}
          sx={{
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2,
          }}
        >
          Learning Dashboard
        </Typography>
        <Typography variant="h6" sx={{ color: '#cbd5e1', mb: 1 }}>
          Welcome back! Here's your learning progress
        </Typography>
        <Chip
          label={metrics.rank}
          sx={{
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            color: 'white',
            fontWeight: 600,
            fontSize: '0.9rem',
            px: 2,
          }}
        />
      </Box>

      {/* Main Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {metricTiers.map((tier, idx) => (
          <Grid item xs={12} sm={6} lg={3} key={tier.key}>
            <Card
              sx={{
                background: 'linear-gradient(145deg, #1a1a2e 0%, #16213e 100%)',
                border: '1px solid #334155',
                borderRadius: '16px',
                p: 3,
                height: '100%',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: `0 12px 40px ${tier.color}20`,
                  borderColor: tier.color,
                },
              }}
            >
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      sx={{
                        p: 1,
                        borderRadius: '8px',
                        background: `${tier.color}20`,
                        color: tier.color,
                      }}
                    >
                      {tier.icon}
                    </Box>
                    <Typography variant="body2" sx={{ color: '#cbd5e1', fontWeight: 500 }}>
                      {tier.title}
                    </Typography>
                  </Box>
                  <Chip
                    label={tier.subheader}
                    size="small"
                    sx={{
                      backgroundColor: `${tier.color}20`,
                      color: tier.color,
                      border: `1px solid ${tier.color}30`,
                      fontSize: '0.7rem',
                    }}
                  />
                </Box>
                
                <Typography 
                  variant="h3" 
                  fontWeight={700} 
                  sx={{ 
                    color: '#f8fafc',
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: 0.5,
                  }}
                >
                  {metrics[tier.key]}
                  <Typography variant="h5" sx={{ color: '#94a3b8' }}>
                    {tier.postfix}
                  </Typography>
                </Typography>

                <LinearProgress
                  variant="determinate"
                  value={
                    tier.key === 'quizAverage'
                      ? metrics.quizAverage
                      : tier.key === 'coursesCompleted'
                      ? (metrics.coursesCompleted / maxCourse) * 100
                      : tier.key === 'dayStreak'
                      ? (metrics.dayStreak / 30) * 100
                      : tier.key === 'totalHours'
                      ? Math.min((metrics.totalHours / 200) * 100, 100)
                      : 0
                  }
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: `${tier.color}20`,
                    '& .MuiLinearProgress-bar': {
                      background: `linear-gradient(135deg, ${tier.color} 0%, ${tier.color}CC 100%)`,
                      borderRadius: 4,
                    },
                  }}
                />

                <Stack spacing={1}>
                  {tier.description.map((line, idx) => (
                    <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CheckCircleRoundedIcon sx={{ width: 16, color: tier.color }} />
                      <Typography variant="body2" sx={{ color: '#e2e8f0' }}>
                        {line}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Stack>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts and Progress Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Progress Overview Chart */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              background: 'linear-gradient(145deg, #1a1a2e 0%, #16213e 100%)',
              border: '1px solid #334155',
              borderRadius: '16px',
              p: 3,
              height: '400px',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h5" fontWeight={600} sx={{ color: '#f8fafc' }}>
                Progress Overview
              </Typography>
              <Chip
                icon={<AutoAwesomeIcon />}
                label="This Month"
                sx={{
                  backgroundColor: 'rgba(99, 102, 241, 0.2)',
                  color: '#6366f1',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                }}
              />
            </Box>
            <Box sx={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Doughnut data={doughnutData} options={doughnutOptions} />
            </Box>
          </Card>
        </Grid>

        {/* Weekly Progress Chart */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              background: 'linear-gradient(145deg, #1a1a2e 0%, #16213e 100%)',
              border: '1px solid #334155',
              borderRadius: '16px',
              p: 3,
              height: '400px',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h5" fontWeight={600} sx={{ color: '#f8fafc' }}>
                Weekly Progress
              </Typography>
              <Chip
                icon={<TrendingUpIcon />}
                label="+12% vs last week"
                sx={{
                  backgroundColor: 'rgba(16, 185, 129, 0.2)',
                  color: '#10b981',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                }}
              />
            </Box>
            <Box sx={{ height: '300px' }}>
              <Line data={weeklyData} options={weeklyOptions} />
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Courses and Achievements */}
      <Grid container spacing={3}>
        {/* Recent Courses */}
        <Grid item xs={12} md={8}>
          <Card
            sx={{
              background: 'linear-gradient(145deg, #1a1a2e 0%, #16213e 100%)',
              border: '1px solid #334155',
              borderRadius: '16px',
              p: 3,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h5" fontWeight={600} sx={{ color: '#f8fafc' }}>
                Continue Learning
              </Typography>
              <Button
                variant="outlined"
                sx={{
                  borderColor: '#6366f1',
                  color: '#6366f1',
                  '&:hover': {
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    borderColor: '#8b5cf6',
                  },
                }}
                onClick={() => window.location.href = '/'}
              >
                View All Courses
              </Button>
            </Box>
            <Stack spacing={2}>
              {recentCourses.map((course, index) => (
                <Card
                  key={index}
                  sx={{
                    background: 'rgba(99, 102, 241, 0.1)',
                    border: '1px solid rgba(99, 102, 241, 0.2)',
                    borderRadius: '12px',
                    p: 2,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(99, 102, 241, 0.15)',
                      transform: 'translateX(4px)',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar
                      sx={{
                        bgcolor: '#6366f1',
                        width: 48,
                        height: 48,
                      }}
                    >
                      <BookIcon />
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ color: '#f8fafc', mb: 0.5 }}>
                        {course.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#cbd5e1', mb: 1 }}>
                        by {course.instructor}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={course.progress}
                          sx={{
                            flex: 1,
                            height: 6,
                            borderRadius: 3,
                            backgroundColor: 'rgba(99, 102, 241, 0.2)',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: '#6366f1',
                              borderRadius: 3,
                            },
                          }}
                        />
                        <Typography variant="body2" sx={{ color: '#cbd5e1', minWidth: '40px' }}>
                          {course.progress}%
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <StarIcon sx={{ color: '#f59e0b', fontSize: 16 }} />
                        <Typography variant="body2" sx={{ color: '#cbd5e1' }}>
                          {course.rating}
                        </Typography>
                      </Box>
                    </Box>
                       <IconButton
              sx={{
                bgcolor: '#6366f1',
                color: 'white',
                '&:hover': { bgcolor: '#4f46e5' },
              }}
              onClick={() => navigate(`/course/${course.title.replace(/\s+/g, '_').toLowerCase()}`)}
              aria-label={`Go to ${course.title}`}
            >
              <PlayArrowIcon />
            </IconButton>
                  </Box>
                </Card>
              ))}
            </Stack>
          </Card>
        </Grid>

        {/* Recent Achievements */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              background: 'linear-gradient(145deg, #1a1a2e 0%, #16213e 100%)',
              border: '1px solid #334155',
              borderRadius: '16px',
              p: 3,
            }}
          >
            <Typography variant="h5" fontWeight={600} sx={{ color: '#f8fafc', mb: 3 }}>
              Recent Achievements
            </Typography>
            <Stack spacing={2}>
              {achievements.map((achievement, index) => (
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
                  <Typography variant="h4">{achievement.icon}</Typography>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body1" sx={{ color: '#f8fafc', fontWeight: 500 }}>
                      {achievement.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#cbd5e1' }}>
                      {achievement.date}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
