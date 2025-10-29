import { c as create_ssr_component, a as subscribe, d as escape } from "../../../../chunks/ssr.js";
import { p as page } from "../../../../chunks/stores.js";
import "@sveltejs/kit/internal";
import "../../../../chunks/exports.js";
import "../../../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../../../chunks/state.svelte.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  $page.params.id;
  $$unsubscribe_page();
  return `${$$result.head += `<!-- HEAD_svelte-1nebi5m_START -->${$$result.title = `<title>${escape("Loading... - Person Manager")}</title>`, ""}<!-- HEAD_svelte-1nebi5m_END -->`, ""} <div class="max-w-2xl mx-auto"><div class="mb-6"><nav class="flex mb-4" data-svelte-h="svelte-15elsds"><a href="/" class="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"><svg class="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
				Back to Home</a></nav> ${``}</div> ${`<div class="flex justify-center items-center h-64" data-svelte-h="svelte-5e6cdk"><div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>`}</div>`;
});
export {
  Page as default
};
