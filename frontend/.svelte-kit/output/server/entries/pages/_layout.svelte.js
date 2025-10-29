import { c as create_ssr_component, a as subscribe, e as each, b as add_attribute, d as escape, v as validate_component } from "../../chunks/ssr.js";
import { w as writable } from "../../chunks/index.js";
const toasts = writable([]);
function getToastClasses(type) {
  const baseClasses = "p-4 rounded-md shadow-lg border flex items-center gap-3 min-w-72 max-w-md";
  switch (type) {
    case "success":
      return `${baseClasses} bg-green-50 text-green-800 border-green-200`;
    case "error":
      return `${baseClasses} bg-red-50 text-red-800 border-red-200`;
    case "info":
    default:
      return `${baseClasses} bg-blue-50 text-blue-800 border-blue-200`;
  }
}
function getIconSvg(type) {
  switch (type) {
    case "success":
      return `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
					<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
				</svg>`;
    case "error":
      return `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
					<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
				</svg>`;
    case "info":
    default:
      return `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
					<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
				</svg>`;
  }
}
const ToastContainer = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $toasts, $$unsubscribe_toasts;
  $$unsubscribe_toasts = subscribe(toasts, (value) => $toasts = value);
  $$unsubscribe_toasts();
  return `${$toasts.length > 0 ? `<div class="fixed top-4 right-4 z-50 space-y-2">${each($toasts, (toast) => {
    return `<div${add_attribute("class", getToastClasses(toast.type), 0)}><div class="flex-shrink-0"><!-- HTML_TAG_START -->${getIconSvg(toast.type)}<!-- HTML_TAG_END --></div> <div class="flex-1">${escape(toast.message)}</div> <button class="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors" data-svelte-h="svelte-eoj7io"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg></button> </div>`;
  })}</div>` : ``}`;
});
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<div class="min-h-screen bg-gray-50"><nav class="bg-white shadow-sm border-b border-gray-200" data-svelte-h="svelte-1aaopqq"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="flex justify-between h-16"><div class="flex items-center"><a href="/" class="text-xl font-bold text-gray-900">Person Manager</a></div> <div class="flex items-center space-x-4"><a href="/" class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">Home</a> <a href="/person/new" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">Add Person</a></div></div></div></nav> <main class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">${slots.default ? slots.default({}) : ``}</main></div> ${validate_component(ToastContainer, "ToastContainer").$$render($$result, {}, {}, {})}`;
});
export {
  Layout as default
};
