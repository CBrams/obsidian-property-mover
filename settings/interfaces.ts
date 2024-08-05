
export interface PropertyMoverSettings {
    ignore_empty_properties: boolean;
    replace_empty_properties_text: string;
    property_trackers: PropertyMoverPropertyTracker[];
    cache: PropertyMoverCache;
    ignored_directories: string[];
}

export interface PropertyMoverPropertyTracker {
    propertyName: string;
}

export interface PropertyMoverCache {
    loaded_properties_for_suggestions: Array<string>;
    loaded_directories_for_suggestions: Array<string>;
}