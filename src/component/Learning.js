import React from "react";
import PropTypes from "prop-types";
import { getFirestore, collection, setDoc, doc, getDocs } from "firebase/firestore";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Chip,
  IconButton,
  Fade,
  Grow,
} from "@mui/material";
import {
  School as SchoolIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  PlayArrow as PlayIcon,
  BookmarkBorder as BookmarkIcon,
  Star as StarIcon,
} from "@mui/icons-material";

const ADMIN_EMAILS = ["muneeswaranmd2004@gmail.com"]; // Update with your admin emails

function Learning({ router }) {
  const db = getFirestore();
  const user = auth.currentUser;
  const isAdmin = user && ADMIN_EMAILS.includes(user.email);
  const navigateReactRouter = useNavigate();

  const [newCourse, setNewCourse] = React.useState({
    title: "",
    description: "",
    image: "",
    modules: [{ title: "", content: "" }],
    assessment: {
      type: "",
      questions: [{ questionText: "", options: ["", "", "", ""], answer: null }],
    },
  });

  const [addingCourse, setAddingCourse] = React.useState(false);
  const [courses, setCourses] = React.useState([]);

  // Fetch courses, including document IDs, on mount and after adding courses
  React.useEffect(() => {
    const fetchCourses = async () => {
      try {
        const snap = await getDocs(collection(db, "courses"));
        const list = [];
        snap.forEach((doc) => list.push({ id: doc.id, ...doc.data() }));
        setCourses(list);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      }
    };
    fetchCourses();
  }, [db]);

  // Handlers for modules
  const handleModuleChange = (index, key, value) => {
    const updated = [...newCourse.modules];
    updated[index][key] = value;
    setNewCourse((prev) => ({ ...prev, modules: updated }));
  };
  const addModule = () =>
    setNewCourse((prev) => ({
      ...prev,
      modules: [...prev.modules, { title: "", content: "" }],
    }));
  const removeModule = (index) =>
    setNewCourse((prev) => ({
      ...prev,
      modules: prev.modules.filter((_, i) => i !== index),
    }));

  // Handlers for assessment questions and options
  const handleQuestionChange = (qIndex, key, value) => {
    const questionsCopy = [...newCourse.assessment.questions];
    questionsCopy[qIndex][key] = value;
    setNewCourse((prev) => ({
      ...prev,
      assessment: { ...prev.assessment, questions: questionsCopy },
    }));
  };
  const handleOptionChange = (qIndex, optIndex, value) => {
    const questionsCopy = [...newCourse.assessment.questions];
    const options = questionsCopy[qIndex].options || ["", "", "", ""];
    options[optIndex] = value;
    questionsCopy[qIndex].options = options;
    setNewCourse((prev) => ({
      ...prev,
      assessment: { ...prev.assessment, questions: questionsCopy },
    }));
  };
  const addQuestion = () =>
    setNewCourse((prev) => ({
      ...prev,
      assessment: {
        ...prev.assessment,
        questions: [
          ...prev.assessment.questions,
          { questionText: "", options: ["", "", "", ""], answer: null },
        ],
      },
    }));
  const removeQuestion = (index) =>
    setNewCourse((prev) => ({
      ...prev,
      assessment: {
        ...prev.assessment,
        questions: prev.assessment.questions.filter((_, i) => i !== index),
      },
    }));

  // Save new course to Firestore
  const handleAddCourse = async () => {
    if (
      !newCourse.title.trim() ||
      !newCourse.description.trim() ||
      !newCourse.image.trim()
    ) {
      alert("Please fill in all required fields (Title, Description, Image)");
      return;
    }
    setAddingCourse(true);
    try {
      const courseId = newCourse.title.trim().toLowerCase().replace(/\s+/g, "_");
      await setDoc(doc(db, "courses", courseId), newCourse);

      // Reset form:
      setNewCourse({
        title: "",
        description: "",
        image: "",
        modules: [{ title: "", content: "" }],
        assessment: {
          type: "",
          questions: [{ questionText: "", options: ["", "", "", ""], answer: null }],
        },
      });

      // Refresh course list
      const snap = await getDocs(collection(db, "courses"));
      const list = [];
      snap.forEach((doc) => list.push({ id: doc.id, ...doc.data() }));
      setCourses(list);
    } catch (e) {
      console.error("Error adding course:", e);
      alert("Failed to add course. Please try again.");
    } finally {
      setAddingCourse(false);
    }
  };

  // Navigate to detailed course page via internal router
  const handleViewCourse = (courseId) => {
    router.navigate(`/course/${courseId}`);
  };

  return (
    <Box 
      sx={{ 
        py: 4,
      }}
    >
      <Container maxWidth="xl">
        {/* Hero Section */}
        <Box 
          sx={{ 
            textAlign: 'center', 
            mb: 6,
            py: 4,
          }}
        >
          <Fade in timeout={1000}>
            <Typography 
              variant="h2" 
              sx={{ 
                fontWeight: 'bold',
             
              }}
            >
              🎓 Learning Hub
            </Typography>
          </Fade>
          <Fade in timeout={1500}>
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#b0b3c7',
                maxWidth: 600,
                mx: 'auto',
                lineHeight: 1.6,
              }}
            >
              Discover amazing courses, expand your knowledge, and unlock your potential with our comprehensive learning platform.
            </Typography>
          </Fade>
        </Box>

        {/* Admin form for adding courses */}
        {isAdmin && (
          <Grow in timeout={1000}>
            <Card 
              sx={{ 
                mb: 6,
                borderRadius: 4,
                background: 'rgba(26, 32, 53, 0.95)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                border: '1px solid rgba(91, 115, 255, 0.3)',
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <AddIcon sx={{ mr: 2, color: '#00d4ff', fontSize: 32 }} />
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      fontWeight: 'bold',
                      background: 'linear-gradient(45deg, #00d4ff 30%, #5b73ff 90%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    Create New Course
                  </Typography>
                </Box>

                <Box
                  component="form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleAddCourse();
                  }}
                  sx={{ display: "flex", flexDirection: "column", gap: 3 }}
                >
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Course Title"
                        required
                        fullWidth
                        value={newCourse.title}
                        onChange={(e) =>
                          setNewCourse((prev) => ({ ...prev, title: e.target.value }))
                        }
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            '& fieldset': {
                              borderColor: 'rgba(91, 115, 255, 0.3)',
                            },
                            '&:hover fieldset': {
                              borderColor: '#5b73ff',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#00d4ff',
                            },
                          },
                          '& .MuiInputLabel-root': {
                            color: '#b0b3c7',
                          },
                          '& .MuiOutlinedInput-input': {
                            color: '#ffffff',
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Thumbnail Image URL"
                        required
                        fullWidth
                        value={newCourse.image}
                        onChange={(e) =>
                          setNewCourse((prev) => ({ ...prev, image: e.target.value }))
                        }
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            '& fieldset': {
                              borderColor: 'rgba(91, 115, 255, 0.3)',
                            },
                            '&:hover fieldset': {
                              borderColor: '#5b73ff',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#00d4ff',
                            },
                          },
                          '& .MuiInputLabel-root': {
                            color: '#b0b3c7',
                          },
                          '& .MuiOutlinedInput-input': {
                            color: '#ffffff',
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Course Description"
                        required
                        fullWidth
                        multiline
                        rows={4}
                        value={newCourse.description}
                        onChange={(e) =>
                          setNewCourse((prev) => ({ ...prev, description: e.target.value }))
                        }
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            '& fieldset': {
                              borderColor: 'rgba(91, 115, 255, 0.3)',
                            },
                            '&:hover fieldset': {
                              borderColor: '#5b73ff',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#00d4ff',
                            },
                          },
                          '& .MuiInputLabel-root': {
                            color: '#b0b3c7',
                          },
                          '& .MuiOutlinedInput-input': {
                            color: '#ffffff',
                          },
                        }}
                      />
                    </Grid>
                  </Grid>

                  {/* Modules Section */}
                  <Box sx={{ mt: 4 }}>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        mb: 3,
                        color: '#00d4ff',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      📚 Course Modules
                    </Typography>
                    {newCourse.modules.map((module, idx) => (
                      <Card
                        key={idx}
                        sx={{
                          mb: 3,
                          borderRadius: 3,
                          border: '2px solid rgba(91, 115, 255, 0.2)',
                          background: 'linear-gradient(135deg, rgba(26, 32, 53, 0.8) 0%, rgba(22, 33, 62, 0.8) 100%)',
                        }}
                      >
                        <CardContent sx={{ p: 3 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="subtitle1" fontWeight="bold" color="#00d4ff">
                              Module {idx + 1}
                            </Typography>
                            <IconButton
                              color="error"
                              onClick={() => removeModule(idx)}
                              sx={{ 
                                '&:hover': { 
                                  backgroundColor: 'rgba(244, 67, 54, 0.1)',
                                  transform: 'scale(1.1)',
                                },
                                transition: 'all 0.2s',
                              }}
                            >
                              <RemoveIcon />
                            </IconButton>
                          </Box>
                          <TextField
                            label="Module Title"
                            fullWidth
                            value={module.title}
                            onChange={(e) => handleModuleChange(idx, "title", e.target.value)}
                            sx={{ 
                              mb: 2,
                              '& .MuiOutlinedInput-root': {
                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                '& fieldset': { borderColor: 'rgba(91, 115, 255, 0.3)' },
                                '&:hover fieldset': { borderColor: '#5b73ff' },
                                '&.Mui-focused fieldset': { borderColor: '#00d4ff' },
                              },
                              '& .MuiInputLabel-root': { color: '#b0b3c7' },
                              '& .MuiOutlinedInput-input': { color: '#ffffff' },
                            }}
                          />
                          <TextField
                            label="Module Content"
                            fullWidth
                            multiline
                            rows={3}
                            value={module.content}
                            onChange={(e) => handleModuleChange(idx, "content", e.target.value)}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                '& fieldset': { borderColor: 'rgba(91, 115, 255, 0.3)' },
                                '&:hover fieldset': { borderColor: '#5b73ff' },
                                '&.Mui-focused fieldset': { borderColor: '#00d4ff' },
                              },
                              '& .MuiInputLabel-root': { color: '#b0b3c7' },
                              '& .MuiOutlinedInput-input': { color: '#ffffff' },
                            }}
                          />
                        </CardContent>
                      </Card>
                    ))}
                    <Button 
                      variant="outlined" 
                      onClick={addModule}
                      startIcon={<AddIcon />}
                      sx={{
                        borderRadius: 3,
                        borderColor: '#00d4ff',
                        color: '#00d4ff',
                        '&:hover': {
                          borderColor: '#5b73ff',
                          backgroundColor: 'rgba(0, 212, 255, 0.1)',
                        },
                      }}
                    >
                      Add Module
                    </Button>
                  </Box>

                  {/* Assessment Section */}
                  <Box sx={{ mt: 4 }}>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        mb: 3,
                        color: '#00d4ff',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      📝 Assessment
                    </Typography>
                    <TextField
                      label="Assessment Type"
                      fullWidth
                      value={newCourse.assessment.type}
                      onChange={(e) =>
                        setNewCourse((prev) => ({
                          ...prev,
                          assessment: { ...prev.assessment, type: e.target.value },
                        }))
                      }
                      sx={{ 
                        mb: 3,
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          '& fieldset': { borderColor: 'rgba(91, 115, 255, 0.3)' },
                          '&:hover fieldset': { borderColor: '#5b73ff' },
                          '&.Mui-focused fieldset': { borderColor: '#00d4ff' },
                        },
                        '& .MuiInputLabel-root': { color: '#b0b3c7' },
                        '& .MuiOutlinedInput-input': { color: '#ffffff' },
                      }}
                    />
                    {newCourse.assessment.questions.map((question, qIdx) => (
                      <Card
                        key={qIdx}
                        sx={{
                          mb: 3,
                          borderRadius: 3,
                          border: '2px solid rgba(255, 152, 0, 0.2)',
                          background: 'linear-gradient(135deg, rgba(26, 32, 53, 0.8) 0%, rgba(22, 33, 62, 0.8) 100%)',
                        }}
                      >
                        <CardContent sx={{ p: 3 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="subtitle1" fontWeight="bold" color="#ffa726">
                              Question {qIdx + 1}
                            </Typography>
                            <IconButton
                              color="error"
                              onClick={() => removeQuestion(qIdx)}
                              sx={{ 
                                '&:hover': { 
                                  backgroundColor: 'rgba(244, 67, 54, 0.1)',
                                  transform: 'scale(1.1)',
                                },
                                transition: 'all 0.2s',
                              }}
                            >
                              <RemoveIcon />
                            </IconButton>
                          </Box>
                          <TextField
                            label={`Question ${qIdx + 1}`}
                            fullWidth
                            value={question.questionText}
                            onChange={(e) =>
                              handleQuestionChange(qIdx, "questionText", e.target.value)
                            }
                            sx={{ 
                              mb: 2,
                              '& .MuiOutlinedInput-root': {
                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                '& fieldset': { borderColor: 'rgba(255, 167, 38, 0.3)' },
                                '&:hover fieldset': { borderColor: '#ffa726' },
                                '&.Mui-focused fieldset': { borderColor: '#ff9800' },
                              },
                              '& .MuiInputLabel-root': { color: '#b0b3c7' },
                              '& .MuiOutlinedInput-input': { color: '#ffffff' },
                            }}
                          />
                          <Grid container spacing={2}>
                            {question.options.map((opt, optIdx) => (
                              <Grid item xs={12} sm={6} key={optIdx}>
                                <TextField
                                  label={`Option ${optIdx + 1}`}
                                  fullWidth
                                  value={opt}
                                  onChange={(e) =>
                                    handleOptionChange(qIdx, optIdx, e.target.value)
                                  }
                                  sx={{
                                    '& .MuiOutlinedInput-root': {
                                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                      '& fieldset': { borderColor: 'rgba(255, 167, 38, 0.3)' },
                                      '&:hover fieldset': { borderColor: '#ffa726' },
                                      '&.Mui-focused fieldset': { borderColor: '#ff9800' },
                                    },
                                    '& .MuiInputLabel-root': { color: '#b0b3c7' },
                                    '& .MuiOutlinedInput-input': { color: '#ffffff' },
                                  }}
                                />
                              </Grid>
                            ))}
                          </Grid>
                          <TextField
                            label="Correct Answer (Index 0-3)"
                            type="number"
                            inputProps={{ min: 0, max: 3 }}
                            fullWidth
                            value={question.answer !== null ? question.answer : ""}
                            onChange={(e) => {
                              const val = parseInt(e.target.value, 10);
                              handleQuestionChange(
                                qIdx,
                                "answer",
                                isNaN(val) ? null : val
                              );
                            }}
                            sx={{ 
                              mt: 2,
                              '& .MuiOutlinedInput-root': {
                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                '& fieldset': { borderColor: 'rgba(255, 167, 38, 0.3)' },
                                '&:hover fieldset': { borderColor: '#ffa726' },
                                '&.Mui-focused fieldset': { borderColor: '#ff9800' },
                              },
                              '& .MuiInputLabel-root': { color: '#b0b3c7' },
                              '& .MuiOutlinedInput-input': { color: '#ffffff' },
                            }}
                          />
                        </CardContent>
                      </Card>
                    ))}
                    <Button 
                      variant="outlined" 
                      onClick={addQuestion}
                      startIcon={<AddIcon />}
                      sx={{
                        borderRadius: 3,
                        borderColor: '#ffa726',
                        color: '#ffa726',
                        '&:hover': {
                          borderColor: '#ff9800',
                          backgroundColor: 'rgba(255, 167, 38, 0.1)',
                        },
                      }}
                    >
                      Add Question
                    </Button>
                  </Box>

                  <Button
                    type="submit"
                    variant="contained"
                    disabled={addingCourse}
                    sx={{ 
                      mt: 4,
                      py: 2,
                      px: 4,
                      borderRadius: 3,
                      background: 'linear-gradient(45deg, #00d4ff 30%, #5b73ff 90%)',
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #00bcd4 30%, #3f51b5 90%)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 10px 20px rgba(0, 212, 255, 0.3)',
                      },
                      transition: 'all 0.3s',
                    }}
                  >
                    {addingCourse ? "Creating Course..." : "🚀 Create Course"}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grow>
        )}

        {/* Courses List */}
        <Box>
          <Fade in timeout={2000}>
            <Typography 
              variant="h3" 
              sx={{ 
                mb: 4,
                textAlign: 'center',
                fontWeight: 'bold',
            
              }}
            >
              🌟 Featured Courses
            </Typography>
          </Fade>
          <Grid container spacing={4} justifyContent="center">
            {courses.map((course, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={course.id}>
                <Grow in timeout={1000 + index * 200}>
                  <Card
                    onClick={() => handleViewCourse(course.id)}
                    sx={{
                      height: '100%',
                      borderRadius: 4,
                      cursor: 'pointer',
                      background: 'rgba(26, 32, 53, 0.95)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(91, 115, 255, 0.3)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        transform: 'translateY(-8px) scale(1.02)',
                        '& .course-image': {
                          transform: 'scale(1.1)',
                        },
                        '& .play-icon': {
                          opacity: 1,
                          transform: 'scale(1)',
                        },
                      },
                    }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleViewCourse(course.id);
                    }}
                  >
                    <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                      <Box
                        className="course-image"
                        sx={{
                          width: '100%',
                          height: 200,
                          backgroundImage: `url(${course.image})`,
                          backgroundSize: 'cover ',
                          backgroundRepeat: 'no-repeat',
                          backgroundPosition: 'center',
                          transition: 'transform 0.3s',
                          position: 'relative',
                        }}
                      >
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <PlayIcon
                            className="play-icon"
                            sx={{
                              fontSize: 60,
                              color: 'white',
                              opacity: 0,
                              transform: 'scale(0.5)',
                              transition: 'all 0.3s',
                            }}
                          />
                        </Box>
                      </Box>
                      <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
                        <IconButton
                          sx={{
                            backgroundColor: 'rgba(26, 32, 53, 0.9)',
                            '&:hover': { backgroundColor: 'rgba(26, 32, 53, 1)' },
                          }}
                        >
                          <BookmarkIcon sx={{ color: '#e5ff00ff' }} />
                        </IconButton>
                      </Box>
                    </Box>

                    <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <SchoolIcon sx={{ fontSize: 28, color: '#b7ff00ff', mr: 1 }} />
                        <Chip
                          label="Premium"
                          size="small"
                          sx={{
                            background: 'linear-gradient(45deg, #ff002bff 30%, #ff5b7cff 90%)',
                            color: 'white',
                            fontWeight: 'bold',
                          }}
                        />
                      </Box>
                      
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 'bold',
                          mb: 1,
                          color: '#ffffff',
                          lineHeight: 1.3,
                        }}
                      >
                        {course.title}
                      </Typography>
                      
                      <Typography
                        variant="body2"
                        sx={{ 
                          color: '#b0b3c7',
                          mb: 2,
                          flexGrow: 1,
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {course.description}
                      </Typography>

                      <Box sx={{ display: 'block', alignItems: 'center', justifyContent: 'space-between', mt: 'auto' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2}}>
                          <StarIcon sx={{ color: '#ffc107', fontSize: 20, mr: 0.5 }} />
                          <Typography variant="body2" sx={{ color: '#b0b3c7', mr: 1 }}>
                            4.8
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#8a8fa3' }}>
                            ({Math.floor(Math.random() * 500) + 100} reviews)
                          </Typography>
                        </Box>
                        <Button
                          variant="contained"
                          size="small"
                          sx={{
                            borderRadius: 2,
                            padding: '6px 16px',
                            color: 'white',
                            background: 'linear-gradient(45deg, #00d4ff 30%, #5b73ff 90%)',
                            '&:hover': {
                              background: 'linear-gradient(45deg, #00bcd4 30%, #3f51b5 90%)',
                            },
                          }}
                          onClick={async (e) => {
                            e.stopPropagation();
                            // Add course to user's startedCourses in profiles collection
                            if (user) {
                              try {
                                const profileRef = doc(db, 'profiles', user.uid);
                                const profileSnap = await getDocs(collection(db, 'profiles'));
                                let profileData = {};
                                const userProfileDoc = profileSnap.docs.find(d => d.id === user.uid);
                                if (userProfileDoc && userProfileDoc.exists()) {
                                  profileData = userProfileDoc.data();
                                }
                                const startedCourses = profileData.startedCourses || [];
                                if (!startedCourses.includes(course.id)) {
                                  const updatedCourses = [...startedCourses, course.id];
                                  await setDoc(profileRef, { ...profileData, startedCourses: updatedCourses }, { merge: true });
                                }
                              } catch (err) {
                                console.error('Error adding course to profile:', err);
                              }
                            }
                            handleViewCourse(course.id);
                          }}
                        >
                          Start Learning
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grow>
              </Grid>
            ))}
          </Grid>

          {courses.length === 0 && (
            <Fade in timeout={2000}>
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <SchoolIcon sx={{ fontSize: 80, color: 'rgba(255, 255, 255, 0.3)', mb: 2 }} />
                <Typography variant="h5" sx={{ color: '#b0b3c7', mb: 1 }}>
                  No courses available yet
                </Typography>
                <Typography variant="body1" sx={{ color: '#8a8fa3' }}>
                  Check back soon for exciting new courses!
                </Typography>
              </Box>
            </Fade>
          )}
        </Box>
      </Container>
    </Box>
  );
}

Learning.propTypes = {
  router: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

export default Learning;
