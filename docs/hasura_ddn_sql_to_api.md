# Hasura DDN を用いた SQL スキーマの API 化手順

このドキュメントでは、本リポジトリに含まれる SQL スキーマを Hasura DDN を使って GraphQL API として公開する流れを説明します。既存の `setup_tables.sql` や `schema_v0_4.sql` を取り込むことで、学生・授業・履修データを即座に操作できる API を構築できます。

## 1. 必要ツール

- Docker Desktop
- Hasura DDN CLI
- `psql` などの PostgreSQL クライアント

## 2. データベースの起動とスキーマ登録

1. プロジェクトの `utokyo-credit-sys` ディレクトリで PostgreSQL と Adminer を起動します。

```bash
cd utokyo-credit-sys

docker compose -f app/connector/pg_utokyo/compose.postgres-adminer.yaml up -d
```

2. 起動したコンテナへ SQL ファイルを流し込みます。初期テーブル定義とサンプルデータは `setup_tables.sql`、拡張スキーマは `schema_v0_4.sql` にあります。

```bash
docker exec -i pg_utokyo-postgres-1 psql -U user -d dev < setup_tables.sql
# 追加で拡張スキーマを適用したい場合
docker exec -i pg_utokyo-postgres-1 psql -U user -d dev < schema_v0_4.sql
```

## 3. Hasura DDN でのスキーマ取り込み

1. DDN CLI を使い、PostgreSQL コネクタ `pg_utokyo` をイントロスペクトします。

```bash
ddn connector introspect pg_utokyo
```

2. スキーマに含まれるテーブルとビューをモデルとして追加します。

```bash
ddn model add pg_utokyo "*"
```

3. 併せて各モデルに対するコマンド（CRUD 操作）とリレーションを生成します。

```bash
ddn command add pg_utokyo "*"
ddn relationship add pg_utokyo "*"
```

## 4. スーパーグラフのビルドと API 起動

プロジェクトでは `supergraph.yaml` にサブグラフとして `pg_utokyo` が登録されています。以下のコマンドで GraphQL API をビルド・起動します。

```bash
# ビルド
ddn supergraph build local

# エンジンを Docker で起動
ddn run docker-start
```

起動後、`http://localhost:8181/v1/graphql` にアクセスすると GraphQL Playground が利用できます。ここから Students, Courses, Enrollments などのテーブルに対してクエリ・ミューテーションを発行できます。

## 5. 参考情報

- 詳細なセットアップ手順は `README.md` の "🛠️ セットアップ手順" セクションも参照してください。
- Hasura DDN の公式ドキュメントでは、データベースコネクタやサブグラフの設定方法などが解説されています。
