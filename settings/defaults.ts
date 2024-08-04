import { PropertyMoverPropertyCache, PropertyMoverPropertyTracker, PropertyMoverSettings } from "./interfaces";

export const DEFAULT_PROPERTY_CACHE : PropertyMoverPropertyCache = {
    loaded_properties_for_suggestions: []
}

export const DEFAULT_SETTINGS: PropertyMoverSettings = {
    ignore_empty_properties: false,
    replace_empty_properties_text: "[None]",
    property_trackers: [],
    property_cache: {...DEFAULT_PROPERTY_CACHE}
}

export const DEFAULT_PROPERTY: PropertyMoverPropertyTracker = {
    propertyName: ""
}

