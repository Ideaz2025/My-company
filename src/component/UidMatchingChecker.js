import React, { useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Card,
  CardContent,
  Stack,
} from "@mui/material";

// Utility to convert Firestore docs to UID set
async function fetchUidSet(colName) {
  const db = getFirestore();
  const snapshot = await getDocs(collection(db, colName));
  const uidSet = new Set();
  snapshot.forEach((doc) => uidSet.add(doc.id));
  return uidSet;
}

export default function UidMatchingChecker() {
  const [matched, setMatched] = useState([]);
  const [missingProfiles, setMissingProfiles] = useState([]);
  const [missingMetrics, setMissingMetrics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkMatches() {
      setLoading(true);
      // Fetch all UIDs from both collections
      const profileUids = await fetchUidSet("profiles");
      const metricUids = await fetchUidSet("userMetrics");

      // Find matches and mismatches
      const matches = [...profileUids].filter(uid => metricUids.has(uid));
      const onlyInProfiles = [...profileUids].filter(uid => !metricUids.has(uid));
      const onlyInMetrics = [...metricUids].filter(uid => !profileUids.has(uid));
      setMatched(matches);
      setMissingProfiles(onlyInMetrics);
      setMissingMetrics(onlyInProfiles);
      setLoading(false);
    }
    checkMatches();
  }, []);

  return (
    <Box sx={{ maxWidth: 600, m: "auto", mt: 4 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Firebase Profile–Metrics UID Consistency Check
          </Typography>
          {loading ? (
            <Typography variant="body1">Checking user consistency...</Typography>
          ) : (
            <Stack spacing={3}>
              <Box>
                <Typography variant="h6" sx={{ color: "#2196f3" }}>
                  Matched Users
                </Typography>
                <TableContainer component={Paper}>
                  <Table size="small">
                    <TableBody>
                      {matched.length === 0 ? (
                        <TableRow><TableCell>No matched UIDs</TableCell></TableRow>
                      ) : (
                        matched.map(uid => (
                          <TableRow key={uid}>
                            <TableCell>{uid}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>

              <Box>
                <Typography variant="h6" sx={{ color: "#ff9800" }}>
                  UIDs in userMetrics, Missing in profiles
                </Typography>
                <TableContainer component={Paper}>
                  <Table size="small">
                    <TableBody>
                      {missingProfiles.length === 0 ? (
                        <TableRow><TableCell>None</TableCell></TableRow>
                      ) : (
                        missingProfiles.map(uid => (
                          <TableRow key={uid}>
                            <TableCell>{uid}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>

              <Box>
                <Typography variant="h6" sx={{ color: "#e91e63" }}>
                  UIDs in profiles, Missing in userMetrics
                </Typography>
                <TableContainer component={Paper}>
                  <Table size="small">
                    <TableBody>
                      {missingMetrics.length === 0 ? (
                        <TableRow><TableCell>None</TableCell></TableRow>
                      ) : (
                        missingMetrics.map(uid => (
                          <TableRow key={uid}>
                            <TableCell>{uid}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Stack>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}