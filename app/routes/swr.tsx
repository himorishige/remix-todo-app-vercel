import { HeadersFunction, LoaderFunction, useLoaderData } from 'remix';

export const headers: HeadersFunction = () => {
  // max-age=0 ブラウザにキャッシュさせない
  // s-maxage=30 vercel側の最大キャッシュ時間
  // stale-while-revalidate=30 30秒経過後新しいアクセスがあった場合、
  // そのアクセスに対してはキャッシュを渡し、バックグラウンドでは新規生成を行う
  // 生成完了後にキャシュを入れ替える
  return {
    'Cache-Control': 'max-age=0, s-maxage=30, stale-while-revalidate=30',
  };
};

export const loader: LoaderFunction = () => {
  return new Date().toUTCString();
};

export default function Index() {
  const data = useLoaderData<string>();

  return (
    <div className="p-8">
      <h1>swr</h1>
      <p>{data}</p>
      <h1>csr</h1>
      <p>{new Date().toUTCString()}</p>
    </div>
  );
}
