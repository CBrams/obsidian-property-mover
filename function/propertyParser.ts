import { App, TFile } from "obsidian";
import { PropertyMoverSettings } from "settings/interfaces";

export const getFileProperties = (app: App, file: TFile) : Map<string,any> => {
    const metadata = app.metadataCache.getFileCache(file);
    if(metadata?.frontmatter == null){
        return new Map<string,any>();
    }
    let map = new Map<string,any>();
    for (const [key,value] of Object.entries(metadata!.frontmatter!)){
        map.set(key,value);
    }
    return map;
}

export const constructNewPath = (properties: Map<string,any>, settings: PropertyMoverSettings): string => {
    let path : string = "/";
    settings.property_trackers.forEach(pt => {
        let propertyValue = properties.get(pt.propertyName);
        if(propertyValue == null && !settings.ignore_empty_properties){
            path += settings.replace_empty_properties_text+"/";
        } else if (propertyValue != null) {
            if(Array.isArray(propertyValue)){
                path += handleArray(propertyValue) + "/";
            } else {
                path += handleString(propertyValue.toString()) + "/";
            }
        }
    })
    return path;
}

const handleArray = (array : any[]) : string => {
    return array.map(v => handleString(v.toString())).sort((a,b) => a.localeCompare(b)).join("-");
}

const handleString = (stringValue : string) : string => {
    return stripLinkText(stringValue);
}

const stripLinkText = (value: string) : string => {
    return value.replace(/\[\[(.*)\]\]/,"$1").trim();
}