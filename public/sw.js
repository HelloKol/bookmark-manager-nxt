if(!self.define){let e,s={};const a=(a,n)=>(a=new URL(a+".js",n).href,s[a]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=a,e.onload=s,document.head.appendChild(e)}else e=a,importScripts(a),s()})).then((()=>{let e=s[a];if(!e)throw new Error(`Module ${a} didn’t register its module`);return e})));self.define=(n,i)=>{const t=e||("document"in self?document.currentScript.src:"")||location.href;if(s[t])return;let c={};const r=e=>a(e,t),o={module:{uri:t},exports:c,require:r};s[t]=Promise.all(n.map((e=>o[e]||r(e)))).then((e=>(i(...e),c)))}}define(["./workbox-4754cb34"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/dynamic-css-manifest.json",revision:"d751713988987e9331980363e24189ce"},{url:"/_next/static/GRe4tDqk7ckxfoznwNPFN/_buildManifest.js",revision:"92523dc854eaadc03b2960731d7ae9a6"},{url:"/_next/static/GRe4tDqk7ckxfoznwNPFN/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/_next/static/chunks/131-9c492a6d67bcb07b.js",revision:"9c492a6d67bcb07b"},{url:"/_next/static/chunks/842-20f21ea2362910cf.js",revision:"20f21ea2362910cf"},{url:"/_next/static/chunks/framework-b8ed9b642a1d405a.js",revision:"b8ed9b642a1d405a"},{url:"/_next/static/chunks/main-0e7c4635c8c81200.js",revision:"0e7c4635c8c81200"},{url:"/_next/static/chunks/pages/_app-e96f726a103187a7.js",revision:"e96f726a103187a7"},{url:"/_next/static/chunks/pages/_error-41608b100cc61246.js",revision:"41608b100cc61246"},{url:"/_next/static/chunks/pages/app-acd2f32dff284f21.js",revision:"acd2f32dff284f21"},{url:"/_next/static/chunks/pages/app/404-fc84893a5fd388a1.js",revision:"fc84893a5fd388a1"},{url:"/_next/static/chunks/pages/app/change-password-62d4fe2f68091f0a.js",revision:"62d4fe2f68091f0a"},{url:"/_next/static/chunks/pages/app/folder/%5Bslug%5D-b0972a9da3ba8960.js",revision:"b0972a9da3ba8960"},{url:"/_next/static/chunks/pages/app/login-b4dbb2aa3b04789b.js",revision:"b4dbb2aa3b04789b"},{url:"/_next/static/chunks/pages/app/register-f2369637598f75c0.js",revision:"f2369637598f75c0"},{url:"/_next/static/chunks/pages/app/reset-password-ade84eef77178f8d.js",revision:"ade84eef77178f8d"},{url:"/_next/static/chunks/pages/app/share/%5BfolderId%5D-ab772583babd3281.js",revision:"ab772583babd3281"},{url:"/_next/static/chunks/pages/app/tags-e7cfb24d24b889e3.js",revision:"e7cfb24d24b889e3"},{url:"/_next/static/chunks/pages/app/uncategorised-2b5981d00e1b45a7.js",revision:"2b5981d00e1b45a7"},{url:"/_next/static/chunks/pages/marketing-6681645bae6fbd00.js",revision:"6681645bae6fbd00"},{url:"/_next/static/chunks/polyfills-42372ed130431b0a.js",revision:"846118c33b2c0e922d7b3a7676f81f6f"},{url:"/_next/static/chunks/webpack-a91c5b7bfa5e5954.js",revision:"a91c5b7bfa5e5954"},{url:"/_next/static/css/df07daf1f6e10513.css",revision:"df07daf1f6e10513"},{url:"/favicon.ico",revision:"c30c7d42707a47a3f4591831641e50dc"},{url:"/file.svg",revision:"d09f95206c3fa0bb9bd9fefabfd0ea71"},{url:"/globe.svg",revision:"2aaafa6a49b6563925fe440891e32717"},{url:"/icons/android-chrome-192x192.png",revision:"9dbb9568d189a402387303fa783886ce"},{url:"/icons/icon-512x512.png",revision:"9734abe99bc7465b3c9b1afe842aab87"},{url:"/manifest.json",revision:"830b5120ce6deeae7a68a28249d4d3cc"},{url:"/next.svg",revision:"8e061864f388b47f33a1c3780831193e"},{url:"/static/demo.png",revision:"7a0dea80fbd63b5c0412bc16e791d5eb"},{url:"/static/hero.png",revision:"0c7a33b3bf256e8450a937ff4a892a44"},{url:"/static/macos-folder.png",revision:"16b68941fc1a069672f0e3ae0385d674"},{url:"/static/placeholder-600x400.png",revision:"2a7fbbd900e2fae6e746199e3e02e051"},{url:"/vercel.svg",revision:"c0af2f507b369b085b35ef4bbe3bcf1e"},{url:"/view-grid-svgrepo-com.svg",revision:"ff95d75cecee047ddfc583fc0b12a87c"},{url:"/view-list-svgrepo-com.svg",revision:"ac027b93a36363add2b3a29868877fbd"},{url:"/window.svg",revision:"a2760511c65806022ad20adf74370ff3"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:a,state:n})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const s=e.pathname;return!s.startsWith("/api/auth/")&&!!s.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
