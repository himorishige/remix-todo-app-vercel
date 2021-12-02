import { HeadersFunction, LoaderFunction, useLoaderData } from 'remix';

export const headers: HeadersFunction = () => {
  return {
    'Cache-Control': 'max-age=0, s-maxage=30, state-while-revalidate=30',
  };
};

export const loader: LoaderFunction = () => {
  return new Date().toString();
};

export default function Index() {
  const data = useLoaderData<string>();

  return (
    <div className="p-8">
      <h1>swr</h1>
      <p>{data}</p>
    </div>
  );
}
