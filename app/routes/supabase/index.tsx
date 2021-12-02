import {
  json,
  Link,
  LoaderFunction,
  MetaFunction,
  Outlet,
  useLoaderData,
} from 'remix';
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
