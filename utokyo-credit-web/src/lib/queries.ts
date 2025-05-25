// Simple GraphQL queries for the university credit system

export const GET_STUDENTS_QUERY = `
  query GetStudents {
    students {
      id
      student_number
      name
      email
      entry_year
      department
    }
  }
`;

export const GET_COURSES_QUERY = `
  query GetCourses {
    courses {
      id
      course_code
      name
      description
      credits
      department
      instructor
    }
  }
`;

export const GET_ENROLLMENTS_QUERY = `
  query GetEnrollments {
    enrollments {
      id
      grade
      status
      enrollment_date
      student {
        id
        name
        student_number
      }
      course {
        id
        name
        course_code
        credits
      }
    }
  }
`; 