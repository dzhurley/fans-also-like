import vercel from '@sveltejs/adapter-vercel';

export default {
  kit: {
    adapter: vercel(),
    files: {
      lib: 'src/lib',
    },
  },
};
