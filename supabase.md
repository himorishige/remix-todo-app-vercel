## Supabaseのセットアップ

バックエンド側にSupabaseを利用します。SupabaseのアカウントとAPI URL、API KEYについては以前公開しました下記記事を参照に取得してください。取得したAPI URLとAPI KEYは`.env`ファイルを作成して記載しておきます。

```sh:.env
SUPABASE_URL=https://xxxxxxxxx.supabase.co
SUPABASE_ANON_KEY=xxxxxxxxxxxxxxxxxxxxxxxx
```

<iframe class="hatenablogcard" style="width:100%;height:155px;max-width:680px;" title="オープンソースで話題のBaaS「Supabase」を使ってみた | DevelopersIO" src="https://hatenablog-parts.com/embed?url=https://dev.classmethod.jp/articles/tried-using-supabase/" width="300" height="150" frameborder="0" scrolling="no"></iframe>

### テーブルの作成

今回は下記のような構成でテーブルを作成しました。

あわせて表示確認用に2件ほどテストデータを入れておきます。

## Supabaseクライアントの作成

Supabaseを利用するためのクライアントを用意します。

```bash
$ npm install @supabase/supabase-js
```

```typescript:app/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

表示のテスト用に`index.tsx`からSupabaseへ接続して情報を取得します。

```typescript:app/routes/index.tsx
import { json, LoaderFunction, MetaFunction, useLoaderData } from 'remix';
import { supabase } from '~/lib/supabaseClient';
import type { Item } from '~/types';

export let meta: MetaFunction = () => {
  return {
    title: 'Remix Starter',
    description: 'Welcome to remix!',
  };
};

// loaderとしてexportした返り値がコンポーネントに渡される
export const loader: LoaderFunction = async () => {
  const { data, error } = await supabase
    .from<Item>('todo')
    .select('*')
    .order('id');
  if (error) {
    // json()をthrowするとステータスコードやメッセージをコントロールできる
    throw json(error.message, { status: 500 });
  }
  return data ?? [];
};

export default function Index() {
  // useLoaderDataでloaderの値を取得する
  const data = useLoaderData<Item[]>();

  if (!data.length)
    return <div className="p-4">登録されたタスクはありません。</div>;

  return (
    <div className="p-4">
      <ul>
        {data.map((item) => (
          <li key={item.id}>
            {item.title} {item.created_at}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

```typescript:app/types/index.ts
export type Item = {
  id: number;
  title: string;
  created_at: string;
  updated_at: string;
  is_completed: boolean;
};
```

これでSupabaseに登録したタスクの一覧を取得して表示できました。