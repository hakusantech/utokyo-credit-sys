-- 東京大学工学部 単位計算プラットフォーム
-- データモデル仕様 v0.4 (PostgreSQL 16)
--
-- This schema defines enumerated types and tables for the credit
-- calculation system. The design follows the specification provided
-- in the repository documentation.

-- 0. ENUM definitions
CREATE TYPE requirement_level AS ENUM ('MANDATORY', 'LIMITED', 'RECOMMENDED', 'OPTIONAL');
CREATE TYPE grade AS ENUM ('S','A','B','C','D','F','P','NP');
CREATE TYPE lecture_type AS ENUM ('LECTURE','EXERCISE','LAB','SEMINAR','PROJECT','THESIS');

-- 1. Basic master tables
CREATE TABLE department (
  department_code varchar(8) PRIMARY KEY,
  name_ja text NOT NULL,
  name_en text NOT NULL
);

CREATE TABLE program (
  program_code varchar(8) PRIMARY KEY,
  name_ja text NOT NULL,
  level varchar(3) CHECK (level IN ('BSc','MSc','PhD'))
);

-- 2. Student, Course and related tables
CREATE TABLE student (
  student_id bigint PRIMARY KEY,
  name text NOT NULL,
  entry_year smallint NOT NULL,
  department_code varchar(8) REFERENCES department,
  program_code varchar(8) REFERENCES program,
  status varchar(12) DEFAULT 'ENROLLED'
);
CREATE INDEX idx_student_dept_year ON student(department_code, entry_year);

CREATE TABLE course (
  course_id varchar(12) PRIMARY KEY,
  course_code varchar(12) NOT NULL,
  title_ja text NOT NULL,
  title_en text,
  credits numeric(3,1) NOT NULL CHECK (credits>0),
  lecture_type lecture_type NOT NULL,
  level varchar(16) DEFAULT 'UNDERGRAD',
  is_english boolean DEFAULT false
);
CREATE INDEX idx_course_code ON course(course_code);

CREATE TABLE course_category (
  category varchar(16) PRIMARY KEY,
  name_ja text NOT NULL,
  description text
);

CREATE TABLE course_category_map (
  course_id varchar(12) REFERENCES course ON DELETE CASCADE,
  category varchar(16) REFERENCES course_category,
  PRIMARY KEY(course_id, category)
);

CREATE TABLE course_group (
  group_id varchar(16) PRIMARY KEY,
  group_name text NOT NULL,
  description text
);

CREATE TABLE course_group_map (
  group_id varchar(16) REFERENCES course_group ON DELETE CASCADE,
  course_id varchar(12) REFERENCES course ON DELETE CASCADE,
  PRIMARY KEY(group_id, course_id)
);

CREATE TABLE schedule (
  schedule_id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  course_id varchar(12) REFERENCES course ON DELETE CASCADE,
  academic_year smallint NOT NULL,
  semester varchar(3) NOT NULL,
  day_of_week char(3) NOT NULL,
  period smallint NOT NULL,
  instructor text,
  campus varchar(16)
);
CREATE INDEX idx_schedule_year ON schedule(academic_year);

CREATE TABLE enrollment (
  enrollment_id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  student_id bigint REFERENCES student ON DELETE CASCADE,
  schedule_id bigint REFERENCES schedule ON DELETE CASCADE,
  grade grade NOT NULL,
  passed boolean GENERATED ALWAYS AS (grade IN ('S','A','B','C','P')) STORED,
  earned_credits numeric(3,1) GENERATED ALWAYS AS (
    CASE WHEN passed THEN (
      SELECT credits FROM course
      WHERE course_id = (
        SELECT course_id FROM schedule WHERE schedule_id=enrollment.schedule_id
      )
    ) ELSE 0 END
  ) STORED,
  UNIQUE(student_id, schedule_id)
);

-- 3. Graduation requirement master tables
CREATE TABLE requirement_set (
  reqset_id varchar(32) PRIMARY KEY,
  department_code varchar(8) REFERENCES department,
  program_code varchar(8) REFERENCES program,
  entry_year_from smallint NOT NULL,
  entry_year_to smallint NOT NULL,
  total_credits_required numeric(4,1) NOT NULL
);

CREATE TABLE requirement_rule (
  rule_id varchar(40) PRIMARY KEY,
  reqset_id varchar(32) REFERENCES requirement_set ON DELETE CASCADE,
  rule_name text NOT NULL,
  rule_type varchar(8) NOT NULL CHECK (rule_type IN ('SINGLE','CATEGORY','GROUP')),
  min_credits numeric(4,1) DEFAULT 0,
  min_courses smallint DEFAULT 0
);

CREATE TABLE rule_course_map (
  rule_id varchar(40) REFERENCES requirement_rule ON DELETE CASCADE,
  course_id varchar(12) REFERENCES course ON DELETE CASCADE,
  requirement_level requirement_level NOT NULL,
  PRIMARY KEY(rule_id, course_id)
);

CREATE TABLE rule_group_map (
  rule_id varchar(40) REFERENCES requirement_rule ON DELETE CASCADE,
  group_id varchar(16) REFERENCES course_group ON DELETE CASCADE,
  requirement_level requirement_level NOT NULL,
  PRIMARY KEY(rule_id, group_id)
);

-- 4. Other tables
CREATE TABLE transfer_credit (
  transfer_id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  student_id bigint REFERENCES student ON DELETE CASCADE,
  source text NOT NULL,
  course_title text,
  credits numeric(3,1) NOT NULL,
  category varchar(16),
  approved_on date DEFAULT CURRENT_DATE
);

CREATE TABLE graduation_audit (
  audit_id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  student_id bigint REFERENCES student ON DELETE CASCADE,
  audit_date timestamptz DEFAULT now(),
  result boolean NOT NULL,
  deficit_detail_json jsonb
);
