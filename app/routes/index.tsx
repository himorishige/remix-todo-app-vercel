import type { MetaFunction } from 'remix';

export let meta: MetaFunction = () => {
  return {
    title: 'Remix Starter',
    description: 'Welcome to remix!',
  };
};

export default function Index() {
  return <div>Index</div>;
}
