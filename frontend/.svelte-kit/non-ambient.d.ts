
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	export interface AppTypes {
		RouteId(): "/" | "/api" | "/api/upload-image" | "/person" | "/person/new" | "/person/[id]" | "/person/[id]/edit";
		RouteParams(): {
			"/person/[id]": { id: string };
			"/person/[id]/edit": { id: string }
		};
		LayoutParams(): {
			"/": { id?: string };
			"/api": Record<string, never>;
			"/api/upload-image": Record<string, never>;
			"/person": { id?: string };
			"/person/new": Record<string, never>;
			"/person/[id]": { id: string };
			"/person/[id]/edit": { id: string }
		};
		Pathname(): "/" | "/api" | "/api/" | "/api/upload-image" | "/api/upload-image/" | "/person" | "/person/" | "/person/new" | "/person/new/" | `/person/${string}` & {} | `/person/${string}/` & {} | `/person/${string}/edit` & {} | `/person/${string}/edit/` & {};
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): string & {};
	}
}