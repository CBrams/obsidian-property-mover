import { PropertyMoverCache, PropertyMoverPropertyTracker, PropertyMoverSettings } from "./interfaces";

export const DEFAULT_PROPERTY_CACHE : PropertyMoverCache = {
    loaded_properties_for_suggestions: [],
    loaded_directories_for_suggestions: []
}

export const DEFAULT_SETTINGS: PropertyMoverSettings = {
    ignore_empty_properties: false,
    replace_empty_properties_text: "[None]",
    property_trackers: [],
    cache: {...DEFAULT_PROPERTY_CACHE},
    ignored_directories: [],
}

export const DEFAULT_PROPERTY: PropertyMoverPropertyTracker = {
    propertyName: ""
}

