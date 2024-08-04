
export interface PropertyMoverSettings {
    ignore_empty_properties: boolean;
    replace_empty_properties_text: string;
    property_trackers: PropertyMoverPropertyTracker[];
    property_cache: PropertyMoverPropertyCache;
}

export interface PropertyMoverPropertyTracker {
    propertyName: string
}

export interface PropertyMoverPropertyCache {
    loaded_properties_for_suggestions: Array<string>;
}