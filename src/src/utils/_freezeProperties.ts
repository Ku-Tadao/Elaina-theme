/**
 * Freezes properties of an object to prevent modification
 * @param object The object to freeze properties on
 * @param properties The list of properties to freeze, if empty all properties will be frozen
 */
export function freezeProperties(object: Object, properties: any[]) {
	for (const type in object) {
		if ((properties && properties.length && properties.includes(type)) || (!properties || !properties.length)) {
			let value = object[type]
			try {
				Object.defineProperty(object, type, {
					configurable: false,
					get: () => value,
					set: (v) => v,
				})
			}
			catch {}
		}
	}
}
