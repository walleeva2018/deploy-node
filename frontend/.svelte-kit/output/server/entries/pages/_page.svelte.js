import { c as create_ssr_component, d as escape } from "../../chunks/ssr.js";
/* empty css                                                     */
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  let persons = [];
  let searchQuery = "";
  if ($$props.data === void 0 && $$bindings.data && data !== void 0) $$bindings.data(data);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    persons.filter((person) => {
      if (!searchQuery.trim()) return true;
      const query = searchQuery.toLowerCase();
      return person.firstName.toLowerCase().includes(query) || person.lastName.toLowerCase().includes(query) || person.email.toLowerCase().includes(query) || person.phone.includes(query) || (person.address?.city || "").toLowerCase().includes(query) || (person.address?.state || "").toLowerCase().includes(query);
    });
    $$rendered = `${$$result.head += `<!-- HEAD_svelte-1enopw8_START -->${$$result.title = `<title>Person Manager - Home</title>`, ""}<!-- HEAD_svelte-1enopw8_END -->`, ""} <div class="space-y-6"><div class="flex flex-col md:flex-row md:justify-between md:items-center gap-4"><div data-svelte-h="svelte-1rphby8"><h1 class="text-3xl font-bold text-gray-900">Person Manager</h1> <p class="text-gray-600 mt-1">Manage your contacts with full CRUD operations</p></div> <div class="flex flex-col sm:flex-row gap-3"><button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-center">${escape("Add New Person")}</button> <a href="/person/new" class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-center" data-svelte-h="svelte-hpnnit">Full Form</a></div></div> ${``} ${``} ${``} ${`<div class="flex justify-center items-center h-64" data-svelte-h="svelte-5e6cdk"><div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>`}</div>`;
  } while (!$$settled);
  return $$rendered;
});
export {
  Page as default
};
