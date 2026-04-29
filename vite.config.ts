import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, '.', '');
	return {
		plugins: [sveltekit(), tailwindcss()],
		define: {
			'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
		},
		server: {
			// HMR is disabled in AI Studio via DISABLE_HMR env var.
			// Do not modify—file watching is disabled to prevent flickering during agent edits.
			hmr: process.env.DISABLE_HMR !== 'true',
			port: 3000,
			host: '0.0.0.0'
		},
	};
});
