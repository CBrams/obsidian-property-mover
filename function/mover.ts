import { App, Notice, TFile, getFrontMatterInfo, normalizePath, parseFrontMatterStringArray } from "obsidian";

const moveFile = async (app: App, file: TFile, targetPath: string) => {
    const target = normalizePath(targetPath);

    const existingFolder = app.vault.getFolderByPath(target);
    if(existingFolder == null){
        app.vault.createFolder(target);
    }

    const newPathForFile = normalizePath(target + '/' + file.basename + '.' + file.extension)
    if(newPathForFile == file.path){
        return; //No action needed
    }

    await app.fileManager.renameFile(file,newPathForFile);

    for (const [key,value] of Object.entries(app.metadataCache.getFileCache(new TFile)!.frontmatter!)){
        
    }
    new Notice(`[Obsidian property mover]\nMoved the note to "${newPathForFile}".`);
}