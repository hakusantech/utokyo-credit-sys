# 東京大学 単位管理システム

Next.js App Router + Hasura DDN を使用した大学の単位管理システムです。

## 🚀 技術スタック

- **フロントエンド**: Next.js 15 (App Router)
- **バックエンド**: Hasura DDN v3.x
- **データベース**: PostgreSQL (pgvector)
- **スタイリング**: Tailwind CSS
- **GraphQL**: graphql-request + @tanstack/react-query
- **型安全性**: TypeScript + GraphQL Code Generator

## 📁 プロジェクト構成

```
material_system/
├── utokyo-credit-sys/          # Hasura DDN プロジェクト
│   ├── app/
│   │   ├── connector/
│   │   │   └── pg_utokyo/      # PostgreSQL コネクタ
│   │   └── metadata/           # GraphQL スキーマ定義
│   ├── setup_tables.sql        # データベース初期化スクリプト
│   └── supergraph.yaml         # スーパーグラフ設定
└── utokyo-credit-web/          # Next.js フロントエンド
    ├── src/
    │   ├── app/                # App Router ページ
    │   │   ├── students/       # 学生管理
    │   │   ├── courses/        # 授業管理
    │   │   └── enrollments/    # 履修管理
    │   └── lib/                # ユーティリティ
    ├── codegen.ts              # GraphQL コード生成設定
    └── .env.local              # 環境変数
```

## 🛠️ セットアップ手順

### 1. 前提条件

- Node.js ≥ 20
- pnpm
- Docker Desktop
- Hasura DDN CLI

### 2. Hasura DDN プロジェクトの起動

```bash
cd utokyo-credit-sys

# PostgreSQL & Adminer 起動
docker compose -f app/connector/pg_utokyo/compose.postgres-adminer.yaml up -d

# データベース初期化
docker exec -i pg_utokyo-postgres-1 psql -U user -d dev < setup_tables.sql

# スキーマイントロスペクト
ddn connector introspect pg_utokyo
ddn model add pg_utokyo "*"
ddn command add pg_utokyo "*"
ddn relationship add pg_utokyo "*"

# スーパーグラフビルド & エンジン起動
ddn supergraph build local
ddn run docker-start
```

### 3. Next.js アプリケーションの起動

```bash
cd utokyo-credit-web

# 依存関係インストール
pnpm install

# 開発サーバー起動
pnpm dev
```

## 🌐 アクセス URL

- **Next.js アプリ**: http://localhost:3000
- **Hasura GraphQL API**: http://localhost:8181/v1/graphql
- **Adminer (DB管理)**: http://localhost:5466

## 📊 データベーススキーマ

### Students (学生)
- `id`: 主キー
- `student_number`: 学籍番号
- `name`: 氏名
- `email`: メールアドレス
- `entry_year`: 入学年度
- `department`: 学部

### Courses (授業)
- `id`: 主キー
- `course_code`: 科目コード
- `name`: 授業名
- `description`: 授業説明
- `credits`: 単位数
- `department`: 開講学部
- `instructor`: 担当教員

### Enrollments (履修)
- `id`: 主キー
- `student_id`: 学生ID (外部キー)
- `course_id`: 授業ID (外部キー)
- `grade`: 成績 (A+, A, B+, B, C+, C, D, F)
- `status`: ステータス (enrolled, completed, dropped)
- `enrollment_date`: 履修日

## 🎯 主な機能

### ✅ 実装済み
- 学生一覧表示
- 授業一覧表示
- 履修管理（成績・ステータス表示）
- リアルタイムデータ同期
- レスポンシブデザイン

### 🚧 今後の拡張予定
- 認証・認可 (NextAuth.js + JWT)
- 履修登録機能
- 成績入力機能
- ダッシュボード
- GraphQL Subscriptions
- 検索・フィルタリング

## 🔧 開発コマンド

```bash
# GraphQL スキーマ更新時
pnpm codegen

# 型チェック
pnpm build

# リンター実行
pnpm lint
```

## 📝 環境変数

```env
# .env.local
NEXT_PUBLIC_HASURA_GRAPHQL_ENDPOINT=http://localhost:8181/v1/graphql
HASURA_ADMIN_SECRET=your_admin_secret_here
```

## 🤝 コントリビューション

1. このリポジトリをフォーク
2. フィーチャーブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📄 ライセンス

このプロジェクトは MIT ライセンスの下で公開されています。

---

**開発者**: Next.js App Router + Hasura DDN スタック構築ガイド v0.1 に基づいて構築 