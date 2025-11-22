export interface DemoScenario {
  id: string;
  title: string;
  description: string;
  beforeCode: string;
  afterCode: string;
  issues: Array<{
    type: string;
    severity: 'high' | 'medium' | 'low';
    description: string;
    fixedByLayer: number;
    ruleId: string;
  }>;
  layerBreakdown: Array<{
    layerId: number;
    name: string;
    issuesFound: number;
    fixes: string[];
  }>;
}

export const demoScenarios: DemoScenario[] = [
  {
    id: 'hydration',
    title: 'Hydration Error Fix',
    description: 'Fixes common React hydration mismatches from browser API usage',
    beforeCode: `export default function UserProfile() {
  const userId = localStorage.getItem('userId');
  const theme = window.matchMedia('(prefers-color-scheme: dark)').matches 
    ? 'dark' 
    : 'light';

  return (
    <div className={theme}>
      <h1>Welcome User #{userId}</h1>
      <p>Current time: {new Date().toLocaleString()}</p>
    </div>
  );
}`,
    afterCode: `'use client';
import { useEffect, useState } from 'react';

export default function UserProfile() {
  const [userId, setUserId] = useState<string | null>(null);
  const [theme, setTheme] = useState('light');
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    setUserId(localStorage.getItem('userId'));
    setTheme(
      window.matchMedia('(prefers-color-scheme: dark)').matches 
        ? 'dark' 
        : 'light'
    );
    setCurrentTime(new Date().toLocaleString());
  }, []);

  return (
    <div className={theme}>
      <h1>Welcome User #{userId || 'Guest'}</h1>
      <p>Current time: {currentTime}</p>
    </div>
  );
}`,
    issues: [
      {
        type: 'hydration-risk',
        severity: 'high',
        description: 'Direct localStorage access causes hydration mismatch',
        fixedByLayer: 4,
        ruleId: 'hydration-browser-api'
      },
      {
        type: 'hydration-risk',
        severity: 'high',
        description: 'window.matchMedia access during render causes mismatch',
        fixedByLayer: 4,
        ruleId: 'hydration-window-api'
      },
      {
        type: 'hydration-risk',
        severity: 'medium',
        description: 'Date instantiation differs between server/client',
        fixedByLayer: 4,
        ruleId: 'hydration-date-mismatch'
      }
    ],
    layerBreakdown: [
      {
        layerId: 4,
        name: 'Hydration',
        issuesFound: 3,
        fixes: [
          'Wrapped browser API calls in useEffect',
          'Added client-side state management',
          'Implemented safe hydration pattern with defaults'
        ]
      }
    ]
  },
  {
    id: 'accessibility',
    title: 'Accessibility Improvements',
    description: 'Enhances component accessibility with ARIA labels and semantic HTML',
    beforeCode: `export function ProductCard({ product }) {
  return (
    <div onClick={() => buyProduct(product.id)}>
      <img src={product.image} />
      <div>{product.name}</div>
      <div>{product.price}</div>
      <div className="icon" onClick={handleFavorite}>
        ♥
      </div>
    </div>
  );
}`,
    afterCode: `export function ProductCard({ product }) {
  return (
    <article role="article">
      <button 
        onClick={() => buyProduct(product.id)}
        aria-label={\`Buy \${product.name}\`}
      >
        <img 
          src={product.image} 
          alt={product.name}
        />
        <h3>{product.name}</h3>
        <p aria-label={\`Price: \${product.price}\`}>
          {product.price}
        </p>
      </button>
      <button 
        className="icon" 
        onClick={handleFavorite}
        aria-label="Add to favorites"
      >
        <span aria-hidden="true">♥</span>
      </button>
    </article>
  );
}`,
    issues: [
      {
        type: 'accessibility',
        severity: 'high',
        description: 'Clickable div should be a button for keyboard navigation',
        fixedByLayer: 3,
        ruleId: 'a11y-interactive-element'
      },
      {
        type: 'accessibility',
        severity: 'high',
        description: 'Image missing alt text for screen readers',
        fixedByLayer: 3,
        ruleId: 'a11y-img-alt'
      },
      {
        type: 'accessibility',
        severity: 'medium',
        description: 'Button missing aria-label for context',
        fixedByLayer: 3,
        ruleId: 'a11y-button-label'
      },
      {
        type: 'accessibility',
        severity: 'medium',
        description: 'Use semantic HTML for better structure',
        fixedByLayer: 3,
        ruleId: 'a11y-semantic-html'
      }
    ],
    layerBreakdown: [
      {
        layerId: 3,
        name: 'Components',
        issuesFound: 4,
        fixes: [
          'Replaced div with semantic button elements',
          'Added descriptive aria-labels for all interactive elements',
          'Added alt text to images',
          'Used semantic article and heading tags'
        ]
      }
    ]
  },
  {
    id: 'performance',
    title: 'Performance Optimization',
    description: 'Optimizes re-renders and prevents memory leaks',
    beforeCode: `export function Dashboard({ data }) {
  const processedData = data.map(item => ({
    ...item,
    calculated: expensiveCalculation(item)
  }));

  useEffect(() => {
    const interval = setInterval(() => {
      fetchUpdates();
    }, 1000);
  }, []);

  return (
    <div>
      {processedData.map(item => (
        <Card key={item.id} data={item} />
      ))}
    </div>
  );
}`,
    afterCode: `import { useMemo, useEffect, useCallback } from 'react';

export function Dashboard({ data }) {
  const processedData = useMemo(
    () => data.map(item => ({
      ...item,
      calculated: expensiveCalculation(item)
    })),
    [data]
  );

  const fetchUpdates = useCallback(() => {
    // fetch logic
  }, []);

  useEffect(() => {
    const interval = setInterval(fetchUpdates, 1000);
    return () => clearInterval(interval);
  }, [fetchUpdates]);

  return (
    <div>
      {processedData.map(item => (
        <Card key={item.id} data={item} />
      ))}
    </div>
  );
}`,
    issues: [
      {
        type: 'performance',
        severity: 'high',
        description: 'Expensive calculation runs on every render',
        fixedByLayer: 2,
        ruleId: 'perf-usememo-missing'
      },
      {
        type: 'memory-leak',
        severity: 'high',
        description: 'setInterval not cleaned up on unmount',
        fixedByLayer: 2,
        ruleId: 'memory-interval-cleanup'
      },
      {
        type: 'performance',
        severity: 'medium',
        description: 'Function recreated on every render in useEffect',
        fixedByLayer: 2,
        ruleId: 'perf-usecallback-missing'
      }
    ],
    layerBreakdown: [
      {
        layerId: 2,
        name: 'Patterns',
        issuesFound: 3,
        fixes: [
          'Wrapped expensive calculation in useMemo',
          'Added cleanup function to useEffect',
          'Used useCallback for stable function reference'
        ]
      }
    ]
  },
  {
    id: 'missing-keys',
    title: 'Missing Key Props',
    description: 'Automatically adds key props to mapped elements',
    beforeCode: `export function TodoList({ todos }) {
  return (
    <ul>
      {todos.map(todo => (
        <li>
          <input type="checkbox" checked={todo.completed} />
          <span>{todo.title}</span>
        </li>
      ))}
    </ul>
  );
}

function TagList({ tags }) {
  return (
    <div>
      {tags.map(tag => <span className="tag">{tag}</span>)}
    </div>
  );
}`,
    afterCode: `export function TodoList({ todos }) {
  return (
    <ul>
      {todos.map((todo, index) => (
        <li key={todo.id || index}>
          <input type="checkbox" checked={todo.completed} />
          <span>{todo.title}</span>
        </li>
      ))}
    </ul>
  );
}

function TagList({ tags }) {
  return (
    <div>
      {tags.map((tag, index) => (
        <span key={index} className="tag">
          {tag}
        </span>
      ))}
    </div>
  );
}`,
    issues: [
      {
        type: 'react-key',
        severity: 'high',
        description: 'Missing key prop in list item inside .map()',
        fixedByLayer: 3,
        ruleId: 'react-missing-key'
      },
      {
        type: 'react-key',
        severity: 'high',
        description: 'Missing key prop in mapped span element',
        fixedByLayer: 3,
        ruleId: 'react-missing-key'
      }
    ],
    layerBreakdown: [
      {
        layerId: 3,
        name: 'Components',
        issuesFound: 2,
        fixes: [
          'Added key prop using unique ID when available',
          'Fallback to index when no unique identifier exists',
          'Added index parameter to map callback for key generation'
        ]
      }
    ]
  },
  {
    id: 'nextjs-migration',
    title: 'Next.js App Router Migration',
    description: 'Migrates Pages Router code to App Router patterns',
    beforeCode: `// pages/blog/[slug].js
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function BlogPost({ post }) {
  const router = useRouter();
  
  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Head>
        <title>{post.title}</title>
        <meta name="description" content={post.excerpt} />
      </Head>
      <article>
        <h1>{post.title}</h1>
        <div>{post.content}</div>
      </article>
    </>
  );
}

export async function getStaticProps({ params }) {
  const post = await fetchPost(params.slug);
  return { props: { post } };
}`,
    afterCode: `// app/blog/[slug]/page.tsx
import { Metadata } from 'next';

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = await fetchPost(params.slug);
  
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogPost({ params }: PageProps) {
  const post = await fetchPost(params.slug);

  return (
    <article>
      <h1>{post.title}</h1>
      <div>{post.content}</div>
    </article>
  );
}`,
    issues: [
      {
        type: 'nextjs-migration',
        severity: 'high',
        description: 'Pages Router pattern needs migration to App Router',
        fixedByLayer: 5,
        ruleId: 'nextjs-app-router-migration'
      },
      {
        type: 'nextjs-migration',
        severity: 'high',
        description: 'getStaticProps replaced with Server Component data fetching',
        fixedByLayer: 5,
        ruleId: 'nextjs-data-fetching'
      },
      {
        type: 'nextjs-migration',
        severity: 'medium',
        description: 'Head component replaced with Metadata API',
        fixedByLayer: 5,
        ruleId: 'nextjs-metadata-api'
      },
      {
        type: 'nextjs-migration',
        severity: 'medium',
        description: 'useRouter hook removed (Server Component)',
        fixedByLayer: 5,
        ruleId: 'nextjs-server-component'
      }
    ],
    layerBreakdown: [
      {
        layerId: 5,
        name: 'Next.js Router',
        issuesFound: 4,
        fixes: [
          'Converted Pages Router file to App Router structure',
          'Replaced getStaticProps with async Server Component',
          'Migrated Head component to generateMetadata API',
          'Removed client-side router hooks from Server Component'
        ]
      }
    ]
  }
];
