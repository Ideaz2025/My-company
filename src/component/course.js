import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  LinearProgress,
  Grid,
  Chip,
  Avatar,
  Stack,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  CheckCircle as CheckIcon,
  Lock as LockIcon,
  Quiz as QuizIcon,
  School as SchoolIcon,
  Timer as TimerIcon,
  Star as StarIcon,
  BookmarkBorder as BookmarkIcon,
  Share as ShareIcon,
  Download as DownloadIcon,
  NavigateNext as NextIcon,
  NavigateBefore as PrevIcon,
  EmojiEvents as TrophyIcon,
} from '@mui/icons-material';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { auth } from '../firebase';

function CourseDetail({ courseId }) {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [userProgress, setUserProgress] = useState({ completedModules: [], assessmentScore: 0 });
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [assessmentAnswers, setAssessmentAnswers] = useState([]);
  const [assessmentSubmitted, setAssessmentSubmitted] = useState(false);
  const [score, setScore] = useState(null);

  const [registeredCourses, setRegisteredCourses] = useState([]);
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });

  const user = auth.currentUser;
  const db = getFirestore();

  const userMetricsRef = user ? doc(db, 'userMetrics', user.uid) : null;

  


 useEffect(() => {
  // Mock course data for demonstration
  const mockCourse = {
    id: 'mock-course',
    title: 'Mock Course Title',
    description: 'This is a mock course description for demonstration purposes.',
    image: 'https://via.placeholder.com/600x400',
    level: 'Beginner',
    duration: '4 hours',
    instructor: 'John Doe',
    rating: 4.5,
    modules: [
      {
        title: 'Module 1: Introduction',
        content: 'This is the content for module 1.',
        videoUrl: 'https://www.example.com/video1.mp4',
        assessment: {
          questions: [
            {
              question: 'What is the main topic of Module 1?',
              options: ['Option A', 'Option B', 'Option C', 'Option D'],
              answer: 0, // Index of the correct answer
            },
            {
              question: 'Which of the following is true about Module 1?',
              options: ['True Statement', 'False Statement'],
              answer: 0,
            },
          ],
        },
      },
      {
        title: 'Module 2: Advanced Concepts',
        content: 'This is the content for module 2.',
        videoUrl: 'https://www.example.com/video2.mp4',
      },
      {
        title: 'Module 3: Conclusion',
        content: 'This is the content for module 3.',
        videoUrl: 'https://www.example.com/video3.mp4',
      },
    ],
    };

    let idToFetch = courseId;
    if (!idToFetch && registeredCourses.length > 0) {
      idToFetch = registeredCourses[0]; // Use first started course if no courseId
    }
    if (!idToFetch) {
      setLoading(false);
      setError('No course ID provided and no started courses found.');
      return;
    }

    async function fetchCourse() {
      setLoading(true);
      setError(null);
      try {
        const courseDocRef = doc(db, 'courses', idToFetch);
        const courseSnap = await getDoc(courseDocRef);
        if (courseSnap.exists()) {
          setCourse(courseSnap.data());
        } else {
          // Use mock data for demonstration
          setCourse(mockCourse);
        }
      } catch (e) {
        // Use mock data as fallback
        setCourse(mockCourse);
      } finally {
        setLoading(false);
      }
    }
    fetchCourse();
  }, [courseId, db, registeredCourses]);
  // Fetch user progress from userMetrics document
  useEffect(() => {
    if (!user || !userMetricsRef) return;

    async function fetchProgress() {
      try {
        const docSnap = await getDoc(userMetricsRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          const coursesProgress = data?.courses || {};
          const progressData = coursesProgress[courseId] || { completedModules: [], assessmentScore: 0 };
          setUserProgress(progressData);

          // Initialize assessment answers if exist
          if (progressData.assessmentAnswers) {
            setAssessmentAnswers(progressData.assessmentAnswers);
            if (progressData.assessmentScore !== undefined) {
              setAssessmentSubmitted(true);
              setScore(progressData.assessmentScore);
            }
          }
        }
      } catch {
        // Use demo progress
        setUserProgress({ completedModules: [0, 1], assessmentScore: 85 });
        setAssessmentSubmitted(true);
        setScore(85);
      }
    }

    fetchProgress();
  }, [user, userMetricsRef, courseId]);

  // Fetch registered courses from user profile
  useEffect(() => {
    if (!user) return;
    async function fetchRegisteredCourses() {
      try {
        const profileRef = doc(db, 'profiles', user.uid);
        const profileSnap = await getDoc(profileRef);
        if (profileSnap.exists()) {
          const profileData = profileSnap.data();
          const startedCourses = profileData?.startedCourses || [];
          setRegisteredCourses(startedCourses); // <-- fetched from Firestore
        } else {
          setRegisteredCourses([]);
        }
      } catch {
        setRegisteredCourses([]);
      }
    }
    fetchRegisteredCourses();
  }, [user, db]);

  // Fetch course details
 

  // Mark module complete inside userMetrics document
  const markModuleComplete = async (idx) => {
    if (!user || !userMetricsRef) return;

    try {
      const modulesSet = new Set(userProgress.completedModules);
      modulesSet.add(idx);
      const updatedCourseProgress = {
        ...userProgress,
        completedModules: Array.from(modulesSet),
        assessmentAnswers: userProgress.assessmentAnswers || [],
      };

      const docSnap = await getDoc(userMetricsRef);
      let data = {};
      if (docSnap.exists()) data = docSnap.data();

      const existingCourses = data.courses || {};
      const updatedCourses = { ...existingCourses, [courseId]: updatedCourseProgress };
      const updatedData = { ...data, courses: updatedCourses };

      await setDoc(userMetricsRef, updatedData, { merge: true });
      setUserProgress(updatedCourseProgress);
    } catch (e) {
      console.error('Error marking module complete:', e);
      // Update locally for demo
      const modulesSet = new Set(userProgress.completedModules);
      modulesSet.add(idx);
      setUserProgress({
        ...userProgress,
        completedModules: Array.from(modulesSet),
      });
    }
  };

  // Handle finishing current module and moving to next
  const completeCurrentModule = async () => {
    await markModuleComplete(currentModuleIndex);
    if (course && currentModuleIndex < (course.modules.length - 1)) {
      setCurrentModuleIndex(currentModuleIndex + 1);
    }
  };

  // Update user's selected answer for a question
  const handleAnswerChange = (questionIdx, optionIdx) => {
    setAssessmentAnswers((ans) => {
      const updated = [...ans];
      updated[questionIdx] = optionIdx;
      return updated;
    });
  };

  // Submit assessment answers and save score to Firestore
  const submitAssessment = async () => {
    if (!user || !userMetricsRef) return;
    if (!course || !course.assessment || !course.assessment.questions) return;

    let correctCount = 0;
    course.assessment.questions.forEach((q, i) => {
      if (assessmentAnswers[i] === q.answer) correctCount++;
    });
    const total = course.assessment.questions.length;
    const calculatedScore = total === 0 ? 0 : Math.round((correctCount / total) * 100);

    try {
      const docSnap = await getDoc(userMetricsRef);
      let data = {};
      if (docSnap.exists()) data = docSnap.data();

      const existingCourses = data.courses || {};
      const updatedCourseProgress = {
        ...existingCourses[courseId],
        assessmentScore: calculatedScore,
        assessmentAnswers: assessmentAnswers,
        completedModules: existingCourses[courseId]?.completedModules || [],
      };

      const updatedCourses = { ...existingCourses, [courseId]: updatedCourseProgress };
      const updatedData = { ...data, courses: updatedCourses };

      await setDoc(userMetricsRef, updatedData, { merge: true });
      setUserProgress(updatedCourseProgress);
      
      setScore(calculatedScore);
      setAssessmentSubmitted(true);
      
      // Show certificate if score is high enough
      if (calculatedScore >= 80) {
        alert('Congratulations! You have completed the assessment with a score of ' + calculatedScore + '%.');
      } else {
        alert('Assessment submitted with a score of ' + calculatedScore + '%. Keep trying to improve!');
      }
  } catch (e) {
      console.error('Error submitting assessment:', e);
      }
      setAssessmentSubmitted(true);
      setScore(calculatedScore);

    };

  const getScoreColor = (score) => {
    if (score >= 90) return '#10b981';
    if (score >= 80) return '#f59e0b';
    if (score >= 70) return '#ec4899';
    return '#ef4444';
  };

  const isModuleUnlocked = (index) => {
    return index === 0 || userProgress.completedModules.includes(index - 1);
  };

  // New handler functions


const handleBookmark = async () => {
  if (!user || !courseId) return;
  try {
    const profileRef = doc(db, 'profiles', user.uid);
    const profileSnap = await getDoc(profileRef);
    let bookmarkedCourses = [];
    if (profileSnap.exists()) {
      const profileData = profileSnap.data();
      bookmarkedCourses = profileData?.bookmarkedCourses || [];
    }
    if (!bookmarkedCourses.includes(courseId)) {
      bookmarkedCourses.push(courseId);
      await setDoc(profileRef, { bookmarkedCourses }, { merge: true });
      alert('Course bookmarked!');
    } else {
      alert('Course already bookmarked!');
    }
  } catch (e) {
    console.error('Error bookmarking course:', e);
    alert('Failed to bookmark course.');
  }
};
const showShareSnackbar = (message, severity = 'success') => {
  setSnack({ open: true, message, severity });
};

const handleShare = () => {
  if (navigator.clipboard) {
    const fullPath = window.location.pathname + window.location.search + window.location.hash;
    navigator.clipboard
      .writeText(fullPath)
      .then(() => showShareSnackbar('Course link copied to clipboard!'))
      .catch(() => showShareSnackbar('Failed to copy link', 'error'));
  } else {
    showShareSnackbar('Clipboard API not available.', 'error');
  }
};



  const handleDownloadCertificate = () => {
    alert('Certificate download coming soon!');
  };

  const handleContinueLearning = () => {
    setCurrentModuleIndex(0);
  };

  // Render loading, error or course details
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress size={60} sx={{ color: '#6366f1' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h5" color="error" gutterBottom>
          {error}
        </Typography>
      </Box>
    );
  }

  if (!course) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h5" sx={{ color: '#94a3b8' }}>
          Course data unavailable.
        </Typography>
      </Box>
    );
  }

  const modules = course.modules || [];
  const progressPercentage = (userProgress.completedModules.length / (modules.length || 1)) * 100;

  return (
    <Box sx={{ maxWidth: '1200px', mx: 'auto', p: { xs: 2, md: 4 } }}>
      {/* Course Header */}
      <Card
        sx={{
          background: 'linear-gradient(145deg, #1a1a2e 0%, #16213e 100%)',
          border: '1px solid #334155',
          borderRadius: '20px',
          mb: 4,
          overflow: 'hidden',
        }}
      >
        <Grid container>
          <Grid item xs={12} md={8}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Chip
                  label={course.level || 'Advanced'}
                  sx={{
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    color: 'white',
                    fontWeight: 600,
                  }}
                />
                <Chip
                  label={`${course.duration || '8 hours'}`}
                  icon={<TimerIcon />}
                  sx={{
                    backgroundColor: 'rgba(16, 185, 129, 0.2)',
                    color: '#10b981',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                  }}
                />
              </Box>
              
              <Typography 
                variant="h3" 
                fontWeight={700}
                sx={{
                  color: '#f8fafc',
                  mb: 2,
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {course.title}
              </Typography>
              
              <Typography variant="h6" sx={{ color: '#cbd5e1', mb: 3 }}>
                {course.description}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Avatar sx={{ bgcolor: '#6366f1', width: 32, height: 32 }}>
                    <SchoolIcon fontSize="small" />
                  </Avatar>
                  <Typography variant="body2" sx={{ color: '#e2e8f0' }}>
                    {course.instructor || 'Sarah Johnson'}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <StarIcon sx={{ color: '#f59e0b', fontSize: 20 }} />
                  <Typography variant="body2" sx={{ color: '#e2e8f0' }}>
                    {course.rating || '4.8'} ({course.students || '1,250'} students)
                  </Typography>
                </Box>
              </Box>

              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  startIcon={<PlayIcon />}
                  sx={{
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    px: 3,
                    py: 1.5,
                    fontWeight: 600,
                    '&:hover': {
                      background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                    },
                  }}
                  onClick={handleContinueLearning}
                >
                  Continue Learning
                </Button>
                <IconButton
                  sx={{
                    color: '#6366f1',
                    border: '1px solid #6366f1',
                    '&:hover': { backgroundColor: 'rgba(99, 102,241, 0.1)' }
                  }}
                  onClick={handleBookmark}
                >
                  <BookmarkIcon />
                </IconButton>
                <IconButton
                  sx={{
                    color: '#6366f1',
                    border: '1px solid #6366f1',
                    '&:hover': { backgroundColor: 'rgba(99, 102,241, 0.1)' }
                  }}
                  onClick={handleShare}
                >
                  <ShareIcon />
                </IconButton>
              </Stack>
            </CardContent>
          </Grid>
          
          <Grid item xs={12} md={4}>
            {course.image && (
              <Box
                component="img"
                src={course.image}
                alt={course.title}
                sx={{
                  width: '100%',
                  height: '100%',
                  minHeight: 300,
                  objectFit: 'cover',
                }}
              />
            )}
          </Grid>
        </Grid>
      </Card>

      <Grid container spacing={4}>
        {/* Main Content */}
        <Grid item xs={12} md={8}>
          {/* Progress Overview */}
          <Card
            sx={{
              background: 'linear-gradient(145deg, #1a1a2e 0%, #16213e 100%)',
              border: '1px solid #334155',
              borderRadius: '16px',
              p: 3,
              mb: 4,
            }}
          >
            <Typography variant="h5" fontWeight={600} sx={{ color: '#f8fafc', mb: 3 }}>
              Your Progress
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ color: '#cbd5e1' }}>
                  Course Completion
                </Typography>
                <Typography variant="body2" sx={{ color: '#6366f1', fontWeight: 600 }}>
                  {Math.round(progressPercentage)}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={progressPercentage}
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

            <Grid container spacing={3}>
              <Grid item xs={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" fontWeight={700} sx={{ color: '#10b981' }}>
                    {userProgress.completedModules.length}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#cbd5e1' }}>
                    Modules Done
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" fontWeight={700} sx={{ color: '#f59e0b' }}>
                    {modules.length - userProgress.completedModules.length}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#cbd5e1' }}>
                    Remaining
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography 
                    variant="h4" 
                    fontWeight={700} 
                    sx={{ color: getScoreColor(userProgress.assessmentScore || 0) }}
                  >
                    {userProgress.assessmentScore || 0}%
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#cbd5e1' }}>
                    Quiz Score
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Card>

          {/* Course Modules */}
          <Card
            sx={{
              background: 'linear-gradient(145deg, #1a1a2e 0%, #16213e 100%)',
              border: '1px solid #334155',
              borderRadius: '16px',
              p: 3,
              mb: 4,
            }}
          >
            <Typography variant="h5" fontWeight={600} sx={{ color: '#f8fafc', mb: 3 }}>
              Course Modules
            </Typography>

            <Stepper activeStep={currentModuleIndex} orientation="vertical">
              {modules.map((module, index) => (
                <Step key={index}>
                  <StepLabel
                    StepIconComponent={({ active, completed }) => (
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: completed 
                            ? '#10b981' 
                            : active 
                            ? '#6366f1' 
                            : isModuleUnlocked(index) 
                            ? 'rgba(99, 102, 241, 0.2)' 
                            : '#374151',
                          color: completed || active ? 'white' : '#9ca3af',
                        }}
                      >
                        {completed ? (
                          <CheckIcon fontSize="small" />
                        ) : isModuleUnlocked(index) ? (
                          <PlayIcon fontSize="small" />
                        ) : (
                          <LockIcon fontSize="small" />
                        )}
                      </Box>
                    )}
                  >
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        color: userProgress.completedModules.includes(index) ? '#10b981' : '#f8fafc',
                        fontWeight: 500,
                      }}
                    >
                      {module.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#cbd5e1' }}>
                      {module.duration || '45 min'}
                    </Typography>
                  </StepLabel>
                  
                  <StepContent>
                    <Card
                      sx={{
                        backgroundColor: 'rgba(99, 102, 241, 0.1)',
                        border: '1px solid rgba(99, 102, 241, 0.2)',
                        borderRadius: '12px',
                        p: 3,
                        mb: 2,
                      }}
                    >
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          color: '#e2e8f0', 
                          whiteSpace: 'pre-line',
                          mb: 3,
                        }}
                      >
                        {module.content}
                      </Typography>

                      {module.resources && (
                        <Box sx={{ mb: 3 }}>
                          <Typography variant="subtitle2" sx={{ color: '#f8fafc', mb: 1 }}>
                            Resources:
                          </Typography>
                          <Stack direction="row" spacing={1} flexWrap="wrap">
                            {module.resources.map((resource, idx) => (
                              <Chip
                                key={idx}
                                label={resource}
                                size="small"
                                icon={<DownloadIcon />}
                                sx={{
                                  backgroundColor: 'rgba(16, 185, 129, 0.2)',
                                  color: '#10b981',
                                  border: '1px solid rgba(16, 185, 129, 0.3)',
                                }}
                              />
                            ))}
                          </Stack>
                        </Box>
                      )}

                      <Stack direction="row" spacing={2}>
                        {!userProgress.completedModules.includes(index) ? (
                          <Button
                            variant="contained"
                            onClick={completeCurrentModule}
                            disabled={!isModuleUnlocked(index)}
                            sx={{
                              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                              '&:hover': {
                                background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                              },
                              '&:disabled': {
                                background: '#374151',
                                color: '#9ca3af',
                              }
                            }}
                          >
                            Mark Complete
                          </Button>
                        ) : (
                          <Chip
                            label="Completed"
                            icon={<CheckIcon />}
                            sx={{
                              backgroundColor: 'rgba(16, 185, 129, 0.2)',
                              color: '#10b981',
                              border: '1px solid rgba(16, 185, 129, 0.3)',
                            }}
                          />
                        )}
                        
                        {index > 0 && (
                          <IconButton
                            onClick={() => setCurrentModuleIndex(index - 1)}
                            sx={{ color: '#6366f1' }}
                          >
                            <PrevIcon />
                          </IconButton>
                        )}
                        
                        {index < modules.length - 1 && (
                          <IconButton
                            onClick={() => setCurrentModuleIndex(index + 1)}
                            sx={{ color: '#6366f1' }}
                          >
                            <NextIcon />
                          </IconButton>
                        )}
                      </Stack>
                    </Card>
                  </StepContent>
                </Step>
              ))}
            </Stepper>
          </Card>

          {/* Assessment Section */}
          <Card
            sx={{
              background: 'linear-gradient(145deg, #1a1a2e 0%, #16213e 100%)',
              border: '1px solid #334155',
              borderRadius: '16px',
              p: 3,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <QuizIcon sx={{ color: '#6366f1', fontSize: 32 }} />
              <Typography variant="h5" fontWeight={600} sx={{ color: '#f8fafc' }}>
                Course Assessment
              </Typography>
            </Box>

            {!course.assessment || !course.assessment.questions ? (
              <Typography sx={{ color: '#94a3b8' }}>
                No assessment available for this course.
              </Typography>
            ) : (
              <>
                <Typography variant="body1" sx={{ color: '#cbd5e1', mb: 3 }}>
                  Test your knowledge with our comprehensive quiz. You need 80% to earn a certificate.
                </Typography>

                {!assessmentSubmitted ? (
                  <Box>
                    {course.assessment.questions.map((q, i) => (
                      <Card
                        key={i}
                        sx={{
                          backgroundColor: 'rgba(99, 102, 241, 0.1)',
                          border: '1px solid rgba(99, 102, 241, 0.2)',
                          borderRadius: '12px',
                          p: 3,
                          mb: 3,
                        }}
                      >
                        <Typography variant="h6" sx={{ color: '#f8fafc', mb: 2 }}>
                          Question {i + 1}
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#e2e8f0', mb: 2 }}>
                          {q.questionText}
                        </Typography>
                        <RadioGroup
                          value={assessmentAnswers[i] ?? ''}
                          onChange={e => handleAnswerChange(i, parseInt(e.target.value))}
                        >
                          {q.options.map((option, idx) => (
                            <FormControlLabel
                              key={idx}
                              value={idx}
                              control={
                                <Radio 
                                  sx={{
                                    color: '#6366f1',
                                    '&.Mui-checked': { color: '#6366f1' }
                                  }}
                                />
                              }
                              label={
                                <Typography sx={{ color: '#e2e8f0' }}>
                                  {option}
                                </Typography>
                              }
                            />
                          ))}
                        </RadioGroup>
                      </Card>
                    ))}
                    
                    <Button
                      variant="contained"
                      size="large"
                      onClick={submitAssessment}
                      disabled={assessmentAnswers.length < course.assessment.questions.length}
                      sx={{
                        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                        px: 4,
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
                      Submit Assessment
                    </Button>
                  </Box>
                ) : (
                  <Box>
                    <Alert
                      severity={score >= 80 ? "success" : score >= 60 ? "warning" : "error"}
                      sx={{
                        mb: 3,
                        backgroundColor: score >= 80 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                        color: score >= 80 ? '#10b981' : '#f59e0b',
                        border: `1px solid ${score >= 80 ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
                      }}
                    >
                      <Typography variant="h6" fontWeight={600}>
                        Assessment Complete!
                      </Typography>
                      <Typography>
                        Your Score: {score}% 
                        {score >= 80 && " - Congratulations! You've earned a certificate!"}
                      </Typography>
                    </Alert>

                    {score >= 80 && (
                      <Card
                        sx={{
                          background: 'linear-gradient(135deg, #f59e0b 0%, #ec4899 100%)',
                          borderRadius: '16px',
                          p: 3,
                          textAlign: 'center',
                        }}
                      >
                        <TrophyIcon sx={{ fontSize: 64, color: 'white', mb: 2 }} />
                        <Typography variant="h4" fontWeight={700} sx={{ color: 'white', mb: 1 }}>
                          Certificate Earned!
                        </Typography>
                        <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.9)', mb: 3 }}>
                          Congratulations on completing {course.title}
                        </Typography>
                        <Button
                          variant="contained"
                          startIcon={<DownloadIcon />}
                          sx={{
                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                            color: 'white',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            '&:hover': {
                              backgroundColor: 'rgba(255, 255, 255, 0.3)',
                            },
                          }}
                          onClick={handleDownloadCertificate}
                        >
                          Download Certificate
                        </Button>
                      </Card>
                    )}
                  </Box>
                )}
              </>
            )}
          </Card>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            {/* Course Info */}
            <Card
              sx={{
                background: 'linear-gradient(145deg, #1a1a2e 0%, #16213e 100%)',
                border: '1px solid #334155',
                borderRadius: '16px',
                p: 3,
              }}
            >
              <Typography variant="h6" fontWeight={600} sx={{ color: '#f8fafc', mb: 2 }}>
                Course Information
              </Typography>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ color: '#cbd5e1' }}>
                    Duration
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#f8fafc', fontWeight: 500 }}>
                    {course.duration || '8 hours'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ color: '#cbd5e1' }}>
                    Level
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#f8fafc', fontWeight: 500 }}>
                    {course.level || 'Advanced'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ color: '#cbd5e1' }}>
                    Students
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#f8fafc', fontWeight: 500 }}>
                    {course.students || '1,250'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ color: '#cbd5e1' }}>
                    Rating
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <StarIcon sx={{ color: '#f59e0b', fontSize: 16 }} />
                    <Typography variant="body2" sx={{ color: '#f8fafc', fontWeight: 500 }}>
                      {course.rating || '4.8'}
                    </Typography>
                  </Box>
                </Box>
              </Stack>
            </Card>

            {/* Module List */}
            <Card
              sx={{
                background: 'linear-gradient(145deg, #1a1a2e 0%, #16213e 100%)',
                border: '1px solid #334155',
                borderRadius: '16px',
                p: 3,
              }}
            >
              <Typography variant="h6" fontWeight={600} sx={{ color: '#f8fafc', mb: 2 }}>
                Module Overview
              </Typography>
              <List sx={{ p: 0 }}>
                {modules.map((module, index) => (
                  <ListItem
                    key={index}
                    sx={{
                      px: 0,
                      py: 1,
                      cursor: 'pointer',
                      borderRadius: '8px',
                      '&:hover': {
                        backgroundColor: 'rgba(99, 102, 241, 0.1)',
                      },
                    }}
                    onClick={() => setCurrentModuleIndex(index)}
                  >
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      {userProgress.completedModules.includes(index) ? (
                        <CheckIcon sx={{ color: '#10b981' }} />
                      ) : isModuleUnlocked(index) ? (
                        <PlayIcon sx={{ color: '#6366f1' }} />
                      ) : (
                        <LockIcon sx={{ color: '#9ca3af' }} />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography
                          variant="body2"
                          sx={{
                            color: userProgress.completedModules.includes(index) ? '#10b981' : '#f8fafc',
                            fontWeight: 500,
                          }}
                        >
                          {module.title}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="caption" sx={{ color: '#cbd5e1' }}>
                          {module.duration || '45 min'}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Card>

            {/* Registered Courses - New Section */}
            <Card
              sx={{
                background: 'linear-gradient(145deg, #1a1a2e 0%, #16213e 100%)',
                border: '1px solid #334155',
                borderRadius: '16px',
                p: 3,
              }}
            >
              <Typography variant="h6" fontWeight={600} sx={{ color: '#f8fafc', mb: 2 }}>
                Registered Courses
              </Typography>
              {registeredCourses.length === 0 ? (
                <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                  You have not registered for any courses yet.
                </Typography>
              ) : (
                <List sx={{ p: 0 }}>
                  {registeredCourses.map((cid, idx) => (
                    <ListItem key={cid} sx={{ px: 0, py: 1 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <SchoolIcon sx={{ color: '#6366f1' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={<Typography variant="body2" sx={{ color: '#f8fafc', fontWeight: 500 }}>{cid}</Typography>}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </Card>
          </Stack>
        </Grid>
      </Grid>

      <Snackbar
        open={snack.open}
        autoHideDuration={2600}
        onClose={() => setSnack({ ...snack, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnack({ ...snack, open: false })}
          severity={snack.severity}
          variant="filled"
          sx={{
            bgcolor: snack.severity === 'success'
              ? 'linear-gradient(90deg, #6366f1, #10b981)'
              : 'error.main',
            color: '#fff',
            boxShadow: '0 6px 24px rgba(99,102,241,0.33)',
            fontWeight: 600,
          }}
        >
          {snack.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}


CourseDetail.propTypes = {
  courseId: PropTypes.string.isRequired,
};

export default CourseDetail;
