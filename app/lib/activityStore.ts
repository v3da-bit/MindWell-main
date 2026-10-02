interface ActivityPoint {
  ts: number;
  speech?: number;
  faceExpression?: number;
  // Add other activity types as needed
}

const activityPoints: ActivityPoint[] = [];

function appendPoint(point: ActivityPoint) {
  activityPoints.push(point);
  // Optionally, persist or batch send points here
}

function getPoints() {
  return [...activityPoints];
}

export { appendPoint, getPoints };
