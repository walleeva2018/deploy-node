export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set([]),
	mimeTypes: {},
	_: {
		client: {start:"_app/immutable/entry/start.Dr3xmGsl.js",app:"_app/immutable/entry/app.Ccte2GkA.js",imports:["_app/immutable/entry/start.Dr3xmGsl.js","_app/immutable/chunks/DnrJa5CO.js","_app/immutable/chunks/udWJkB2W.js","_app/immutable/chunks/DNupYTse.js","_app/immutable/entry/app.Ccte2GkA.js","_app/immutable/chunks/udWJkB2W.js","_app/immutable/chunks/IHki7fMi.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js')),
			__memo(() => import('./nodes/3.js')),
			__memo(() => import('./nodes/4.js')),
			__memo(() => import('./nodes/5.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/api/upload-image",
				pattern: /^\/api\/upload-image\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/upload-image/_server.ts.js'))
			},
			{
				id: "/person/new",
				pattern: /^\/person\/new\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 5 },
				endpoint: null
			},
			{
				id: "/person/[id]",
				pattern: /^\/person\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/person/[id]/edit",
				pattern: /^\/person\/([^/]+?)\/edit\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
