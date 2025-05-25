import { gqlClient } from '@/lib/graphql-client';
import { GET_COURSES_QUERY } from '@/lib/queries';
import Link from 'next/link';

interface Course {
  id: number;
  course_code: string;
  name: string;
  description: string;
  credits: number;
  department: string;
  instructor: string;
}

async function getCourses(): Promise<Course[]> {
  try {
    const data = await gqlClient.request<{ courses: Course[] }>(GET_COURSES_QUERY);
    return data.courses;
  } catch (error) {
    console.error('Failed to fetch courses:', error);
    return [];
  }
}

export default async function CoursesPage() {
  const courses = await getCourses();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">授業一覧</h1>
          <Link 
            href="/"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            ホームに戻る
          </Link>
        </div>

        {courses.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <p className="text-gray-600">授業データが見つかりません。</p>
            <p className="text-sm text-gray-500 mt-2">
              Hasura DDNエンジンが起動していることを確認してください。
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div key={course.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{course.name}</h3>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {course.credits}単位
                  </span>
                </div>
                
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">科目コード:</span> {course.course_code}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">担当教員:</span> {course.instructor}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">開講学部:</span> {course.department}
                  </p>
                </div>

                {course.description && (
                  <p className="text-sm text-gray-700 mb-4 line-clamp-3">
                    {course.description}
                  </p>
                )}

                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">ID: {course.id}</span>
                  <button className="bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1 rounded transition-colors">
                    詳細を見る
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            総授業数: {courses.length}科目
          </p>
        </div>
      </div>
    </div>
  );
} 