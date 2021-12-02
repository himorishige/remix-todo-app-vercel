# RemixでつくるWebアプリケーション〜準備編〜

先日リリースされたばかりのReactベースのフレームワークRemixでWebアプリケーションをつくるための下準備について。今回はTailwindを利用したスターターキットを用意していきます。

## はじめに

こんにちはCX事業本部MAD事業部の森茂です。  
社内はre:Invent一色ですが、フロントエンドも[React Conf 2021](https://conf.reactjs.org/)を前に勝手に盛り上がりたい！ということで先日リリースされたReactベースのフレームワークRemixについての記事を投下していきたいと思います:)

今回はRemixを使ってWebアプリケーションをつくる際のスターターキット的なものを用意してみました。なお、スタイリングにはTailwindを、デプロイ先はRemixリリースから早々に公式対応したVercelを利用しています。

<iframe class="hatenablogcard" style="width:100%;height:155px;max-width:680px;" title="Remix projects can now be deployed with zero configuration – Vercel" src="https://hatenablog-parts.com/embed?url=https://vercel.com/changelog/remix-projects-can-now-be-deployed-with-zero-configuration" width="300" height="150" frameborder="0" scrolling="no"></iframe>

## Remixのインストール

まずはRemixをインストールします。（執筆時のバージョンはv1.0.6）

```bash
$ npx create-remix@latest
```

スクリーンショット

インストール時にデプロイ先にあわせたテンプレートを選択する必要がありますが、今回はVercelを選択。ここで異なるテンプレートを選択しても後で変更することができますがそこそこ手間がかかるため先にデプロイ先を決めてからアプリケーションを作ることをオススメします。まだ確定していない場合はいったん基本的な構成の`Remix App Server`を選択しておくのがよさそうです。

### あとからデプロイ先を変更する場合

公式の方法では下記のように新規プロジェクトをつくりappディレクトリを移行する手法が案内されています。（追加したパッケージ類など別途手動で入れ直す必要がありますのでこのあたりが手間になるかなと思われます）

```sh
cd ..
# 新規にプロジェクトを作成します。新たに利用したいテンプレートを選択し直します。
npx create-remix@latest
cd my-new-remix-app
# 新規に作成したプロジェクトのappディレクトリを削除します。
rm -rf app
# 移行前のプロジェクトからappディレクトリを新規プロジェクトへコピーします。
cp -R ../my-old-remix-app/app app
# その後必要なファイルやパッケージ等を再インストール。
```

## テンプレートから使わないものを削除

インストール時に生成されるテンプレートにはデモ用のコードやサンプルコードが多く含まれているので不要なファイルや記述を削除します。

### 初期ファイル

```bash
$ tree remix-todo-app-vercel -a -L 3 -I "node_modules|.git"
remix-todo-app-vercel
├── .gitignore
├── README.md
├── api*
│   └── index.js
├── app
│   ├── entry.client.tsx
│   ├── entry.server.tsx
│   ├── root.tsx
│   ├── routes
│   │   ├── demos/
│   │   └── index.tsx
│   └── styles
│       ├── dark.css
│       ├── demos/
│       └── global.css
├── package-lock.json
├── package.json
├── public
│   └── favicon.ico
├── remix.config.js*
├── remix.env.d.ts
├── tsconfig.json
└── vercel.json*
```

※ * Remix App Serverテンプレートにないファイルまたは記載が異なるファイル

`app/routes/demos`ディレクトリとその中のファイル、`app/styles/`内のcssファイルを削除。`app/root.tsx`と`app/routes/index.tsx`も再利用可能なものをいくつか残して必要最小限に、余分なものは削除してしまいます。Remix開発チームは文字数が少ないという理由で`const`を使わずに`let`を利用しているそうなのですが、、気になる箇所は書き換えておきます:)

<iframe class="hatenablogcard" style="width:100%;height:155px;max-width:680px;" title="Ryan FlorenceさんはTwitterを使っています 「People keep acting like we're trying to make a statement by using `let` everywhere in Remix docs and source code. Nope. It's three letters and not five. That's it. That's why we use it.」 / Twitter" src="https://hatenablog-parts.com/embed?url=https://twitter.com/ryanflorence/status/1465690275540455426" width="300" height="150" frameborder="0" scrolling="no"></iframe>

### root.tsx

Layoutコンポーネント部分を削る以外はほぼそのまま流用していきます。

```typescript:app/root.tsx
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
} from 'remix';

// そのまま利用
export default function App() {
  return (
    <Document>
      <Layout>
        <Outlet />
      </Layout>
    </Document>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  // そのまま利用
}

export function CatchBoundary() {
  const caught = useCatch(); // let -> constに変更
  // そのまま利用
}

function Document({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <html lang="ja">
    {/* langのみjaに変更してあとはそのまま利用 */}
  )
}

// 必要最小限に変更
function Layout({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}
```

### routes/index.tsx

記載はほぼカットして一部のみ流用。

```typescript:app/routes/index.tsx
import type { MetaFunction } from 'remix';

export const meta: MetaFunction = () => {
  return {
    title: 'Remix Starter',
    description: 'Welcome to remix!',
  };
};

export default function Index() {
  return <div>Index</div>;
}
```

ここで問題なく開発サーバーが動作するか一度動作チェックしておきます。

```bash
$ npm run dev

> dev
> remix dev

Watching Remix app in development mode...
💿 Built in 246ms
Remix App Server started at http://localhost:3000
```

ブラウザで`http://localhost:3000`にアクセスして「Index」の文字が表示されればOKです。こちらをベースに進めていきます。

## PostCSS/Tailwind

Remixでは通常のCSSでのスタイリングを推しているようですが、今回は開発効率も考えて公式ドキュメントにも記載のあるTailwindを利用する形でセットアップしていきます。ドキュメントにはCSS-in-JSを利用する記載もあるようですが色々と手間がかかりそうなのでキャンセル。。

Tailwindを使うならUIコンポーネントにはTailwindと同じTailwind Labsが開発している[headless UI](https://headlessui.dev/)を使うとさらに開発が楽になります。

[公式ドキュメント](https://remix.run/docs/en/v1.0.6/guides/styling#postcss--tailwind)を参考にPostCSS/Tailwindのインストールとセットアップを行います。

### Tailwindに必要なパッケージをインストール

```bash
$ npm install -D tailwindcss@latest postcss@latest autoprefixer@latest postcss-cli@latest
```

Postcss、Tailwindに必要な設定ファイルを新規に作成していきます。

```js:postcss.config.js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}
  }
};
```

```js:tailwind.config.js
module.exports = {
  purge: [
    "./app/**/*.tsx",
    "./app/**/*.jsx",
    "./app/**/*.js",
    "./app/**/*.ts"
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {}
  },
  variants: {},
  plugins: []
};
```

CSSファイルについては公式ドキュメントを参考に配置していきます。編集するCSSファイルは`app`ディレクトリ外に配置して`postcss`で変換したものを`app`ディレクトリへ置くという構造です。（.gitignoreへの`app/styles`追加を推奨）

```bash
.
├── app
│   └── styles (変換されるファイルの配置先)
│       ├── app.css
│       └── routes
│           └── index.css
└── styles (編集するCSSファイルの配置先)
    ├── app.css
    └── routes
        └── index.css
```

公式ドキュメントではCSSビルド用タスクを分けて記載していますが、Postcssの変換作業を同時に実行したいので複数のコマンドを同時実行をしてくれる`concurrently`をインストールしておきます。また、後にSupabaseなど環境変数を利用するライブラリの利用も想定してここで`dot-env`もあわせてインストールしておきます。

```bash
$ npm install -D concurrently dotenv
```

`package.json`の`scripts`は下記のように変更します。`npm run dev`や`npm run build`時に`postcss`での変換も実行するようにしています。

```package.json
"scripts": {
  "build:remix": "remix build",
  "dev:remix": "node -r dotenv/config node_modules/.bin/remix dev",
  "build:css": "postcss styles --base styles --dir app/styles --env production",
  "dev:css": "postcss styles --base styles --dir app/styles -w",
  "dev": "concurrently \"npm:dev:*\"",
  "build": "npm run build:css && npm run build:remix",
  "postinstall": "remix setup node",
  "start": "remix-serve build"
},
```

TailwindのベースとなるCSSファイルを`/styles/app.css`として新規に作成します。

```css:/styles/app.css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

`root.tsx`に書き出したCSSファイルを読み込むよう記載を追記します。

```typescript:app/root.tsx
...
import type { LinksFunction } from "remix";
import styles from "~/styles/app.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};
...
```

ここであらためて`$ npm run dev`を実行して動作を確認します。ブラウザ上でTailwindのリセットCSSが反映されているのが確認できると思います。ここまででTailwindを利用したRemixのスターターキットが完成です。

## Vercelへのデプロイ

ここでVercelへのデプロイを確認しておきます。Vercelへのデプロイは非常に簡単でGitHubへ連携することで自動的にCI/CDを走らせデプロイまで自動的に行うことができてしまいます。なお、あらかじめGitHubのリポジトリを作成の上Vercelのアカウントを連携しておく必要があります。

https://vercel.com/new

使用するGitHubリポジトリを選択します。

5分程度でデプロイ完了です。これからはGitHubへPushするごとにデプロイが自動的に行われます。

## これから

Remixを使ったWebアプリケーションの下準備が完了しました。さてここから何をつくりましょうか。。🤔。
🤠