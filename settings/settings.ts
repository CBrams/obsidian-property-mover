import { ButtonComponent, PluginSettingTab, Setting } from "obsidian";
import { PropertyMoverSettings } from "./interfaces";
import PropertyMover from "main";
import { DEFAULT_PROPERTY } from "./defaults";
import { MultiSuggest } from "./suggest";
import { getFileProperties } from "function/propertyParser";

export class PropertyMoverSettingsTab extends PluginSettingTab {
    plugin: PropertyMover

    display() {
        this.containerEl.empty();
        this.add_ignore_empty_properties_toggle();
        if(!this.plugin.settings.ignore_empty_properties){
            this.add_empty_properties_replacement_text();
        }
        this.add_button_to_update_set_of_properties();
        this.add_list_of_properties_to_track();
        this.add_to_list_of_ignored_directories();
        this.show_list_of_ignored_directories();
    }

    add_ignore_empty_properties_toggle(): void {
        const description = document.createDocumentFragment();
        description.append("This will ignore empty parameters, and just use the next property to create the directory");

        new Setting(this.containerEl)
            .setName("Ignore empty properties")
            .setDesc(description)
            .addToggle((toggle) => {
                toggle.setValue(this.plugin.settings.ignore_empty_properties).onChange(async (value) => {
                    this.plugin.settings.ignore_empty_properties = value;
                    await this.plugin.saveSettings();
                    this.display();
                })
            });
    }

    add_empty_properties_replacement_text(): void {
        const description = document.createDocumentFragment();
        description.append("This text will replace the text if an empty parameter is encountered")

        new Setting(this.containerEl)
            .setName("Replacement text")
            .setDesc(description)
            .addText((text) => {
                text.setValue(this.plugin.settings.replace_empty_properties_text).onChange(async (value) => {
                    this.plugin.settings.replace_empty_properties_text = value;
                    await this.plugin.saveSettings();
                    this.display();
                })
            })
    }


    add_button_to_update_set_of_properties(): void {
        const description = document.createDocumentFragment();
        description.append("Click here to update the tags open for suggestion, as well as the directories for exclusion")
        description.append(description.createEl('br'));
        description.append(description.createEl('strong', {text: 'Current count (properties): '+this.plugin.settings.cache.loaded_properties_for_suggestions.length}))
        description.append(description.createEl('strong', {text: 'Current count (directories): '+this.plugin.settings.cache.loaded_directories_for_suggestions.length}))

        new Setting(this.containerEl)
        .setName("Update properties for suggestions")
        .setDesc(description)
        .addButton(button => {
            button.setTooltip("Press to update properties")
            .setIcon('refresh-ccw-dot')
            .onClick( async () => {
                const files = this.app.vault.getMarkdownFiles();
                let setOfProperties = new Set<string>();
                files.forEach(file => {
                    const propertyMap = getFileProperties(this.app, file);
                    console.log(propertyMap)
                    propertyMap.forEach((value,key) => {
                        setOfProperties.add(key)}
                    );
                });
                const directories = this.app.vault.getAllFolders(false).map(dir => dir.path);
                this.plugin.settings.cache = {
                    loaded_properties_for_suggestions: Array.from(setOfProperties),
                    loaded_directories_for_suggestions: directories
                };
                await this.plugin.saveSettings();
                this.display();
            });
        })
    }

    add_to_list_of_ignored_directories(): void {
        const suggestions = new Set(this.plugin.settings.cache.loaded_directories_for_suggestions);

        const description = document.createDocumentFragment();
        description.append("Add directories to exclude from moving")
        description.append(description.createEl('br'));
        description.append("Remove directories by pressing x")


        new Setting(this.containerEl)
        .setName("New directory to ignore")
        .setDesc(description)
        .addSearch(textComponent => {
            new MultiSuggest(textComponent.inputEl,suggestions,async (v) => this.update_directory_to_be_excluded(v),this.app);
            
        })
    }

    show_list_of_ignored_directories(): void {
        this.plugin.settings.ignored_directories.forEach((property, index) => {
            const settingElement = new Setting(this.containerEl)
            .setName(property)
            .addExtraButton((cb) => {
                cb.setIcon('cross')
                    .setTooltip('Delete')
                    .onClick(async () => {
                        this.plugin.settings.ignored_directories.splice(index, 1);
                        await this.plugin.saveSettings();
                        this.display();
                    });
            });
        })
    }


    add_list_of_properties_to_track(): void {
        //TODO Consider just doing the ignore if missing here...
        this.add_button_to_add_more_properties_to_track();

        const suggestions = new Set(this.plugin.settings.cache.loaded_properties_for_suggestions);

        this.plugin.settings.property_trackers.forEach((property, index) => {
            const settingElement = new Setting(this.containerEl)
            .addText((text) => {
                text.setValue(this.plugin.settings.property_trackers[index].propertyName).onChange(async (value) => {
                    this.update_property_to_be_tracked(value,index);
                })
            })
            .addSearch(textComponent => {
                new MultiSuggest(textComponent.inputEl,suggestions,async (v) => this.update_property_to_be_tracked(v,index),this.app);
                
            })
            .addExtraButton((cb) => {
                cb.setIcon('cross')
                    .setTooltip('Delete')
                    .onClick(async () => {
                        this.plugin.settings.property_trackers.splice(index, 1);
                        await this.plugin.saveSettings();
                        this.display();
                    });
            });
        })
    }

    //This is called from add_list_of_properties_to_track
    private add_button_to_add_more_properties_to_track(): void {
        const description = document.createDocumentFragment();
        description.append("Add new property to track");
        description.append(description.createEl('br'))
        description.append("List of properties to track. Note that they will applied consecutively from top to bottom");

        new Setting(this.containerEl)

			.setName('Add new propertyToTrack')
			.setDesc(description)
			.addButton((button: ButtonComponent) => {
				button
					.setTooltip('Add new property')
					.setButtonText('+')
					.setCta()
					.onClick(async () => {
						this.plugin.settings.property_trackers.push({...DEFAULT_PROPERTY});
						await this.plugin.saveSettings();
						this.display();
					});
			});
    }

    private async update_property_to_be_tracked(newValue: string, index: number){
        this.plugin.settings.property_trackers[index] = {
            propertyName: newValue
        }
        await this.plugin.saveSettings();
        this.display();
    }

    private async update_directory_to_be_excluded(newValue: string){
        if(this.plugin.settings.ignored_directories.contains(newValue)){
            return;
        }
        this.plugin.settings.ignored_directories = [...this.plugin.settings.ignored_directories, newValue]
        await this.plugin.saveSettings();
        this.display();
    }
}