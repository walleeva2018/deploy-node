import * as server from '../entries/pages/_page.server.ts.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/+page.server.ts";
export const imports = ["_app/immutable/nodes/2.B-rEVgAU.js","_app/immutable/chunks/udWJkB2W.js","_app/immutable/chunks/Z6qFSLVo.js","_app/immutable/chunks/IHki7fMi.js","_app/immutable/chunks/DtMNPjmS.js","_app/immutable/chunks/xuENUTr7.js","_app/immutable/chunks/DNupYTse.js","_app/immutable/chunks/DEmDFwBb.js"];
export const stylesheets = ["_app/immutable/assets/PersonForm.CKfn0Pse.css","_app/immutable/assets/2.DJHycCbA.css"];
export const fonts = [];
