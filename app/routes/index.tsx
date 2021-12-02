import { LoaderFunction, useLoaderData } from 'remix';

export const loader: LoaderFunction = async () => {
  return new Date().toString();
};

export default function Index() {
  const data = useLoaderData<string>();

  return (
    <div className="p-8">
      <h1>ssr</h1>
      <p>{data}</p>
    </div>
  );
}
