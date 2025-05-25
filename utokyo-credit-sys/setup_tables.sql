-- University Credit System Database Schema

-- Students table
CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    student_number VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    entry_year INTEGER NOT NULL,
    department VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Courses table
CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    course_code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    credits INTEGER NOT NULL,
    department VARCHAR(100) NOT NULL,
    instructor VARCHAR(100) NOT NULL,
    max_students INTEGER DEFAULT 50,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enrollments table (junction table between students and courses)
CREATE TABLE enrollments (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
    course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
    enrollment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    grade VARCHAR(2), -- A+, A, B+, B, C+, C, D, F
    status VARCHAR(20) DEFAULT 'enrolled', -- enrolled, completed, dropped
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(student_id, course_id)
);

-- Insert sample data
INSERT INTO students (student_number, name, email, entry_year, department) VALUES
('2024001', '田中太郎', 'tanaka@mail.u-tokyo.ac.jp', 2024, '工学部'),
('2024002', '佐藤花子', 'sato@mail.u-tokyo.ac.jp', 2024, '理学部'),
('2023001', '山田次郎', 'yamada@mail.u-tokyo.ac.jp', 2023, '工学部'),
('2023002', '鈴木三郎', 'suzuki@mail.u-tokyo.ac.jp', 2023, '文学部'),
('2022001', '高橋美咲', 'takahashi@mail.u-tokyo.ac.jp', 2022, '経済学部');

INSERT INTO courses (course_code, name, description, credits, department, instructor, max_students) VALUES
('CS101', 'プログラミング入門', 'プログラミングの基礎を学ぶ', 2, '工学部', '田村教授', 100),
('MATH201', '線形代数学', '線形代数の理論と応用', 3, '理学部', '佐々木教授', 80),
('PHYS101', '物理学概論', '物理学の基本概念', 3, '理学部', '中村教授', 60),
('ENG101', '英語コミュニケーション', '実践的英語スキル', 2, '教養学部', 'Johnson教授', 40),
('ECON301', 'ミクロ経済学', '経済学の基礎理論', 4, '経済学部', '伊藤教授', 120);

INSERT INTO enrollments (student_id, course_id, grade, status) VALUES
(1, 1, 'A', 'completed'),
(1, 2, 'B+', 'completed'),
(1, 4, NULL, 'enrolled'),
(2, 2, 'A+', 'completed'),
(2, 3, 'A', 'completed'),
(2, 4, NULL, 'enrolled'),
(3, 1, 'B', 'completed'),
(3, 5, NULL, 'enrolled'),
(4, 4, 'A-', 'completed'),
(4, 5, NULL, 'enrolled'),
(5, 5, 'B+', 'completed'); 