# Squad Pulse

Squad Pulse is a training-load and recovery dashboard concept for athletic teams. The current prototype demonstrates its workflow with generated, smartwatch-style data; it does not yet integrate with wearable providers or persist team data.

## Product vocabulary

**Squad Pulse**

The product concept for translating athlete workload and recovery signals into guidance for a team. In this prototype, those signals are synthetic.

**Team**

The group of athletes whose workload, readiness, and recovery signals are reviewed together.

_Avoid_: Roster, squad grid

**Athlete**

An individual represented in team data, with a profile, biometric-style metrics, and training history.

_Avoid_: Player

**Insights**

Coaching recommendations generated from an athlete's readiness, workload, and recovery signals.

_Avoid_: AI Coach, Head of Performance

## Prototype boundaries

- The backend generates sample histories for eight demo athletes; it does not ingest data from Apple Health, Garmin, Fitbit, or another wearable service.
- The API stores data in memory, so histories reset when the backend restarts.
- Workload zones and readiness scores are demo calculations, not clinical measurements or validated injury predictions.
