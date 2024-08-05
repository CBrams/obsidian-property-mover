import { App, Notice, TFile, getFrontMatterInfo, normalizePath, parseFrontMatterStringArray } from "obsidian";
import { constructNewPath, getFileProperties } from "./propertyParser";
import { PropertyMoverSettings } from "settings/interfaces";

export const moveFile = async (app: App, file: TFile, targetPath: string) => {
    const target = normalizePath(targetPath);

    const existingFolder = app.vault.getFolderByPath(target);
    if(existingFolder == null){
        await app.vault.createFolder(target);
    }

    const newPathForFile = normalizePath(target + '/' + file.basename + '.' + file.extension)
    if(newPathForFile == file.path){
        return; //No action needed
    }

    await app.fileManager.renameFile(file,newPathForFile);

    new Notice(`[Obsidian property mover]\nMoved the note to "${newPathForFile}".`);
}

export const handleFile = async (app: App, file: TFile | null | undefined, settings: PropertyMoverSettings) => {
    if (file != null && file != undefined) {
        const properties = getFileProperties(app, file);
        const newPath = constructNewPath(properties,settings);
        moveFile(app, file,newPath);
    }
}