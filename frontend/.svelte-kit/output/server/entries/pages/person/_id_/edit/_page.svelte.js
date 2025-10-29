import { c as create_ssr_component, a as subscribe, b as add_attribute, d as escape } from "../../../../../chunks/ssr.js";
import { p as page } from "../../../../../chunks/stores.js";
import "@sveltejs/kit/internal";
import "../../../../../chunks/exports.js";
import "../../../../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../../../../chunks/state.svelte.js";
/* empty css                                                              */
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  let { data } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0) $$bindings.data(data);
  $page.params.id;
  $$unsubscribe_page();
  return `${$$result.head += `<!-- HEAD_svelte-vpq1g_START -->${$$result.title = `<title>${escape("Loading... - Person Manager")}</title>`, ""}<!-- HEAD_svelte-vpq1g_END -->`, ""} <div class="max-w-2xl mx-auto"><div class="mb-6"><nav class="flex mb-4"><a${add_attribute("href", "/", 0)} class="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"><svg class="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
				Back to Details</a></nav> <h1 class="text-2xl font-bold text-gray-900" data-svelte-h="svelte-1uiso2u">Edit Person</h1> ${``}</div> ${`<div class="flex justify-center items-center h-64" data-svelte-h="svelte-5e6cdk"><div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>`}</div>`;
});
export {
  Page as default
};
