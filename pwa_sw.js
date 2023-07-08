const cacheName = 'pwagame-2048-v1'
const contentToCache = [
	'/',
	'index.html',
	'favicon.ico',
	'style/main.css',
	'style/fonts/',
	'style/fonts/clear-sans.css',
	'style/fonts/ClearSans-Bold-webfont.eot',
	'style/fonts/ClearSans-Bold-webfont.svg',
	'style/fonts/ClearSans-Bold-webfont.woff',
	'style/fonts/ClearSans-Light-webfont.eot',
	'style/fonts/ClearSans-Light-webfont.svg',
	'style/fonts/ClearSans-Light-webfont.woff',
	'style/fonts/ClearSans-Regular-webfont.eot',
	'style/fonts/ClearSans-Regular-webfont.svg',
	'style/fonts/ClearSans-Regular-webfont.woff',
	'js/animframe_polyfill.js',
	'js/application.js',
	'js/bind_polyfill.js',
	'js/classlist_polyfill.js',
	'js/game_manager.js',
	'js/grid.js',
	'js/html_actuator.js',
	'js/keyboard_input_manager.js',
	'js/local_storage_manager.js',
	'js/tile.js',
	'meta/apple-touch-icon.png',
	'meta/apple-touch-icon_96.png',
	'meta/apple-touch-icon_144.png',
	'meta/apple-touch-startup-image-640x920.png',
	'meta/apple-touch-startup-image-640x1096.png'
]

// Installing Service Worker
self.addEventListener('install', (e) => {
	console.log('[Service Worker] Install')
	e.waitUntil((async () => {
		const cache = await caches.open(cacheName)
		console.log('[Service Worker] Caching all: app shell and content')
		await cache.addAll(contentToCache);
	})())
})

// Fetching content using Service Worker
self.addEventListener('fetch', (e) => {
	// Cache http and https only, skip unsupported chrome-extension:// and file://...
	if (!(e.request.url.startsWith('http:') || e.request.url.startsWith('https:'))) {
		return
	}

	e.respondWith((async () => {
		const r = await caches.match(e.request)
		console.log(`[Service Worker] Fetching resource: ${e.request.url}`)
		if (r) return r
		const response = await fetch(e.request)
		const cache = await caches.open(cacheName)
		console.log(`[Service Worker] Caching new resource: ${e.request.url}`)
		cache.put(e.request, response.clone())
		return response
	})())
})
