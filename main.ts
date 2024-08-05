import { handleFile, moveFile } from 'function/mover';
import { constructNewPath, getFileProperties } from 'function/propertyParser';
import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { DEFAULT_SETTINGS } from 'settings/defaults';
import { PropertyMoverSettings } from 'settings/interfaces';
import { PropertyMoverSettingsTab } from 'settings/settings';

// Remember to rename these classes and interfaces!

export default class PropertyMover extends Plugin {
	settings: PropertyMoverSettings;

	async onload() {
		await this.loadSettings();

		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon('arrow-up-from-dot', 'Move defined by property', async (evt: MouseEvent) => {
			// Called when the user clicks the icon.
			const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
			await handleFile(this.app,markdownView?.file,this.settings);
		});
		// Perform additional things with the ribbon
		ribbonIconEl.addClass('my-plugin-ribbon-class');

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: 'move-all-files-according-to-properties',
			name: 'Move all files according to properties',
			callback: () => {
				const files = this.app.vault.getMarkdownFiles();
				files.forEach(async f => await handleFile(this.app,f,this.settings));
			}
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new PropertyMoverSettingsTab(this.app, this));

	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

