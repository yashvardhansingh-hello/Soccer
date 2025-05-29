// client/src/App.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Spinner, Tab, Tabs } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFutbol,
  faClock,
  faCalendarAlt,
} from "@fortawesome/free-solid-svg-icons";
import "./App.css";

function App() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/matches");
        setMatches(response.data.matches);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p>Loading matches...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <div className="alert alert-danger" role="alert">
          Error: {error}
        </div>
      </Container>
    );
  }
  if (!matches || matches.length === 0) {
    return (
      <Container className="text-center mt-5">
        <p>No matches available at the moment.</p>
      </Container>
    );
  }
  // Filter matches for today
  const todayMatches = matches.filter(
    (match) =>
      new Date(match.utcDate).toDateString() === new Date().toDateString()
  );
  const upcomingMatches = matches.filter(
    (match) => new Date(match.utcDate) > new Date()
  );
  return (
    <Container className="mt-4">
      <h1 className="text-center mb-4">
        <FontAwesomeIcon icon={faFutbol} /> Football Matches
      </h1>

      <Tabs defaultActiveKey="Today" id="matches-tab" className="mb-3">
        <Tab eventKey="Today" title={`Today (${todayMatches.length})`}>
          <MatchList matches={todayMatches} />
        </Tab>
        <Tab eventKey="Upcoming" title={`Upcoming (${upcomingMatches.length})`}>
          <MatchList matches={upcomingMatches} />
        </Tab>
      </Tabs>
    </Container>
  );
}

function MatchList({ matches }) {
  if (matches.length === 0) {
    return (
      <div className="text-center mt-4">
        <p>No matches found.</p>
      </div>
    );
  }

  return (
    <Row xs={1} md={2} lg={3} className="g-4 mt-2">
      {matches.map((match) => (
        <Col key={match.id}>
          <MatchCard match={match} />
        </Col>
      ))}
    </Row>
  );
}

function MatchCard({ match }) {
  const homeTeam = match.homeTeam?.name || "TBD";
  const awayTeam = match.awayTeam?.name || "TBD";
  const competition = match.competition?.name || "Unknown Competition";

  // Format match time
  const matchDate = new Date(match.utcDate);
  const timeString = matchDate.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const dateString = matchDate.toLocaleDateString();

  return (
    <Card className="h-100">
      <Card.Header className="text-center py-2">
        <small className="text-muted">{competition}</small>
      </Card.Header>
      <Card.Body className="text-center">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="team text-center" style={{ width: "40%" }}>
            <div className="fw-bold text-wrap">{homeTeam}</div>
            <img
              src={`https://crests.football-data.org/${
                match.homeTeam?.id || "default"
              }.svg`}
              alt={homeTeam}
              style={{ height: "50px", width: "50px", objectFit: "contain" }}
              onError={(e) => {
                e.target.src =
                  "https://w7.pngwing.com/pngs/783/127/png-transparent-football-template-logo-soccer-crest-template-emblem-sport-heart.png";
              }}
            />
          </div>

          <div className="score mx-2">
            <div className="text-muted small">
              <FontAwesomeIcon icon={faClock} /> {timeString}
            </div>
          </div>

          <div className="team text-center" style={{ width: "40%" }}>
            <div className="fw-bold text-wrap">{awayTeam}</div>
            <img
              src={`https://crests.football-data.org/${
                match.awayTeam?.id || "default"
              }.svg`}
              alt={awayTeam}
              style={{ height: "50px", width: "50px", objectFit: "contain" }}
              onError={(e) => {
                e.target.src =
                  "https://w7.pngwing.com/pngs/783/127/png-transparent-football-template-logo-soccer-crest-template-emblem-sport-heart.png"; // Fallback image if crest not found
              }}
            />
          </div>
        </div>
      </Card.Body>
      <Card.Footer className="text-center py-1">
        <small className="text-muted">
          <FontAwesomeIcon icon={faCalendarAlt} /> {dateString}
        </small>
      </Card.Footer>
    </Card>
  );
}

export default App;
