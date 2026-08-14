import type { Assignment } from "@/features/assignments/types";
import type { Course } from "@/features/courses/types";
import type { Student } from "@/features/students/types";
import type { Submission } from "@/features/submissions/types";
import type { Teacher } from "@/features/teachers/types";
import { parseApiDate } from "@/shared/utils/date";
import type { ActivityItem, ActivitySegment } from "../types";

export interface ActivitySources {
  assignments: readonly Assignment[];
  submissions: readonly Submission[];
  courses: readonly Course[];
  teachers: readonly Teacher[];
  students: readonly Student[];
}

/**
 * Names an entity for the feed. An id the lookup pool does not cover — the pools
 * are capped — degrades to a plain fallback rather than an emphasized guess.
 */
function nameOf(names: ReadonlyMap<string, string>, id: string, fallback: string): ActivitySegment {
  const name = names.get(id);
  return name ? { text: name, emphasis: true } : { text: fallback };
}

function toNameMap<T>(items: readonly T[], getId: (item: T) => string, getName: (item: T) => string) {
  return new Map(items.map((item) => [getId(item), getName(item)]));
}

function assignmentActivity(
  assignment: Assignment,
  teacherNames: ReadonlyMap<string, string>,
  courseNames: ReadonlyMap<string, string>,
): ActivityItem {
  const teacher = nameOf(teacherNames, assignment.teacherId, "A teacher");
  const course = nameOf(courseNames, assignment.courseId, "a course");

  if (assignment.status === "Draft") {
    return {
      id: `assignment-drafted:${assignment.id}`,
      kind: "assignment-drafted",
      segments: [
        teacher,
        { text: " drafted " },
        { text: assignment.title, emphasis: true },
        { text: " in " },
        course,
        { text: "." },
      ],
      occurredAt: assignment.createdAt,
    };
  }

  if (assignment.status === "Closed") {
    return {
      id: `assignment-closed:${assignment.id}`,
      kind: "assignment-closed",
      segments: [
        teacher,
        { text: " closed " },
        { text: assignment.title, emphasis: true },
        { text: " in " },
        course,
        { text: "." },
      ],
      occurredAt: assignment.updatedAt ?? assignment.createdAt,
    };
  }

  return {
    id: `assignment-published:${assignment.id}`,
    kind: "assignment-published",
    segments: [
      teacher,
      { text: " published a new assignment in " },
      course,
      { text: "." },
    ],
    occurredAt: assignment.updatedAt ?? assignment.createdAt,
  };
}

function submissionActivity(
  submission: Submission,
  assignmentTitles: ReadonlyMap<string, string>,
  studentNames: ReadonlyMap<string, string>,
): ActivityItem {
  const student = nameOf(studentNames, submission.studentId, "A student");
  const assignment = nameOf(assignmentTitles, submission.assignmentId, "an assignment");

  if (submission.status === "Graded" && submission.reviewedAt) {
    return {
      id: `submission-graded:${submission.id}`,
      kind: "submission-graded",
      segments: [
        student,
        { text: "'s submission for " },
        assignment,
        { text: " was graded." },
      ],
      occurredAt: submission.reviewedAt,
    };
  }

  return {
    id: `submission-received:${submission.id}`,
    kind: "submission-received",
    segments: [
      student,
      { text: " submitted " },
      assignment,
      { text: submission.status === "LateSubmitted" ? " after the deadline." : "." },
    ],
    occurredAt: submission.createdAt,
  };
}

function courseActivity(course: Course): ActivityItem {
  return {
    id: `course-created:${course.id}`,
    kind: "course-created",
    segments: [
      { text: "New course " },
      { text: course.name, emphasis: true },
      { text: " was added." },
    ],
    occurredAt: course.createdAt,
  };
}

/**
 * Builds the recent-activity feed.
 *
 * The API has no activity or audit endpoint, so the feed is derived from the
 * timestamps the domain records already carry: one event per assignment
 * (drafted or published), per submission (received or graded), and per course.
 * Entries the lookup pools cannot name still appear, described generically.
 */
export function buildActivityFeed(sources: ActivitySources, limit: number): ActivityItem[] {
  const teacherNames = toNameMap(sources.teachers, (teacher) => teacher.id, (teacher) => teacher.fullName);
  const studentNames = toNameMap(sources.students, (student) => student.id, (student) => student.fullName);
  const courseNames = toNameMap(sources.courses, (course) => course.id, (course) => course.name);
  const assignmentTitles = toNameMap(
    sources.assignments,
    (assignment) => assignment.id,
    (assignment) => assignment.title,
  );

  const items: ActivityItem[] = [
    ...sources.assignments.map((assignment) =>
      assignmentActivity(assignment, teacherNames, courseNames),
    ),
    ...sources.submissions.map((submission) =>
      submissionActivity(submission, assignmentTitles, studentNames),
    ),
    ...sources.courses.map(courseActivity),
  ];

  return items
    .map((item) => ({ item, timestamp: parseApiDate(item.occurredAt)?.getTime() ?? null }))
    .filter((entry): entry is { item: ActivityItem; timestamp: number } => entry.timestamp !== null)
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, limit)
    .map((entry) => entry.item);
}
