export interface Post {
  slug: string;
  title: string;
  description: string;
  content: string;
  date: string;
  author: string;
}

export const posts: Post[] = [
  {
    slug: "primeiro-post",
    title: "Bem-vindo ao Blog",
    description: "Este é o primeiro post do nosso blog moderno.",
    content: `
      <p>Bem-vindo ao nosso blog! Este é o primeiro post de muitos que virão.</p>
      <p>Este blog foi construído com Next.js 15, TypeScript e Tailwind CSS, oferecendo uma experiência moderna e rápida.</p>
      <p>Fique atento para mais conteúdo interessante nos próximos posts!</p>
    `,
    date: "2024-01-15",
    author: "Autor do Blog",
  },
  {
    slug: "nextjs-15-recursos",
    title: "Recursos do Next.js 15",
    description: "Descubra os principais recursos e melhorias do Next.js 15.",
    content: `
      <p>O Next.js 15 trouxe várias melhorias significativas para o desenvolvimento web.</p>
      <h2>Principais Recursos</h2>
      <ul>
        <li>App Router aprimorado</li>
        <li>Melhorias de performance</li>
        <li>TypeScript de primeira classe</li>
        <li>Server Components otimizados</li>
      </ul>
      <p>Essas melhorias tornam o desenvolvimento ainda mais eficiente e agradável.</p>
    `,
    date: "2024-01-20",
    author: "Autor do Blog",
  },
  {
    slug: "tailwind-css-design",
    title: "Design Moderno com Tailwind CSS",
    description: "Aprenda a criar designs modernos e responsivos com Tailwind CSS.",
    content: `
      <p>O Tailwind CSS revoluciona a forma como criamos estilos em nossos projetos.</p>
      <p>Com utilitários prontos para uso, podemos construir interfaces bonitas e responsivas rapidamente.</p>
      <h2>Vantagens</h2>
      <ul>
        <li>Desenvolvimento rápido</li>
        <li>Design responsivo fácil</li>
        <li>Customização flexível</li>
        <li>Bundle otimizado</li>
      </ul>
    `,
    date: "2024-01-25",
    author: "Autor do Blog",
  },
];

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug);
}

export function getAllPosts(): Post[] {
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}



