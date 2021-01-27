export default async function loadGeometries(geometry: "gemeentes" | "plaatsen" | "wereldsteden" | "nederland" | "wereld") {
    let url = `geometries/${geometry}.json`;
    if ("caches" in window) {
        const geometryCache = await caches.open("geometries");
        return geometryCache.match(url)
            .then(response => response!!.json())
            .catch(async reason => {
                console.log(`${url} not cached, putting in cache now`);
                geometryCache.add(url)
                const response = await fetch(url);
                return await response.json();
            })
    } else {
        const response = await fetch(url);
        return await response.json();
    }
}