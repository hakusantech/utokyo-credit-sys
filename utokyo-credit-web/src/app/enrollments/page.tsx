import { gqlClient } from '@/lib/graphql-client';
import { GET_ENROLLMENTS_QUERY } from '@/lib/queries';
import Link from 'next/link';

interface Enrollment {
  id: number;
  grade: string | null;
  status: string;
  enrollment_date: string;
  student: {
    id: number;
    name: string;
    student_number: string;
  };
  course: {
    id: number;
    name: string;
    course_code: string;
    credits: number;
  };
}

async function getEnrollments(): Promise<Enrollment[]> {
  try {
    const data = await gqlClient.request<{ enrollments: Enrollment[] }>(GET_ENROLLMENTS_QUERY);
    return data.enrollments;
  } catch (error) {
    console.error('Failed to fetch enrollments:', error);
    return [];
  }
}

function getStatusBadge(status: string) {
  const statusConfig = {
    enrolled: { color: 'bg-blue-100 text-blue-800', text: '履修中' },
    completed: { color: 'bg-green-100 text-green-800', text: '完了' },
    dropped: { color: 'bg-red-100 text-red-800', text: '履修取消' },
  };
  
  const config = statusConfig[status as keyof typeof statusConfig] || 
    { color: 'bg-gray-100 text-gray-800', text: status };
  
  return (
    <span className={`${config.color} text-xs font-medium px-2.5 py-0.5 rounded`}>
      {config.text}
    </span>
  );
}

function getGradeBadge(grade: string | null) {
  if (!grade) {
    return <span className="text-gray-400 text-sm">未評価</span>;
  }
  
  const gradeColors = {
    'A+': 'bg-purple-100 text-purple-800',
    'A': 'bg-blue-100 text-blue-800',
    'A-': 'bg-blue-100 text-blue-700',
    'B+': 'bg-green-100 text-green-800',
    'B': 'bg-green-100 text-green-700',
    'B-': 'bg-green-100 text-green-600',
    'C+': 'bg-yellow-100 text-yellow-800',
    'C': 'bg-yellow-100 text-yellow-700',
    'D': 'bg-orange-100 text-orange-800',
    'F': 'bg-red-100 text-red-800',
  };
  
  const color = gradeColors[grade as keyof typeof gradeColors] || 'bg-gray-100 text-gray-800';
  
  return (
    <span className={`${color} text-sm font-medium px-2 py-1 rounded`}>
      {grade}
    </span>
  );
}

export default async function EnrollmentsPage() {
  const enrollments = await getEnrollments();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">履修管理</h1>
          <Link 
            href="/"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            ホームに戻る
          </Link>
        </div>

        {enrollments.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <p className="text-gray-600">履修データが見つかりません。</p>
            <p className="text-sm text-gray-500 mt-2">
              Hasura DDNエンジンが起動していることを確認してください。
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      学生
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      授業
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      単位数
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ステータス
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      成績
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      履修日
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {enrollments.map((enrollment) => (
                    <tr key={enrollment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {enrollment.student.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {enrollment.student.student_number}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {enrollment.course.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {enrollment.course.course_code}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {enrollment.course.credits}単位
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(enrollment.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getGradeBadge(enrollment.grade)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(enrollment.enrollment_date).toLocaleDateString('ja-JP')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <p className="text-2xl font-bold text-blue-600">
              {enrollments.length}
            </p>
            <p className="text-sm text-gray-500">総履修数</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <p className="text-2xl font-bold text-green-600">
              {enrollments.filter(e => e.status === 'completed').length}
            </p>
            <p className="text-sm text-gray-500">完了済み</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <p className="text-2xl font-bold text-orange-600">
              {enrollments.filter(e => e.status === 'enrolled').length}
            </p>
            <p className="text-sm text-gray-500">履修中</p>
          </div>
        </div>
      </div>
    </div>
  );
} 