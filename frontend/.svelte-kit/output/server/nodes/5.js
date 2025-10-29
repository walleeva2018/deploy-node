import * as server from '../entries/pages/person/new/_page.server.ts.js';

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/person/new/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/person/new/+page.server.ts";
export const imports = ["_app/immutable/nodes/5.DEslKKAg.js","_app/immutable/chunks/udWJkB2W.js","_app/immutable/chunks/IHki7fMi.js","_app/immutable/chunks/DnrJa5CO.js","_app/immutable/chunks/DNupYTse.js","_app/immutable/chunks/DtMNPjmS.js","_app/immutable/chunks/xuENUTr7.js","_app/immutable/chunks/DEmDFwBb.js","_app/immutable/chunks/Z6qFSLVo.js"];
export const stylesheets = ["_app/immutable/assets/PersonForm.CKfn0Pse.css"];
export const fonts = [];
