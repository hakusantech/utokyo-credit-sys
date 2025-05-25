import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            東京大学 単位管理システム
          </h1>
          <p className="text-xl text-gray-600">
            University of Tokyo Credit Management System
          </p>
        </header>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <Link href="/students" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-center">
                <div className="text-blue-500 text-3xl mb-4">👨‍🎓</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">学生管理</h3>
                <p className="text-gray-600">学生情報の表示・管理</p>
              </div>
            </Link>

            <Link href="/courses" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-center">
                <div className="text-green-500 text-3xl mb-4">📚</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">授業管理</h3>
                <p className="text-gray-600">授業・科目の表示・管理</p>
              </div>
            </Link>

            <Link href="/enrollments" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-center">
                <div className="text-purple-500 text-3xl mb-4">📝</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">履修管理</h3>
                <p className="text-gray-600">履修登録・成績管理</p>
              </div>
            </Link>

          </div>

          <div className="mt-12 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">システム概要</h2>
            <div className="prose text-gray-600">
              <p>
                このシステムは Next.js App Router と Hasura DDN を使用して構築された
                東京大学の単位管理システムです。
              </p>
              <ul className="mt-4 space-y-2">
                <li>✅ リアルタイムデータ同期</li>
                <li>✅ 型安全な GraphQL API</li>
                <li>✅ モダンな UI/UX</li>
                <li>✅ サーバーサイドレンダリング</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
